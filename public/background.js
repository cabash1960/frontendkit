// public/background.js

const PARENT_CONTEXT_MENU_ID = "add-to-cunningkit-parent";

let lastSectionSignature = "";
let isRebuilding = false;
let rebuildQueued = false;

function getSectionSignature(sections) {
  return sections.map((s) => `${s.id}:${s.name}`).join("|");
}

// Promisified wrappers so we can guarantee ordering
function removeAllMenus() {
  return new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      if (chrome.runtime.lastError) {
        console.warn("removeAll failed:", chrome.runtime.lastError.message);
      }
      resolve();
    });
  });
}

function createMenu(props) {
  return new Promise((resolve) => {
    chrome.contextMenus.create(props, () => {
      if (chrome.runtime.lastError) {
        console.warn(
          `Context menu create (${props.id}) failed:`,
          chrome.runtime.lastError.message,
        );
      }
      resolve();
    });
  });
}

function getStoredSections() {
  return new Promise((resolve) => {
    chrome.storage.local.get("sections", (data) => {
      resolve(data.sections || []);
    });
  });
}

// Builds the menu from scratch. Assumes removeAll() already ran.
async function buildContextMenus() {
  await createMenu({
    id: PARENT_CONTEXT_MENU_ID,
    title: "Add to CunningKit",
    contexts: ["page", "link", "selection"],
  });

  const sections = await getStoredSections();
  lastSectionSignature = getSectionSignature(sections);

  if (sections.length > 0) {
    // Create children sequentially, AFTER the parent create() resolved above
    for (const section of sections) {
      await createMenu({
        id: `add-to-section-${section.id}`,
        parentId: PARENT_CONTEXT_MENU_ID,
        title: `Add to: ${section.name}`,
        contexts: ["page", "link", "selection"],
      });
    }
  } else {
    await createMenu({
      id: "no-sections",
      parentId: PARENT_CONTEXT_MENU_ID,
      title: "No sections found. Open CunningKit to create one.",
      enabled: false,
      contexts: ["page", "link", "selection"],
    });
  }
}

// Only one rebuild runs at a time. If a rebuild is requested while one is
// already in progress, we just queue a single follow-up rebuild instead of
// letting them race.
async function rebuildContextMenus() {
  if (isRebuilding) {
    rebuildQueued = true;
    return;
  }

  isRebuilding = true;
  try {
    await removeAllMenus();
    await buildContextMenus();
  } catch (err) {
    console.error("Context menu rebuild failed:", err);
  } finally {
    isRebuilding = false;
    if (rebuildQueued) {
      rebuildQueued = false;
      rebuildContextMenus();
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  rebuildContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
  rebuildContextMenus();
});

// Only rebuild when the section SET (ids/names) actually changes —
// not on every link addition to a section's details.
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.sections) {
    const newSections = changes.sections.newValue || [];
    const newSignature = getSectionSignature(newSections);

    if (newSignature !== lastSectionSignature) {
      lastSectionSignature = newSignature;
      rebuildContextMenus();
    }
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("CLICKED ->", info.menuItemId, typeof info.menuItemId);
  const menuItemId = String(info.menuItemId);
  if (!menuItemId.startsWith("add-to-section-")) return;

  const sectionId = menuItemId.replace("add-to-section-", "");

  let linkData;
  if (info.linkUrl) {
    linkData = {
      url: info.linkUrl,
      urlName: info.selectionText || info.linkUrl,
    };
  } else if (info.selectionText) {
    linkData = { url: tab.url, urlName: info.selectionText };
  } else {
    linkData = { url: tab.url, urlName: tab.title || tab.url };
  }

  if (!linkData.url) return;

  try {
    const data = await chrome.storage.local.get("sections");
    if (!data.sections) {
      console.warn("No sections found in storage; cannot add link.");
      return;
    }

    const sectionExists = data.sections.some((s) => s.id === sectionId);
    if (!sectionExists) {
      console.warn(`Section ${sectionId} no longer exists; skipping add.`);
      return;
    }

    const newLink = {
      id: crypto.randomUUID(),
      url: linkData.url,
      urlName: linkData.urlName,
      date: Date.now(),
    };

    const updatedSections = data.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          details: [...(section.details || []), newLink],
        };
      }
      return section;
    });

    await chrome.storage.local.set({ sections: updatedSections });

    if (chrome.notifications) {
      const targetSection = data.sections.find((s) => s.id === sectionId);
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "CunningKit",
        message: `Added to "${targetSection?.name ?? "section"}"`,
      });
    }
  } catch (error) {
    console.error("Failed to add link to section:", error);
  }
});
