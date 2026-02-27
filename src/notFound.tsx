import { useNavigate } from "react-router";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@700&display=swap');

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50% { transform: translateY(-14px) rotate(2deg); }
  }
  @keyframes pop-in {
    0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
    80% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes slide-up {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes wobble {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }

  .halftone {
    background-image: radial-gradient(circle, #00000015 1.5px, transparent 1.5px);
    background-size: 16px 16px;
  }
  .home-btn {
    font-family: 'Bangers', cursive;
    font-size: 1.5rem;
    letter-spacing: 0.08em;
    border: 3px solid #000;
    border-radius: 10px;
    padding: 10px 32px;
    cursor: pointer;
    background: #FCD34D;
    color: #1C1C1C;
    box-shadow: 5px 5px 0 #000;
    transition: transform 0.1s, box-shadow 0.1s;
    display: inline-block;
    animation: slide-up 0.5s 0.7s both;
  }
  .home-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 7px 7px 0 #000;
  }
  .home-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 3px 3px 0 #000;
  }
`;

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div
        className="min-h-screen halftone overflow-hidden relative flex items-start"
        style={{ background: "#FFF3CD" }}
      >
        {/* Left content */}
        <div className="px-12 pt-16 flex flex-col gap-6 z-10 relative">
          {/* 404 */}
          <div
            style={{
              animation: "pop-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            <h1
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(7rem, 16vw, 11rem)",
                lineHeight: 0.9,
                color: "#EF4444",
                WebkitTextStroke: "3px #000",
                textShadow: "6px 6px 0 #000",
                letterSpacing: "0.04em",
              }}
            >
              404
            </h1>
          </div>

          {/* Subtitle in speech bubble */}
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              border: "3px solid #000",
              borderRadius: "12px 12px 12px 4px",
              padding: "12px 20px",
              boxShadow: "4px 4px 0 #000",
              position: "relative",
              maxWidth: 320,
              animation: "slide-up 0.5s 0.3s both",
            }}
          >
            <p
              style={{
                fontFamily: "'Comic Neue', cursive",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#374151",
                margin: 0,
              }}
            >
              Nothing to see here... you wandered too far!
            </p>
            {/* bubble tail */}
            <div
              style={{
                position: "absolute",
                bottom: -18,
                left: 18,
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderTop: "18px solid #000",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -13,
                left: 22,
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderTop: "14px solid #fff",
              }}
            />
          </div>

          {/* Button */}
          <button className="home-btn mt-2" onClick={() => navigate("/")}>
            🏠 GO HOME
          </button>
        </div>

        {/* Floating "LOST!" label */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "30%",
            fontFamily: "'Bangers', cursive",
            fontSize: "2.5rem",
            color: "#7C3AED",
            WebkitTextStroke: "2px #000",
            textShadow: "3px 3px 0 #000",
            transform: "rotate(12deg)",
            animation: "wobble 2.5s ease-in-out infinite",
          }}
        >
          LOST!
        </div>

        {/* Character image */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: "8%",
            animation: "float 4s ease-in-out infinite",
          }}
        >
          <img
            src="https://i.imgur.com/vuAbv4c.png"
            alt="404 character"
            style={{
              maxWidth: "min(620px, 55vw)",
              filter:
                "drop-shadow(4px 0 0 #000) drop-shadow(-4px 0 0 #000) drop-shadow(0 -4px 0 #000)",
            }}
          />
        </div>

        {/* Bottom stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            background:
              "repeating-linear-gradient(90deg, #1C1C1C 0 40px, #EF4444 40px 80px, #FCD34D 80px 120px)",
          }}
        />
      </div>
    </>
  );
}

export default NotFound;
