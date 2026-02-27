import { useEffect, useState } from "react";
import type { JSX } from "react";
import type { SectionProp } from "../libs/types";
import { useNavigate } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import { CircleFadingPlus, X, Check } from "lucide-react";
import { createSection, deleteSections } from "../api/supabase";
import ErrorBoundaryComp from "../errorBoundaryComp";
import { RingLoader } from "react-spinners";

function Dashboard({
  sections,
  setSections,
  loading,
}: {
  sections: SectionProp[];
  setSections: Dispatch<SetStateAction<SectionProp[]>>;
  loading: boolean;
}) {
  const navigate = useNavigate();
  const [newSectionName, setnewSectionName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [closeBtn, setCloseBtn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCloseBtn(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const colors = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f43f5e", // rose
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
  ];

  function getRandomColors() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  async function addSection() {
    if (!newSectionName || isSubmitting || sections.length >= 8) return;
    const customName = newSectionName.trim().toLowerCase();

    const newSection = {
      id: customName,
      name: customName.charAt(0).toUpperCase() + customName.slice(1),
      color: getRandomColors(),
      details: [],
    };

    try {
      setIsSubmitting(true);
      const createdSection = await createSection(newSection);
      setSections([...sections, createdSection]);
      setShowForm(false);
      setnewSectionName("");
    } catch (error) {
      console.error("Error adding section:", error);
      alert("Failed to add section. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteSection(index: number) {
    const sectionToDelete = sections[index];
    const confirmed = window.confirm(
      `Are you sure you want to delete "${sectionToDelete.name}"?`,
    );
    if (!confirmed) return;

    try {
      await deleteSections(sectionToDelete.id);
      setSections(sections.filter((_, i) => index !== i));
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Failed to delete section. Please try again.");
    }
  }

  return (
    <section className="min-h-screen overflow-hidden bg-linear-to-br from-orange-100 via-rose-100 to-amber-100">
      <ErrorBoundaryComp>
        <div
          onClick={() => setCloseBtn(!closeBtn)}
          className="max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center min-h-screen"
        >
          <div className="font-extrabold md:text-5xl text-3xl text-gray-950">
            Who is Reading?
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 px-4">
            {loading ? (
              <RingLoader color="purple" size={36} />
            ) : (
              sections.map((comp: SectionProp, i: number): JSX.Element => {
                return (
                  <div
                    key={comp.id}
                    className={`flex items-center ${closeBtn ? "gap-3" : "gap-0"} transition-all`}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/section/${comp.id}`);
                      }}
                      className={`min-w-32 text-center md:px-8 md:py-6 px-4 py-3 rounded-3xl cursor-pointer hover:scale-105 transition-all hover:shadow-[-11px_13px_0px_0px_#000] shadow-[-8px_8px_0px_0px_#000] ${closeBtn ? "animate-pulse" : ""}`}
                      style={{ backgroundColor: comp.color }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${comp.color}80`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = comp.color;
                      }}
                    >
                      <p className="md:text-3xl text-xl text-white whitespace-nowrap">
                        {comp.name}
                      </p>
                    </div>

                    {closeBtn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(i);
                        }}
                        className="cursor-pointer hover:scale-110 hover:opacity-100 opacity-60 transition-all"
                      >
                        <X size={35} color="red" />
                      </button>
                    )}
                  </div>
                );
              })
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowForm(true);
              }}
              className="cursor-pointer hover:scale-110 hover:opacity-100 opacity-60 transition-all"
            >
              <CircleFadingPlus size={80} strokeWidth={2} color="#6a7282" />
            </button>
          </div>

          {showForm && (
            <div className="flex justify-center items-center gap-3">
              <input
                type="text"
                value={newSectionName}
                className="p-3 rounded-2xl border-2 text-gray-800 placeholder:text-gray-400 shadow-[-6px_6px_0px_0px_#000] outline-none focus:scale-105 transition-all border-black"
                placeholder="Add a section"
                onClick={(e) => e.stopPropagation()}
                disabled={isSubmitting}
                onChange={(e) => setnewSectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSection()}
                autoFocus
              />
              <button
                onClick={addSection}
                className="cursor-pointer text-green-700 hover:scale-105 transition-transform"
                disabled={isSubmitting}
              >
                <Check size={35} />
              </button>
              <button
                className="cursor-pointer hover:scale-110 hover:opacity-100 opacity-60 transition-all"
                onClick={() => setShowForm(false)}
              >
                <X size={35} color="red" />
              </button>
            </div>
          )}

          <div
            onClick={(e) => {
              e.stopPropagation();
              setCloseBtn(!closeBtn);
            }}
            className="border rounded-2xl px-4 py-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-all"
          >
            Manage Account
          </div>
        </div>
      </ErrorBoundaryComp>
    </section>
  );
}

export default Dashboard;
