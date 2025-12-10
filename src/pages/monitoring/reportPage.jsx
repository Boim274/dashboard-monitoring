import React from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  Download  } from "lucide-react";

const ReportPage = () => {
    return (
        <DashboardLayout>
            {/* FILTER SECTION */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">

                {/* Pilih Area */}
                <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Pilih Area
                </label>
                <button
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50
                    flex justify-between items-center hover:bg-white hover:border-blue-400 hover:shadow-sm
                    transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                    <span className="text-sm font-medium text-gray-700 truncate">
                    Area: <span className="text-gray-900">All</span>
                    </span>
                    <span className="text-gray-400 text-xs">▾</span>
                </button>
                </div>

                {/* Pilih Sensor */}
                <div className="w-full">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Pilih Sensor
                </label>
                <button
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50
                    flex justify-between items-center hover:bg-white hover:border-blue-400 hover:shadow-sm
                    transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                    <span className="text-sm font-medium text-gray-700 truncate">
                    Semua Sensor
                    </span>
                    <span className="text-gray-400 text-xs">▾</span>
                </button>
                </div>

                {/* Range Waktu langsung geser ke kanan */}
                <div className="md:col-span-2 flex md:justify-end">
                <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1 shadow-inner">

                    <button className="px-4 py-2 text-sm font-semibold rounded-lg 
                    bg-white text-blue-600 shadow-sm transition">
                    Years
                    </button>

                    <button className="px-4 py-2 text-sm font-semibold rounded-lg 
                    text-gray-600 hover:bg-white hover:text-blue-600 transition">
                    Monthly
                    </button>

                    <button className="px-4 py-2 text-sm font-semibold rounded-lg 
                    text-gray-600 hover:bg-white hover:text-blue-600 transition">
                    Daily
                    </button>

                    <button className="px-4 py-2 text-sm font-semibold rounded-lg 
                    text-gray-600 hover:bg-white hover:text-blue-600 transition">
                    Hourly
                    </button>

                </div>
                </div>

            </div>
            </section>

            {/* TABEL REPORT */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-5">
                <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Report</h2>
                    {/* <p className="text-sm text-gray-500">List of recent events</p> */}
                </div>
                <button className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                    View All
                </button>
                </div>

                <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        No
                        </th>
                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Device Name
                        </th>
                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Serial Number
                        </th>
                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Area
                        </th>
                        <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Download
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr  className="hover:bg-gray-50 transition">
                        <td className="p-3 text-sm text-gray-700">
                        1
                        </td>
                        <td className="p-3 text-sm text-gray-700 font-medium">
                        Vibration BE1
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                        2500201001
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                        Area BE1
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                        <Download></Download>
                        </td>
                        </tr>
                    </tbody>
                </table>

                {/* Pagination Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
                    <p className="text-sm text-gray-500">
                    1 to 10 of 100
                    </p>

                    <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40">&lt;
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                    1
                    </span>
                    <button className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40">&gt;
                    </button>
                    </div>
                </div>

                <p className="mt-2 text-xs text-gray-400">
                    *Table menampilkan maksimal 10 data per halaman. Gunakan tombol panah
                    untuk melihat halaman berikutnya.
                </p>
                </div>
            </section>

        </DashboardLayout>
    );
};

export default ReportPage;