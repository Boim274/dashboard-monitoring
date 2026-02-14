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
} from "lucide-react";
import logo from "../assets/Logo1.png";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  const role = user?.role;

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
      roles: ["superAdmin"],
      items: [
        { name: "User Management", icon: <Users size={18} />, path: "/users" },
        { name: "Area", icon: <MapPin size={18} />, path: "/area" },
        { name: "Device", icon: <Cpu size={18} />, path: "/device" },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-screen backdrop-blur-xl bg-gray-900/95 text-gray-200 flex flex-col justify-between shadow-2xl transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <img
            src={logo}
            alt="Logo"
            className="w-9 h-9 object-contain rounded-xl bg-white p-1"
          />
          <span className="font-semibold text-base tracking-wide whitespace-nowrap">
            Monitoring System
          </span>
        </div>
  
        {/* Menu */}
        <nav className="mt-6 px-3 space-y-6">
          {menuSections
            .filter(section => !section.roles || section.roles.includes(role))
            .map((section, index) => (
              <div key={index}>
                <h3 className="text-[11px] font-semibold text-gray-500 px-3 mb-2 tracking-widest uppercase">
                  {section.title}
                </h3>
  
                <div className="space-y-1">
                  {section.items.map((item, i) => (
                    <NavLink
                      key={i}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-600 shadow-md text-white scale-[1.02]"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      {item.icon}
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
        </nav>
      </div>
    </div>
  );
  
};

export default Sidebar;
