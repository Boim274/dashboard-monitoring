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

            {/* REPORT TABLE */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                <h2 className="text-xl font-semibold text-gray-900">Report</h2>
                <p className="text-sm text-gray-500">Latest device activity records</p>
                </div>

                <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition active:scale-95">
                View All
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                    {["No", "Device Name", "Serial Number", "Area", "Download"].map((item) => (
                        <th
                        key={item}
                        className="p-3 text-left text-xs font-semibold uppercase tracking-wide"
                        >
                        {item}
                        </th>
                    ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition">
                    <td className="p-3 text-sm text-gray-700">1</td>
                    <td className="p-3 text-sm font-medium text-gray-800">Vibration BE1</td>
                    <td className="p-3 text-sm text-gray-700">2500201001</td>
                    <td className="p-3 text-sm text-gray-700">Area BE1</td>
                    <td className="p-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition">
                        <Download />
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-5 gap-3">
                <p className="text-sm text-gray-500">1 to 10 of 100</p>

                <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition">
                    &lt;
                </button>
                <span className="text-sm font-medium text-gray-700">1</span>
                <button className="px-3 py-1.5 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition">
                    &gt;
                </button>
                </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
                *Menampilkan maksimal 10 data per halaman. Gunakan tombol navigasi untuk melihat halaman berikutnya.
            </p>

            </section>

        </DashboardLayout>
    );
};

export default ReportPage;