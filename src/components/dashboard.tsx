import { useState } from "react";
import type { JSX } from "react";
import type { SectionProp } from "../App";
import { useNavigate } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import { CircleFadingPlus, X } from "lucide-react";

function Dashboard({
  sections,
  setSections,
}: {
  sections: SectionProp[];
  setSections: Dispatch<SetStateAction<SectionProp[]>>;
}) {
  const navigate = useNavigate();
  const [newSectionName, setnewSectionName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [closeBtn, setCloseBtn] = useState(false);
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

  function addSection() {
    if (!newSectionName) return;
    const customName = newSectionName.trim().toLowerCase();

    setSections([
      ...sections,
      {
        id: customName,
        name: customName.charAt(0).toUpperCase() + customName.slice(1),
        color: getRandomColors(),
        details: ["React Components", "CSS Styling", "User Interface Design"],
      },
    ]);

    setShowForm(false);
    setnewSectionName("");
  }

  function deleteSection(index: number) {
    setSections(sections.filter((_, i) => index !== i));
  }
  return (
    <section>
      <div
        className={`bg-linear-to-br from-orange-50 via-rose-50 to-amber-50 min-h-screen flex gap-8 flex-col items-center justify-center `}
      >
        <div className=" font-extrabold text-5xl text-gray-950">
          {" "}
          Who is Reading ?{" "}
        </div>

        <div className="flex gap-6 justify-center items-center">
          {sections.map((comp: SectionProp, i: number): JSX.Element => {
            return (
              <div className="flex  justify-center items-center gap-3">
                <div
                  key={comp.id}
                  onClick={() => navigate(`/section/${comp.id}`)}
                  className="p-10 rounded-3xl cursor-pointer hover:scale-105 transition-all hover:shadow-[-11px_13px_0px_0px_#000] shadow-[-8px_8px_0px_0px_#000]"
                  style={{
                    backgroundColor: `${comp.color}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${comp.color}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${comp.color}b3`;
                  }}
                >
                  {" "}
                  <p className="text-3xl">{comp.name}</p>{" "}
                </div>
                {closeBtn && (
                  <button
                    onClick={() => deleteSection(i)}
                    className="cursor-pointer hover:scale-110  hover:opacity-100 opacity-60 transition-all"
                  >
                    <X size={35} color={"red"} />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => setShowForm(true)}
            className="cursor-pointer hover:scale-110  hover:opacity-100 opacity-60 transition-all"
          >
            <CircleFadingPlus size={60} strokeWidth={2} color={"#6a7282"} />
          </button>
        </div>
        {showForm && (
          <div className="flex justify-center items-center gap-3">
            <input
              type="text"
              value={newSectionName}
              className="p-3 rounded-2xl border "
              onChange={(e) => setnewSectionName(e.target.value)}
            />
            <div
              onClick={addSection}
              className="text-3xl"
              onKeyDown={(e) => e.key === "Enter" && addSection()}
            >
              Add
            </div>
            <button
              className="cursor-pointer hover:scale-110  hover:opacity-100 opacity-60  transition-all"
              onClick={() => setShowForm(false)}
            >
              {" "}
              <X size={35} color={"red"} />
            </button>
          </div>
        )}
        <div
          onClick={() => setCloseBtn(!closeBtn)}
          className="border rounded-2xl px-4 py-2 text-gray-500 hover:text-gray-700 transition-all"
        >
          Manage Account
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
