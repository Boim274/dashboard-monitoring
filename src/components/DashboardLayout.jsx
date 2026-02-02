import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
  // State untuk buka/tutup sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fungsi toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Konten utama */}
      <div
        className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-6">{children}</main>
      </div>

    </div>
  );
};

export default DashboardLayout;
