import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Dashboard from "./components/dashboard";
import SectionPage from "./components/sectionPage";
import { fetchSections } from "./api/supabase";

export interface SectionProp {
  id: string;
  name: string;
  // icon?: string,
  color: string;
  details: string[];
}

function App() {
  const [sections, setSections] = useState<SectionProp[]>([
    // {
    //   id: "frontend",
    //   name: "Frontend",
    //   color: "#8b5cf6",
    //   details: ["React Components", "CSS Styling", "User Interface Design"],
    // },
    // {
    //   id: "backend",
    //   name: "Backend",
    //   color: "#10b981",
    //   details: ["API Development", "Database Management", "Authentication"],
    // },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await fetchSections();
      setSections(data);
    } catch (error) {
      console.error("Error laoding sections:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
      </Routes>
    </div>
  );
}

export default App;
