import React, { useState } from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  MapIcon, ZapIcon, ZapOffIcon, WifiOffIcon, FileWarning, X,AlertCircleIcon, LucideMapPinHouse,  } from "lucide-react";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    
    <DashboardLayout>
      
       {/* Kartu Statistik */}
       <div className="bg-linear-to-b from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-5">
        {/* Area Total */}
        <div className="w-full sm:w-64 p-5 rounded-2xl bg-linear-to-tr from-yellow-50 to-white shadow-md border border-yellow-100 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Area Total</p>
              <p className="text-1xl font-bold text-gray-800 mt-1">1</p>
            </div>
            <button
                onClick={() => setShowModal(true)}
                className="p-3 bg-yellow-400 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <MapIcon className="text-white w-6 h-6" />
          </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Running", value: 1, icon: <ZapIcon className="text-white w-6 h-6" />, color: "from-green-50 to-white", bg: "p-2 bg-green-500 rounded-full shadow-sm" },
            { title: "Stopped", value: 3, icon: <ZapOffIcon className="text-white w-6 h-6" />, color: "from-yellow-50 to-white", bg: "p-2 bg-yellow-500 rounded-full shadow-sm" },
            { title: "Faulted", value: 0, icon: <AlertCircleIcon className="text-white w-6 h-6" />, color: "from-red-50 to-white", bg: "p-2 bg-red-500 rounded-full shadow-sm" },
            { title: "Offline", value: 0, icon: <WifiOffIcon className="text-white w-6 h-6" />, color: "from-purple-50 to-white", bg: "p-2 bg-purple-500 rounded-full shadow-sm" },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl shadow-sm border border-gray-200 bg-linear-to-br ${item.color} hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-base font-semibold text-gray-700">{item.title}</p>
                <div className={item.bg}>{item.icon}</div>
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-3xl relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Map View</h2>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1280px-World_map_blank_without_borders.svg.png"
                    alt="Map Preview"
                    className="w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Alarm Cards dan Map */}
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
        {/* Kiri: Alarm Cards */}
        {/* Alarm Status Card */}
        <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Alarm Status</h2>
            <span className="text-xs font-medium bg-red-100 text-red-600 px-3 py-1 rounded-full">
              Active
            </span>
          </div>

          <div className="space-y-4">
            {/* Alarm Item */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
              {/* Left side */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-red-100 text-red-600 rounded-full p-2">
                  <AlertCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Kurang dari kapasitas standar
                  </p>
                  <p className="text-xs text-gray-500">10/29/2025 01:04:56</p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <LucideMapPinHouse className="w-4 h-4 text-blue-500" />
                  <p>Area 1</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 text-xs font-medium">
                  Sensor
                </span>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition"
                >
                  Details
                </button>
              </div>
            </div>

            {/* Contoh alarm kedua */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full p-2">
                  <AlertCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Tegangan mendekati batas atas
                  </p>
                  <p className="text-xs text-gray-500">10/30/2025 14:22:10</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <LucideMapPinHouse className="w-4 h-4 text-blue-500" />
                  <p>Area 2</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 text-xs font-medium">
                  Voltage
                </span>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Kanan: Map */}
        <div className="bg-linear-to-b from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Map Overview</h2>
          <div className="rounded-xl overflow-hidden h-72 bg-gray-100 flex items-center justify-center">
            {/* Placeholder Map */}
            <p className="text-gray-400 text-sm">[Map Goes Here]</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="bg-linear-to-b from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <p className="text-lg font-semibold text-gray-700 mb-4">Overview</p>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Energy (kWh)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { area: "North Roof", status: "Running", energy: 452, updated: "10:24 AM" },
                { area: "South Roof", status: "Idle", energy: 198, updated: "10:10 AM" },
                { area: "West Wing", status: "Error", energy: 0, updated: "09:58 AM" },
                { area: "East Wing", status: "Running", energy: 530, updated: "10:30 AM" },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{row.area}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === "Running"
                          ? "bg-green-100 text-green-700"
                          : row.status === "Idle"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row.energy}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
