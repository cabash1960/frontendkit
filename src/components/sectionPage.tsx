import { useState } from "react";
import { useParams } from "react-router";
import type { SectionProp } from "../App";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import { StepBack, X, SquarePen } from "lucide-react";
import { updateSection } from "../api/supabase";

function SectionPage({
  sections,
  setSections,
}: {
  sections: SectionProp[];
  setSections: Dispatch<SetStateAction<SectionProp[]>>;
}) {
  const { id } = useParams();
  const [material, setMaterial] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [links, setLinks] = useState(["http://google.com"]);
  const currentSection = sections.find((s: SectionProp) => s.id === id);
  const navigate = useNavigate();

  async function addLinks() {
    if (!material || !currentSection || isSubmitting) return;

    const formattedLinks = material.startsWith("http")
      ? material
      : `http://${material}`;

    const updatedDetails = [...currentSection.details, formattedLinks];

    try {
      setIsSubmitting(true);
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
    if (!currentSection) return;
    const updatedDetails = currentSection.details.filter((_, i) => i !== index);
    await updateSection(currentSection.id, { details: updatedDetails });
    setSections(
      sections.map((sec) =>
        sec.id === id ? { ...sec, details: updatedDetails } : sec,
      ),
    );
  }

  if (!currentSection) return <p>Section not found.</p>;

  return (
    <section className="bg-amber-50 min-h-screen  text-gray-950 p-6 overflow-hidden">
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
            <input
              type="text"
              value={material}
              className=" md:px-4 md:py-6 px-4 py-4 bg-white rounded-l-3xl outline-none min-w-45 md:min-w-75 "
              placeholder="Enter link or URL..."
              onChange={(e) => setMaterial(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLinks()}
            />
            <button
              disabled={isSubmitting}
              className={`px-4 py-6 bg-purple-100 hover:bg-purple-200 transition-colors rounded-r-3xl ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
              onClick={addLinks}
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
                {currentSection?.details.map((link, index) => {
                  return (
                    <li
                      key={index}
                      className=" py-4 px-8 md:text-2xl sm:text-xl flex gap-3 text-blue-700 font-bold  justify-between items-center shadow-[-8px_8px_0_0_#000] bg-amber-200 rounded-3xl  cursor-pointer hover:scale-105 transition-all hover:shadow-[-10px_9px_0px_0px_#000]  border-2 border-black"
                    >
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-[80%] block"
                      >
                        {link}
                      </a>
                      <button
                        className="cursor-pointer transition-transform  hover:scale-110"
                        onClick={() => deleteLink(index)}
                      >
                        <X color={"red"} className="md:w-8 md:h-8  w-6 h-6" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionPage;
