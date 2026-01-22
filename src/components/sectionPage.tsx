import { useState } from "react";
import { useParams } from "react-router";
import type { SectionProp } from "../App";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router";
import { StepBack, X, SquarePen } from "lucide-react";

function SectionPage({
  sections,
  setSections,
}: {
  sections: SectionProp[];
  setSections: Dispatch<SetStateAction<SectionProp[]>>;
}) {
  const { id } = useParams();
  const [material, setMaterial] = useState("");
  // const [links, setLinks] = useState(["http://google.com"]);
  const currentSection = sections.find((s: SectionProp) => s.id === id);
  const navigate = useNavigate();

  function addLinks() {
    if (!material) return;

    const formattedLinks = material.startsWith("http")
      ? material
      : `http://${material}`;

    setSections(
      sections.map((sec) =>
        sec.id === id
          ? { ...sec, details: [...sec.details, formattedLinks] }
          : sec,
      ),
    );
    setMaterial("");
  }
  function deleteLink(index: number) {
    setSections(
      sections.map((sec) =>
        sec.id === id
          ? { ...sec, details: sec.details.filter((_, i) => i !== index) }
          : sec,
      ),
    );
  }

  return (
    <section className="bg-gray-100 min-h-screen flex-col text-gray-950 p-3">
      <div
        onClick={() => navigate("/")}
        className="flex gap-2 p-3 cursor-pointer hover:gap-3 transition-all w-fit"
      >
        <StepBack /> <span>Back</span>{" "}
      </div>
      <div className=" flex-col gap-6 px-6 pb-12 text-gray-950 flex justify-center items-center">
        <div className="text-6xl font-bold">{currentSection?.name} Kits</div>
        <div className="flex shadow-[-6px_6px_0px_0px_#000] rounded-3xl border-2 border-black overflow-hidden ">
          <input
            type="text"
            value={material}
            className=" px-4 py-6 bg-white rounded-l-3xl outline-none min-w-75 "
            placeholder="Enter link or URL..."
            onChange={(e) => setMaterial(e.target.value)}
          />
          <button
            className="px-4 py-6 bg-purple-100 hover:bg-purple-200 transition-colors rounded-r-3xl "
            onClick={addLinks}
          >
            <SquarePen color="purple" />
          </button>
        </div>

        <div className="w-full max-w-3xl">
          {currentSection?.details.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">
              No links yet. Add one above!
            </p>
          ) : (
            <ul className="flex flex-col gap-5">
              {currentSection?.details.map((link, index) => {
                return (
                  <li
                    key={index}
                    className=" py-5 px-8 text-3xl  flex gap-3  justify-between item-center shadow-[-8px_8px_0_0_#000] bg-amber-200 rounded-3xl  cursor-pointer hover:scale-105 transition-all hover:shadow-[-10px_9px_0px_0px_#000] border-2 border-black"
                  >
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                    <button
                      className="cursor-pointer transition-transform  hover:scale-110"
                      onClick={() => deleteLink(index)}
                    >
                      <X color={"red"} size={35} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default SectionPage;
