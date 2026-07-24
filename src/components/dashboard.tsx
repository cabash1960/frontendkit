import { useEffect, useState } from "react";
import type { JSX } from "react";
import type { SectionProp } from "../libs/types";
import { useNavigate } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import { CircleFadingPlus, X, Check } from "lucide-react";
import { createSection, deleteSections } from "../api/supabase";
import ErrorBoundaryComp from "../errorBoundaryComp";
import { PacmanLoader } from "react-spinners";
import { ToastContainer, Zoom, toast } from "react-toastify";

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCloseBtn(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);
  useEffect(() => {
    const handleOutsideClick = () => setCloseBtn(false);

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
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
    if (!newSectionName) return;
    if (sections.length >= 8) return notify();

    const customName = newSectionName.trim().toLowerCase();
    const tempId = crypto.randomUUID();

    const newSection = {
      id: tempId,
      name: customName.charAt(0).toUpperCase() + customName.slice(1),
      color: getRandomColors(),
      details: [],
    };

    setShowForm(false);
    setnewSectionName("");

    try {
      const createdSection = await createSection(newSection);
      // Add the new section with the real ID from the database
      setSections((prev) => [...prev, createdSection]);

      navigate(`/section/${createdSection.id}`);
    } catch (error) {
      console.warn(
        "Saved section locally, but failed to sync to database (offline).",
        error,
      );

      setSections([...sections, newSection as SectionProp]);
    }
  }

  async function deleteSection(index: number) {
    const sectionToDelete = sections[index];
    const confirmed = window.confirm(
      `Are you sure you want to delete "${sectionToDelete.name}"?`,
    );
    if (!confirmed) return;

    // Optimistic update
    setSections(sections.filter((_, i) => index !== i));

    try {
      await deleteSections(sectionToDelete.id);
    } catch (error) {
      console.warn(
        "Deleted section locally, but failed to sync to database (offline).",
        error,
      );
    }
  }
  const notify = () =>
    toast("No more sections allowed ⚠️", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });

  return (
    <section className="min-h-screen overflow-hidden bg-rose-100 bg-[url(/blob-scene-haikei.svg)] bg-cover bg-center bg-no-repeat  ">
      <ErrorBoundaryComp>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Zoom}
        />
        <div
          onClick={() => setCloseBtn(!closeBtn)}
          className="max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center min-h-screen"
        >
          <div className="font-Sofia font-bold md:text-6xl text-3xl text-gray-950">
            Who is Reading?
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 px-4">
            {loading ? (
              <PacmanLoader color="purple" size={36} />
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
                      className={`min-w-32 text-center md:px-8 md:py-6 px-4 border-4  border-[#000] py-3 rounded-3xl cursor-pointer hover:scale-105 transition-all hover:shadow-[-11px_13px_0px_0px_#000] shadow-[-8px_8px_0px_0px_#000] ${closeBtn ? "animate-pulse" : ""}`}
                      style={{ backgroundColor: comp.color }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${comp.color}80`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = comp.color;
                      }}
                    >
                      <p className="md:text-3xl text-xl font-body text-white whitespace-nowrap">
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
                if (sections.length >= 8) return notify();

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
                onChange={(e) => setnewSectionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSection()}
                autoFocus
              />
              <button
                onClick={addSection}
                className="cursor-pointer text-green-700 hover:scale-105 transition-transform"
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
