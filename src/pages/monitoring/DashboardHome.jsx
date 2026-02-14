import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  MapIcon, ZapIcon, ZapOffIcon, WifiOffIcon, FileWarning, X,AlertCircleIcon, LucideMapPinHouse,  } from "lucide-react";
import api from "../../services/api";

const Dashboard = () => {
  const [alarms, setAlarms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState(null);
  const [overview, setOverview] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = overview.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);
  const currentData = overview.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    useEffect(() => {
      setCurrentPage(1);
    }, [overview]);

  useEffect(() => {
    api.get("/dashboard/summary")
      .then(res => setSummary(res.data));
  
    api.get("/dashboard/overview")
      .then(res => setOverview(res.data));
  }, []);

  useEffect(() => {
    api.get("/alarm-logs?status=high") // atau sesuaikan query
      .then(res => {
        setAlarms(res.data.data); // karena paginate, data ada di `data`
      })
      .catch(err => console.error(err));
  }, []);
  
  
  if (!summary) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="h-6 w-40 bg-gray-200 rounded" />
  
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-2xl shadow-sm"
            />
          ))}
        </div>
  
        {/* Table skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  

  
  return (
    
    <DashboardLayout>

       {/* Kartu Statistik */}
       <div className="bg-linear-to-b from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-5">
        {/* Area Total */}
        <div className="w-full sm:w-64 p-5 rounded-2xl bg-linear-to-tr from-yellow-50 to-white shadow-md border border-yellow-100 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Area Total</p>
              <p className="text-1xl font-bold text-gray-800 mt-1">
                
              {summary.areas}
              </p>
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
        {
          title: "Running",
          value: summary.devices.running,
          icon: <ZapIcon className="text-white w-6 h-6" />,
          color: "from-green-50 to-white",
          bg: "p-2 bg-green-500 rounded-full shadow-sm",
        },
        {
          title: "Stopped",
          value: summary.devices.stopped,
          icon: <ZapOffIcon className="text-white w-6 h-6" />,
          color: "from-yellow-50 to-white",
          bg: "p-2 bg-yellow-500 rounded-full shadow-sm",
        },
        {
          title: "Faulted",
          value: summary.devices.faulted,
          icon: <AlertCircleIcon className="text-white w-6 h-6" />,
          color: "from-red-50 to-white",
          bg: "p-2 bg-red-500 rounded-full shadow-sm",
        },
        {
          title: "Offline",
          value: summary.devices.offline,
          icon: <WifiOffIcon className="text-white w-6 h-6" />,
          color: "from-purple-50 to-white",
          bg: "p-2 bg-purple-500 rounded-full shadow-sm",
        },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-sm border border-gray-200 bg-linear-to-br ${item.color}`}
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
                <div className="rounded-xl overflow-hidden h-100 bg-gray-100 flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  className="border-0"
                  src="https://maps.google.com/maps?q=Jl+Gn+Panderman+-+Ruko+Ventura+E22+%2C+Lippo+Cikarang+Kab.+Bekasi+Jawa+Barat+17530&t=k&z=18&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              </div>
            </div>
          )}
      </div>

      {/* Alarm Cards dan Map */}
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
        {/* Kiri: Alarm Cards */}
        {/* Alarm Status Card */}
        <div className="bg-linear-to-b from-gray-50 to-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Alarm</h2>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">

            {alarms.length === 0 ? (
              <p className="text-gray-400 text-sm">No active alarms</p>
            ) : (
              alarms.map((alarm) => (
                <div key={alarm.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center rounded-full p-2 ${alarm.status === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      <AlertCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{alarm.message || "No message"}</p>
                      <p className="text-xs text-gray-500">{new Date(alarm.triggered_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
 
                  </div>
                </div>
              ))
            )}
          </div>

        </div>


        {/* Kanan: Map */}
        <div className="bg-linear-to-b from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Map Overview</h2>
          <div className="rounded-xl overflow-hidden h-72 bg-gray-100 flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              className="border-0"
              src="https://maps.google.com/maps?q=Jl+Gn+Panderman+-+Ruko+Ventura+E22+%2C+Lippo+Cikarang+Kab.+Bekasi+Jawa+Barat+17530&t=k&z=18&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>

      {/* Overview Cards */}
      <div className="bg-linear-to-b from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <p className="text-lg font-semibold text-gray-700 mb-4">Overview</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Table */}
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Running</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Stopped</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Faulted</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Offline</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              currentData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-gray-500">{row.area_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.total}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.running}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.stopped}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.faulted}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.offline}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>


      </div>
      
          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">

          <p className="text-sm text-gray-500">
            {from} to {to} of {totalItems} entries
          </p>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              &lt;
            </button>

            <span className="text-sm font-medium text-gray-700">
              {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>


      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
