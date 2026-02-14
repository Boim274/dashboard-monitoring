import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ toggleSidebar, onOpenProfile }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/monitoring": "Monitoring",
    "/analysis": "Analysis & Diagnose",
    "/alarm": "Alarm & Notification",
    "/report": "Report",
    "/users": "User Management",
    "/area": "Area Management",
    "/device": "Device Management",
  };

  const currentTitle =
    pageTitles[location.pathname] || "Halaman Tidak Dikenal";

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-5 md:px-8 bg-white/60 backdrop-blur-xl border-b shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-black/5 transition"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold">{currentTitle}</h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

       
        {/* NOTIF */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setOpenNotif(!openNotif);
              setOpenMenu(false);
            }}
            className="relative p-2 rounded-xl hover:bg-black/5 transition"
          >
            <Bell size={20} />

            {/* badge */}
            <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 py-[1px] rounded-full">
              3
            </span>
          </button>

          {openNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">

              {/* header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="text-xs text-gray-400">3 new</span>
              </div>

              {/* list */}
              <div className="max-h-80 overflow-y-auto divide-y">

                {[
                  { title: "Sensor X Overheat", time: "2 min ago" },
                  { title: "Device Offline - Area 3", time: "10 min ago" },
                  { title: "Pressure abnormal", time: "1 hour ago" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition flex flex-col"
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* footer */}
              <button
                onClick={() => navigate("/alarm")}
                className="w-full text-sm py-2 bg-gray-50 hover:bg-gray-100 transition"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>



        {/* PROFILE */}
        <div className="relative" ref={menuRef}>
        <button
        onClick={() => {
          setOpenMenu(!openMenu);
          setOpenNotif(false);
        }}
        className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-black/5 transition"
      >
        <img
          src="https://i.pravatar.cc/40?img=12"
          className="w-9 h-9 rounded-full border border-white shadow-sm"
        />

        {/* 👇 ini tambahan */}
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-sm font-semibold text-gray-800">
            {user?.name || "User"}
          </span>
          <span className="text-xs text-gray-500">
            {user?.role || "Role"}
          </span>
        </div>

        <ChevronDown size={16} />
      </button>


          {openMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2">
              <button
                onClick={() => {
                  onOpenProfile(); // 🔥 trigger layout modal
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
              >
                <User size={16} /> Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
