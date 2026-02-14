import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);

  // ini buat "soft refresh"
  const [pageKey, setPageKey] = useState(0);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // tiap layout mount → paksa rerender children
    setPageKey(Date.now());
  }, []);
  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between bg-black/5 px-3 py-2 rounded-lg">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
  
  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 bg-gray-100 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header
        toggleSidebar={toggleSidebar}
        onOpenProfile={() => setOpenProfile(true)}
      />
      {openProfile && (
      <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white/90 backdrop-blur-xl w-[380px] rounded-2xl shadow-2xl p-6 relative">

          <button
            onClick={() => setOpenProfile(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold mb-4 text-center">Profile</h2>

          <div className="space-y-3 text-sm">
            <InfoRow label="Name" value={JSON.parse(localStorage.getItem("user"))?.name} />
            <InfoRow label="Username" value={JSON.parse(localStorage.getItem("user"))?.username} />
            <InfoRow label="Email" value={JSON.parse(localStorage.getItem("user"))?.email} />
            <InfoRow label="Phone" value={JSON.parse(localStorage.getItem("user"))?.no_phone} />
            <InfoRow label="Created" value={JSON.parse(localStorage.getItem("user"))?.created_at} />
          </div>
        </div>
      </div>
        )}


        {/* anak di-remount */}
        <main key={pageKey} className="p-6">
          {children}
        </main>
      </div>
    </div>

    
  );
};

export default DashboardLayout;
