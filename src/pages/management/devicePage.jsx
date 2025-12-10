import React from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  SearchIcon, PlusCircle, Edit, Trash  } from "lucide-react";
import { useState } from "react";


const DevicePage = () => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <DashboardLayout>
            {/* Filter Device */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">

                {/* Search */}
                <div className="relative">
                <input
                    type="text"
                    placeholder="Cari user..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition 
                    placeholder:text-gray-400"
                />
                <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Area Filter */}
                <select
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                text-sm text-gray-700 hover:bg-white hover:border-blue-400 hover:shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                <option>Area: All</option>
                <option>Area BE1</option>
                <option>Area BE2</option>
                <option>Area BE3</option>
                </select>

                {/* Status Filter */}
                <select
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                text-sm text-gray-700 hover:bg-white hover:border-blue-400 hover:shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                <option>Status: All</option>
                <option>Online</option>
                <option>Offline</option>
                <option>Maintenance</option>
                </select>

                {/* Sort */}
                <select
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                text-sm text-gray-700 hover:bg-white hover:border-blue-400 hover:shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                <option>Sort By</option>
                <option>Name</option>
                <option>Newest</option>
                <option>Oldest</option>
                </select>

                {/* Add User Button */}
                <div className="flex justify-end">
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 
                    bg-blue-600 text-white text-sm font-semibold rounded-xl 
                    hover:bg-blue-700 active:scale-95 transition"
                >
                    <PlusCircle className="w-5 h-5" />
                    Device
                </button>
                </div>
            </div>
            </section>

            {/* Modal */}
            {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scaleIn">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Tambah Device</h2>
                    <button
                    onClick={() => setOpenModal(false)}
                    className="text-gray-400 hover:text-red-500 text-xl transition"
                    >
                    ✕
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">

                    <input
                    type="text"
                    placeholder="Serial Number"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                    />

                    <input
                    type="text"
                    placeholder="Device Name"
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                    />

                    {/* Assigned Area Dropdown */}
                    <select
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                    >
                    <option>Assigned Area</option>
                    <option>Area BE1</option>
                    <option>Area BE2</option>
                    <option>Area BE3</option>
                    </select>

                    {/* Category Dropdown */}
                    <select
                    className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                    >
                    <option>Category</option>
                    <option>Vibration</option>
                    <option>Temperature</option>
                    <option>Pressure</option>
                    </select>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 transition"
                    >
                    Close
                    </button>

                    <button
                    className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                    Simpan
                    </button>
                </div>

                </div>
            </div>
            )}

            {/* Table Device */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4">
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                            <th className="p-3 text-left font-semibold text-gray-600">No</th>
                            <th className="p-3 text-left font-semibold text-gray-600">Device Name</th>
                            <th className="p-3 text-left font-semibold text-gray-600">Category</th>
                            <th className="p-3 text-left font-semibold text-gray-600">Serial Number</th>
                            <th className="p-3 text-left font-semibold text-gray-600">Date Activation</th>
                            <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                            <th className="p-3 text-left font-semibold text-gray-600">Assigned Area</th>
                            <th className="p-3 text-left font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                    <tbody className="divide-y divide-gray-100">
                    <tr className="bg-white">
                    <td className="p-3 text-gray-700">1</td>
                    <td className="p-3 font-medium text-gray-800">Vibration BE1</td>
                    <td className="p-3 text-gray-800">Vibration</td>
                    <td className="p-3 text-gray-700">123456789</td>
                    <td className="p-3 text-gray-700">17/10/2025</td>

                    <td className="p-3 text-gray-700">
                        <span className="px-3 py-1 text-xs font-medium text-white bg-green-400 rounded-full">
                        Online
                        </span>
                    </td>

                    <td className="p-3 text-gray-700">Area BE1</td>

                    {/* ✅ Action HARUS di dalam <td>, bukan <div> */}
                    <td className="p-3">
                        <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-semibold rounded-lg hover:bg-yellow-700 active:scale-95 transition">
                            <Edit />
                        </button>

                        <button className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:scale-95 transition">
                            <Trash />
                        </button>
                        </div>
                    </td>
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

export default DevicePage;