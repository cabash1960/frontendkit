import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Dashboard from "./components/dashboard";
import SectionPage from "./components/sectionPage";
import { fetchSections } from "./api/supabase";
import type { SectionProp } from "./libs/types";
import ErrorBoundaryComp from "./errorBoundaryComp";
import NotFound from "./notFound";
import { Helmet } from "react-helmet-async";

function App() {
  const [sections, setSections] = useState<SectionProp[]>([
    // {
    //   id: "frontend",
    //   name: "Frontend",
    //   color: "#8b5cf6",
    //   details: [{ url: "google.com", urlName: "google.com", id: "xp4" }],
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
