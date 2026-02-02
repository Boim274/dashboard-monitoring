import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Activity,
  Search,
  Bell,
  FileText,
  Users,
  MapPin,
  Cpu,
  LogOut,
} from "lucide-react";
import logo from "../assets/Logo1.png";

const Sidebar = ({ isOpen }) => {
  const menuSections = [
    {
      title: "MONITORING",
      items: [
        { name: "Dashboard", icon: <Home size={18} />, path: "/" },
        { name: "Monitoring", icon: <Activity size={18} />, path: "/monitoring" },
        { name: "Analysis & Diagnose", icon: <Search size={18} />, path: "/analysis" },
        { name: "Alarm & Notifications", icon: <Bell size={18} />, path: "/alarm" },
        { name: "Report", icon: <FileText size={18} />, path: "/report" },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "User Management", icon: <Users size={18} />, path: "/users" },
        { name: "Area", icon: <MapPin size={18} />, path: "/area" },
        { name: "Device", icon: <Cpu size={18} />, path: "/device" },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-gray-200 flex flex-col justify-between shadow-lg transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {/* Logo dan menu */}
      <div>
      <div>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
          {/* Ganti div logo dengan img */}
          <img
            src={logo}
            alt="Logo"
            className="w-8 h-8 object-contain rounded-lg"
          />
            <span className="font-semibold text-lg whitespace-nowrap">
              Monitoring System
            </span>
          </div>
        </div>

        {/* Menu Sections */}
        <nav className="mt-6 space-y-6">
          {menuSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xs font-semibold text-gray-400 px-6 mb-2 tracking-wider">
                {section.title}
              </h3>
              {section.items.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Logout */}
      {/* <div className="px-6 py-4 border-t border-gray-700 hover:bg-gray-800 transition cursor-pointer flex items-center gap-3 text-sm text-gray-400 hover:text-white">
        <LogOut size={18} />
        Logout
      </div> */}
    </div>
  );
};

export default Sidebar;
