import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation, } from "react-router-dom"; // ⬅️ Tambahkan ini


const Header = ({ toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate(); // ⬅️ Untuk redirect
  const location = useLocation();

    // Map untuk mencocokkan path → nama menu
    const pageTitles = {
      "/": "Dashboard ",
      "/monitoring": "Monitoring",
      "/analysis": "Analysis & Diagnose",
      "/alarm": "Alarm & Notification",
      "/report": "Report",
      "/users": "User Management",
      "/area": "Area Management",
      "/device": "Device Management",
    };

    // Ambil nama berdasarkan path, default fallback jika tidak ada
  const currentTitle = pageTitles[location.pathname] || "Halaman Tidak Dikenal";
    
  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
        setOpenNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi logout
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
      // backend error? bodo amat, kita tetap logout
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };
  

  return (
    <header className="backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left: Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        {/* Nama Menu dinamis */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-5 md:gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setOpenNotif(!openNotif);
              setOpenMenu(false);
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell size={22} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold shadow-sm">
              3
            </span>
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">
                  Notifikasi
                </h3>
              </div>
              <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                {[
                  "🔋 Sistem PV sedang diperbarui",
                  "☀️ Daya puncak hari ini tercapai",
                  "⚙️ Maintenance dijadwalkan besok",
                ].map((notif, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer transition"
                  >
                    {notif}
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <a
                  href="#"
                  className="text-blue-600 text-sm hover:underline font-medium"
                >
                  Lihat semua notifikasi
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => {
              setOpenMenu(!openMenu);
              setOpenNotif(false);
            }}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-2 md:px-3 py-1 rounded-full transition"
          >
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="Profile"
              className="w-9 h-9 rounded-full border border-gray-300 object-cover shadow-sm"
            />
            <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-medium text-gray-800 leading-tight">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-gray-500">
              {user?.role || "Role"}
            </span>
          </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                openMenu ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <User size={16} /> Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <Settings size={16} /> Settings
              </a>
              <hr className="my-1 border-gray-200" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
