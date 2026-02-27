import { useRef, useState } from "react";
import { useParams } from "react-router";
import type { SectionProp, DetailProp } from "../libs/types";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import { StepBack, X, SquarePen, SearchCheckIcon, Link } from "lucide-react";
import { updateSection } from "../api/supabase";
import ErrorBoundaryComp from "../errorBoundaryComp";

function SectionPage({
  sections,
  setSections,
}: {
  sections: SectionProp[];
  setSections: Dispatch<SetStateAction<SectionProp[]>>;
}) {
  const { id } = useParams();
  const [material, setMaterial] = useState("");
  const [open, setOpen] = useState(false);
  const [editTitle, isEditTitle] = useState(false);
  const [editTitleid, setEditTitleId] = useState<string | null>(null);
  // const [linkTitle, setLinkTitle] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<DetailProp[] | null>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prevVal, setPrevVal] = useState("");

  const currentSection = sections.find((s: SectionProp) => s.id === id);
  const navigate = useNavigate();
  const nameRef = useRef<Record<string, HTMLSpanElement | null>>({});
  function getDefaultName(url: string) {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  }
  async function addLinks() {
    if (!material || !currentSection || isSubmitting) return;
    const randomId = crypto.randomUUID();
    const formattedLinks = material.startsWith("http")
      ? material
      : `http://${material}`;

    const defaultLinkName = getDefaultName(formattedLinks);
    setPrevVal(defaultLinkName);
    const updatedDetails = [
      ...currentSection.details,
      { id: randomId, url: formattedLinks, urlName: defaultLinkName },
    ];

    try {
      setIsSubmitting(true);
      // setLinkTitle(defaultLinkName);
      await updateSection(currentSection.id, { details: updatedDetails });
      setSections(
        sections.map((sec) =>
          sec.id === id ? { ...sec, details: updatedDetails } : sec,
        ),
      );

      setMaterial("");
    } catch (error) {
      console.error("Error adding link:", error);
      alert("Failed to add link.");
    } finally {
      setIsSubmitting(false);
    }
  }
  async function deleteLink(index: number) {
    if (!currentSection?.details[index]) return;

    const updatedDetails = currentSection.details.filter((_, i) => i !== index);
    await updateSection(currentSection.id, { details: updatedDetails });
    setSections(
      sections.map((sec) =>
        sec.id === id ? { ...sec, details: updatedDetails } : sec,
      ),
    );
  }

  async function updateTitle(linkId: string) {
    if (!currentSection) return;

    const updatedLinks = currentSection.details.map((link) => {
      if (link.id === linkId) {
        const newTitle = nameRef.current[linkId]?.textContent?.trim();
        if (newTitle) setPrevVal(newTitle);
        if (!newTitle) return link;
        return { ...link, urlName: newTitle };
      } else {
        return link;
      }
    });

    try {
      await updateSection(currentSection.id, { details: updatedLinks });
      setSections(
        sections.map((sec) =>
          sec.id === id ? { ...sec, details: updatedLinks } : sec,
        ),
      );
      isEditTitle(false);
    } catch (error) {
      console.error("Error adding link:", error);
    }
  }

  const startEdit = (linkId: string) => {
    isEditTitle(true);
    setTimeout(() => {
      const el = nameRef.current[linkId];
      if (el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        window.getSelection()!.removeAllRanges();
        window.getSelection()!.addRange(range);
      }
    }, 0);
  };
  function handleKeydown(
    e: React.KeyboardEvent<HTMLSpanElement>,
    linkId: string,
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      nameRef.current[linkId]?.blur();
    }
    if (e.key === "Escape") {
      const el = nameRef.current[linkId];
      if (el) el.textContent = prevVal;
      el?.blur();
    }
  }
  function getSearchInput() {
    const term = searchInput.trim().toLowerCase();
    if (!term) return;

    const filteredSearch = currentSection?.details.filter((link) => {
      const filter =
        link.url.toLowerCase().includes(term) ||
        link.urlName?.toLowerCase().includes(term);
      return filter;
    });

    return (setSearchResults(filteredSearch || []), setSearchInput(""));
  }
  function addSection(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    return open ? getSearchInput() : addLinks();
  }
  const displayedLinks = open ? (searchResults ?? []) : currentSection?.details;
  if (!currentSection) return <p>Section not found.</p>;

  return (
    <section className="bg-amber-50 min-h-screen  text-gray-950 p-6 overflow-hidden">
      <ErrorBoundaryComp>
        <div className="max-w-6xl mx-auto">
          <div
            onClick={() => navigate("/")}
            className="flex gap-2 p-3 cursor-pointer hover:gap-3 transition-all w-fit "
          >
            <StepBack /> <span className="hidden md:block">Back</span>{" "}
          </div>
          <div className=" flex-col gap-6 px-6 pb-12 text-gray-950 flex justify-center mt-3  items-center">
            <div className="md:text-6xl text-4xl font-bold text-nowrap">
              {currentSection?.name} Kits
            </div>
            <div className="flex mt-6 shadow-[-6px_6px_0px_0px_#000] rounded-3xl border-2 border-black overflow-hidden ">
              <button
                disabled={isSubmitting}
                className={`px-4 py-6 bg-green-100 hover:bg-green-200 transition-colors rounded-l-3xl ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <SearchCheckIcon color="green" />
              </button>

              <input
                type="text"
                value={open ? searchInput : material}
                className={`md:px-4 md:py-6 px-4 py-4 ${open ? "bg-green-100" : "bg-purple-100"}  outline-none min-w-45 md:min-w-75 `}
                placeholder={
                  open ? "Search for your links..." : "Enter Link or URL"
                }
                onChange={(e) => {
                  if (open) {
                    const val = e.target.value;
                    setSearchInput(val);
                    const term = val.trim().toLowerCase();
                    if (!term) {
                      setSearchResults([]);
                      return;
                    }

                    const filteredSearch = currentSection?.details.filter(
                      (link) => {
                        const filter =
                          link.url.toLowerCase().includes(term) ||
                          link.urlName?.toLowerCase().includes(term);
                        return filter;
                      },
                    );

                    return setSearchResults(filteredSearch || []);
                  } else {
                    setMaterial(e.target.value);
                  }
                }}
                onKeyDown={addSection}
              />

              <button
                disabled={isSubmitting}
                className={`px-4 py-6 bg-purple-100 hover:bg-purple-200 transition-colors rounded-r-3xl ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => {
                  if (open) {
                    setOpen(false);
                  } else {
                    addLinks();
                  }
                }}
              >
                <SquarePen color="purple" />
              </button>
            </div>

            <div className="w-full  mt-6">
              {currentSection?.details.length === 0 ? (
                <p className="text-center text-gray-500 text-xl">
                  No links yet. Add one above!
                </p>
              ) : (
                <ul className="flex flex-col gap-5 w-full max-w-full">
                  {displayedLinks?.map((link) => {
                    return (
                      <li
                        key={link.id}
                        className={` py-4 px-8  flex gap-3   justify-between items-center shadow-[-8px_8px_0_0_#000] bg-amber-200 rounded-3xl  cursor-pointer hover:scale-105 transition-all hover:shadow-[-10px_9px_0px_0px_#000]  border-2 border-black ${editTitleid === link.id && editTitle ? "scale-105" : "scale-100"}`}
                      >
                        <div className="flex flex-col overflow-hidden">
                          <span
                            ref={(el) => {
                              nameRef.current[link.id] = el;
                            }}
                            contentEditable
                            suppressContentEditableWarning
                            title="Click to edit"
                            onInput={() => isEditTitle(true)}
                            onFocus={() => setEditTitleId(link.id)}
                            onBlur={() => (
                              updateTitle(link.id),
                              isEditTitle(false)
                            )}
                            onClick={() => startEdit(link.id)}
                            onKeyDown={(e) => handleKeydown(e, link.id)}
                            className={`md:text-3xl sm:text-xl truncate text-blue-700  cursor-text font-bold outline-none ${editTitleid === link.id ? "whitespace-normal overflow-visible" : "overflow-hidden"}`}
                          >
                            {link.urlName}
                          </span>
                          <span className="truncate max-w-[80%] text-gray-700 opacity-80 font-medium block md:text-xl sm:text-sm">
                            {link.url}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" cursor-pointer transition-transform  hover:scale-110"
                          >
                            <Link
                              color={"purple"}
                              className="md:w-8 md:h-8  w-6 h-6"
                            />
                          </a>

                          <button
                            className="cursor-pointer transition-transform  hover:scale-110"
                            onClick={() => {
                              const realIndex =
                                currentSection.details.indexOf(link);
                              deleteLink(realIndex);
                            }}
                          >
                            <X
                              color={"red"}
                              className="md:w-8 md:h-8  w-6 h-6"
                            />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundaryComp>
    </section>
  );
}

export default SectionPage;
