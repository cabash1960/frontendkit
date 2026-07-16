import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Dashboard from "./components/dashboard";
import SectionPage from "./components/sectionPage";
import { fetchSections } from "./api/supabase";
import type { SectionProp } from "./libs/types";
import ErrorBoundaryComp from "./errorBoundaryComp";
import NotFound from "./notFound";
import { Helmet } from "react-helmet-async";

const LOCAL_STORAGE_KEY = "cunningkit-sections";

function App() {
  const [sections, setSections] = useState<SectionProp[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadFromLocalStorage = (): SectionProp[] | null => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && saved !== "[]") {
        return JSON.parse(saved) as SectionProp[];
      }
    } catch (error) {
      console.warn("Failed to parse localStorage sections.", error);
    }
    return null;
  };

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await fetchSections();
      setSections(data);
    } catch (error) {
      console.error(
        "Error loading sections from Supabase, falling back to localStorage.",
        error,
      );
      // Supabase is down/paused — fall back to whatever we last cached locally
      const cached = loadFromLocalStorage();
      if (cached) setSections(cached);
    } finally {
      setLoading(false);
    }
  };

  // Load once on mount, in priority order:
  // 1. chrome.storage.local (source of truth, synced with background script)
  // 2. localStorage (offline/backup cache)
  // 3. Supabase (fresh fetch)
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.get(
        "sections",
        (data: { sections?: SectionProp[] }) => {
          if (data.sections && data.sections.length > 0) {
            setSections(data.sections as SectionProp[]);
            setHasLoaded(true);
          } else {
            const cached = loadFromLocalStorage();
            if (cached && cached.length > 0) {
              setSections(cached);
              setHasLoaded(true);
            } else {
              loadSections().finally(() => setHasLoaded(true));
            }
          }
        },
      );
    } else {
      // Not running as an extension (plain website context)
      const cached = loadFromLocalStorage();
      if (cached && cached.length > 0) {
        setSections(cached);
        setHasLoaded(true);
      } else {
        loadSections().finally(() => setHasLoaded(true));
      }
    }
  }, []);

  // Write to BOTH chrome.storage.local and localStorage whenever sections change
  useEffect(() => {
    if (!hasLoaded) return;

    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.set({ sections });
    }

    try {
      if (sections.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sections));
      }
    } catch (error) {
      console.warn("Failed to write sections to localStorage.", error);
    }
  }, [sections, hasLoaded]);

  // Listen for changes made elsewhere (e.g. the background script's context menu)
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const onChanged = (changes: {
        [key: string]: chrome.storage.StorageChange;
      }) => {
        if (changes.sections) {
          setSections(changes.sections.newValue as SectionProp[]);
        }
      };
      chrome.storage.onChanged.addListener(onChanged);
      return () => chrome.storage.onChanged.removeListener(onChanged);
    }
  }, []);

  return (
    <div>
      <ErrorBoundaryComp>
        <Helmet>
          <title>CunningKit</title>
          <meta property="og:title" content="CunningKit" />
          <meta property="og:description" content="Your description" />
          <meta property="og:url" content="https://cunningkit.cabash.tech" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://ogimage.io/templates/photo?title=-&subtitle=Akinlabi+Blessing&image=https%3A%2F%2Fi.imgur.com%2FxQ2HjuX.jpeg"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:image"
            content="https://ogimage.io/templates/photo?title=-&subtitle=Akinlabi+Blessing&image=https%3A%2F%2Fi.imgur.com%2FxQ2HjuX.jpeg"
          />
        </Helmet>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                sections={sections}
                loading={loading}
                setSections={setSections}
              />
            }
          />

          <Route
            path="/section/:id"
            element={
              <SectionPage sections={sections} setSections={setSections} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundaryComp>
    </div>
  );
}

export default App;
