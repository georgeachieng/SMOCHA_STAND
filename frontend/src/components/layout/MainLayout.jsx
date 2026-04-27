import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const syncSidebarWithScreen = () => {
      const desktop = window.innerWidth >= 960;
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop);
    };

    syncSidebarWithScreen();
    window.addEventListener("resize", syncSidebarWithScreen);

    return () => window.removeEventListener("resize", syncSidebarWithScreen);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #fff7ed 0%, #f8fafc 52%, #e2e8f0 100%)",
      }}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        style={{
          minHeight: "100vh",
          marginLeft: isSidebarOpen && isDesktop ? "280px" : 0,
          transition: "margin-left 180ms ease",
        }}
      >
        <Navbar onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        <main style={{ padding: "1rem", maxWidth: "1280px", margin: "0 auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
