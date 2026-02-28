import type { FallbackProps } from "react-error-boundary";
import { Star, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router";

function Errorfallback({ error, resetErrorBoundary }: FallbackProps) {
  // function Errorfallback() {
  const navigate = useNavigate();
  const getStars = () => {
    const emptyStars = Array.from({ length: 2 }).map((_, i) => {
      return (
        <div key={i} className="">
          <Star size={12} fill="black" />
        </div>
      );
    });
    return emptyStars;
  };
  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden  bg-orange-100 p-4">
      <div className="w-full max-w-lg md:max-w-2xl bg-amber-50 px-6 py-8 md:px-10 rounded-3xl  border-3 border-black  shadow-[-8px_8px_0px_0px_#000] relative z-10">
        <div className=" flex flex-col gap-8 text-center">
          <div className="flex flex-col gap-3">
            <h1
              className=" text-4xl font-extrabold"
              style={{
                fontFamily: "'Bangers', cursive",
                lineHeight: 1,
                color: "#EF4444",
                fontSize: "clamp(5rem, 15vw, 8rem)",
                WebkitTextStroke: "3px #000",
                textShadow: "5px 5px 0 #000, -2px -2px 0 #7f1d1d",
                letterSpacing: "0.05em",
              }}
            >
              UH-OH!
            </h1>{" "}
            <div className="flex gap-1 justify-center items-center">
              <div className=" flex gap-1 text-gray-900">{getStars()}</div>
              <p className=" text-gray-900 text-2xl font-bold">
                Something broke{" "}
              </p>
              <div className=" flex gap-1 text-gray-900">{getStars()}</div>
            </div>
          </div>

          <div className="bg-red-100 px-4 py-2 rounded-3xl flex gap-1  border-2 border-red-600">
            <TriangleAlert color="red" />
            <p className=" text-red-600 text-xl font-medium text-left  ">
              ERROR: {(error as Error).message}
            </p>
          </div>

          <div
            className="flex flex-col md:flex-row justify-around text-center mt-5 gap-4 "
            style={{
              fontFamily: "'Bangers', cursive",

              letterSpacing: "0.05em",
            }}
          >
            <button
              onClick={() => navigate("/")}
              className="text-gray-800 text-xl font-medium border-2 cursor-pointer border-black px-6 py-4 rounded-3xl bg-yellow-300 shadow-[-6px_6px_0px_0px_#000] hover:scale-105 transition-all hover:shadow-[-9px_11px_0px_0px_#000]"
            >
              Go back Home
            </button>
            <button
              onClick={resetErrorBoundary}
              className="bg-red-500 text-xl font-medium border-2 cursor-pointer text-gray-100 border-black px-6 py-4 rounded-3xl shadow-[-6px_6px_0px_0px_#000] "
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-10 -left-10 md:bottom-10 md:left-20 opacity-50 md:opacity-100">
        <img
          src="https://i.imgur.com/kVglgtp.png"
          alt="error-image"
          className="max-w-[150px] md:max-w-[200px] "
        />
      </div>
    </div>
  );
}

export default Errorfallback;
