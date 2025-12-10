import React from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  SearchIcon } from "lucide-react";

const AreaPage = () => {
    return (
        <DashboardLayout>
            {/* filter Area */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

                {/* Search */}
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition 
                    placeholder:text-gray-400"
                />
                <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Filter Role */}
                <button className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                flex items-center justify-between hover:bg-white hover:border-blue-400 hover:shadow-sm 
                transition focus:outline-none focus:ring-2 focus:ring-blue-200">
                <span className="text-sm font-medium text-gray-600 truncate">
                    Pilih Status
                </span>
                <span className="text-gray-400 text-xs">▾</span>
                </button>

                {/* Sort */}
                <button className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                flex items-center justify-between hover:bg-white hover:border-blue-400 hover:shadow-sm 
                transition focus:outline-none focus:ring-2 focus:ring-blue-200">
                <span className="text-sm font-medium text-gray-600 truncate">
                    Pilih Short
                </span>
                <span className="text-gray-400 text-xs">▾</span>
                </button>

                </div>
            </section>

            {/* Table Area */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4">
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                        <th className="p-3 text-left font-semibold text-gray-600">No</th>
                        <th className="p-3 text-left font-semibold text-gray-600">Area Name</th>
                        <th className="p-3 text-left font-semibold text-gray-600">Area Location</th>
                        <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                        <th className="p-3 text-left font-semibold text-gray-600">Date Activation</th>
                        <th className="p-3 text-left font-semibold text-gray-600">Admin</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="bg-white">
                        <td className="p-3 text-gray-700">1</td>
                        <td className="p-3 font-medium text-gray-800">Area Be1</td>
                        <td className="p-3 text-gray-800">-6.34203304081467, 107.19697288711365</td>
                        <td className="p-3 text-gray-700">
                            <span className="px-3 py-1 text-xs font-medium text-white bg-green-400 rounded-full">
                                Aktif
                            </span>
                        </td>
                        <td className="p-3 text-gray-700">17/10/2025</td>
                        <td className="p-3 text-gray-700">PT Asian Isuzu Casting Center</td>
                        
                        </tr>
                    </tbody>
                    </table> 
                </div>

                {/* Pagination Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
                    <p className="text-sm text-gray-500">
                        1 to 1 of 1 entries
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
            </section>

        </DashboardLayout>
    );
};

export default AreaPage;