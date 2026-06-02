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
  const [sections, setSections] = useState<SectionProp[]>([]);

  const [loading, setLoading] = useState(false);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await fetchSections();
      setSections(data);
    } catch (error) {
      console.error("Error loading sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to load sections from local storage first
    try {
      const savedSections = localStorage.getItem("cunningkit-sections");
      if (savedSections && savedSections !== "[]") {
        setSections(JSON.parse(savedSections));
      } else {
        // If no sections in local storage, fetch from API
        loadSections();
      }
    } catch (error) {
      console.error(
        "Failed to load sections from local storage, fetching from API.",
        error,
      );
      loadSections();
    }
  }, []);

  useEffect(() => {
    // Save sections to local storage whenever they change
    if (sections.length > 0) {
      localStorage.setItem("cunningkit-sections", JSON.stringify(sections));
    }
  }, [sections]);

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
