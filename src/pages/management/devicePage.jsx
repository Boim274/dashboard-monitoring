import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  SearchIcon, PlusCircle, Edit, Trash  } from "lucide-react";
import api from "../../services/api";

const DevicePage = () => {
    const [areas, setAreas] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const emptyForm = {
        device_name: "",
        serial_number: "",
        category_id: "",
        area_id: "",
        status: "running",
        device_description: "",
    };
    
    const [createForm, setCreateForm] = useState(emptyForm);
    const [editForm, setEditForm] = useState(emptyForm);
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = filteredDevices.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedDevices = filteredDevices.slice(startIndex, endIndex);
    
    const handleEdit = (device) => {
        setSelectedItem(device);
        setEditForm({
            device_name: device.device_name ?? "",
            category_id: String(device.category?.id ?? device.category_id ?? ""),
            serial_number: device.serial_number ?? "",
            date_active: device.date_active ?? "",
            status: device.status ?? "",
            area_id: String(device.area?.id ?? device.area_id ?? ""),
        });
        
        setShowEditModal(true);
    };
    const [loadingAction, setLoadingAction] = useState(false); // loading untuk create/edit/delete
    const [alertMessage, setAlertMessage] = useState(null);     // pesan alert
    const [toast, setToast] = useState(null); 

    const showToast = (type, message, duration = 3000) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), duration); // hilang otomatis setelah 3 detik
      };
      
      const handleDelete = (device) => {
        setSelectedItem(device);
        setShowDeleteModal(true);
      };
 
      const confirmDelete = async () => {
        try {
          setLoadingAction(true); // buat tombol delete loading
          await api.delete(`/devices/${selectedItem.id}`);
      
          setShowDeleteModal(false);
          showToast("success", "Device berhasil dihapus!"); // type success
          fetchDevices(); // refresh list
        } catch (err) {
          console.error("Gagal hapus device", err);
          showToast("error", "Gagal menghapus device!"); // type error
        } finally {
          setLoadingAction(false);
        }
      };
      

      const fetchDevices = async () => {
        try {
          setLoading(true);
      
          const res = await api.get("/devices");
          const data = res.data?.data || res.data || [];
      
          const devicesData = Array.isArray(data) ? data : [];
      
          setDevices(devicesData);
          setFilteredDevices(devicesData); // pindahin ke sini
      
        } catch (err) {
          console.error("Gagal fetch device", err);
          setDevices([]);
          setFilteredDevices([]);
        } finally {
          setLoading(false);
        }
      };
      

      useEffect(() => {
        fetchDevices();
      }, []);
      
      
      const handleCreate = async () => {
        try {
          setLoadingAction(true);
          await api.post("/devices", createForm);
      
          setOpenModal(false);
          setCreateForm(emptyForm);
          showToast("success", "Device berhasil dibuat!");
          fetchDevices();
        } catch (err) {
          console.error(err.response?.data);
          showToast("error", "Gagal membuat device!");
        } finally {
          setLoadingAction(false);
        }
      };
      

      const handleUpdate = async () => {
        try {
          setLoadingAction(true);
          await api.put(`/devices/${selectedItem.id}`, editForm);
      
          setShowEditModal(false);
          setEditForm(emptyForm);
          setSelectedItem(null);
          showToast("success", "Device berhasil diubah!");
          fetchDevices();
        } catch (err) {
          console.error(err.response?.data);
          showToast("error", "Gagal mengupdate device!");
        } finally {
          setLoadingAction(false);
        }
      };

      

      const handleChange = (e) => {
        const { name, value } = e.target;
      
        setEditForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      useEffect(() => {
        let data = [...devices];
      
        // 🔍 search
        if (search) {
          data = data.filter((d) =>
            (d.device_name || "").toLowerCase().includes(search.toLowerCase())
          );
        }
      
        // 📍 area
        if (areaFilter !== "all") {
          data = data.filter((d) => (d.area?.id ?? d.area_id) === Number(areaFilter));

        }
      
        // ⚡ status
        if (statusFilter !== "all") {
          data = data.filter((d) => d.status === statusFilter);
        }
      
        // 🔄 sort
        if (sortBy === "name") {
          data.sort((a, b) => a.device_name.localeCompare(b.device_name));
        }
      
        if (sortBy === "newest") {
          data.sort((a, b) => b.id - a.id);
        }
      
        if (sortBy === "oldest") {
          data.sort((a, b) => a.id - b.id);
        }
      
        setFilteredDevices(data);
      }, [devices, search, areaFilter, statusFilter, sortBy]);

      useEffect(() => {
        setCurrentPage(1);
      }, [search, areaFilter, statusFilter, sortBy]);
      
      const from = totalItems === 0 ? 0 : startIndex + 1;
        const to = Math.min(endIndex, totalItems);

        const fetchAreas = async () => {
          try {
            const res = await api.get("/areas");
            const data = res.data?.data || res.data || [];
            setAreas(data);
          } catch (err) {
            console.error("Gagal fetch area", err);
            setAreas([]);
          }
        };
      
        useEffect(() => {
          fetchDevices();
          fetchAreas();
        }, []);
              

    return (
        
        <DashboardLayout>
            {loadingAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="bg-white px-6 py-3 rounded-xl shadow-md animate-pulse">
                Loading...
                </div>
            </div>
            )}

            {/* Alert */}
            {toast && (
            <div className={`fixed top-5 right-5 z-50 animate-slideInRight transition-all
                ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} 
                text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3`}
            >
                {/* {toast.type === "success" ? "✔️" : "❌"} */}
                <span>{toast.message}</span>
            </div>
            )}

            {/* Filter Device */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">

                {/* Search */}
                <div className="relative">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Cari device..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition 
                    placeholder:text-gray-400"
                />
                <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Area Filter */}
                <select
                 value={areaFilter}
                 onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                text-sm text-gray-700 hover:bg-white hover:border-blue-400 hover:shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                <option value="all">Area: All</option>
                {areas.map(a => (
                  <option key={a.id} value={a.id}>{a.area_name}</option>
                ))}
                </select>

                {/* Status Filter */}
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                text-sm text-gray-700 hover:bg-white hover:border-blue-400 hover:shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                <option value="all">Status: All</option>
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
                <option value="faulted">Faulted</option>
                <option value="offline">Offline</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                text-sm text-gray-700 hover:bg-white hover:border-blue-400 hover:shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                <option value="name">Name</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
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
                    Tambah Device
                </button>
                </div>
            </div>
            </section>

            {/* Modal buat device */}
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

                {/* Name */}
                <input
                type="text"
                placeholder="Device Name"
                value={createForm.device_name}
                onChange={(e) =>
                    setCreateForm({ ...createForm, device_name: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-xl text-sm"
                />

                <input
                type="text"
                placeholder="Serial Number"
                value={createForm.serial_number}
                onChange={(e) =>
                    setCreateForm({ ...createForm, serial_number: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-xl text-sm"
                />

                {/* <input
                type="date"
                value={createForm.date_active}
                onChange={(e) =>
                    setCreateForm({ ...createForm, date_active: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-xl text-sm"
                /> */}

                {/* Area */}
                <select
                value={createForm.area_id}
                onChange={(e) =>
                    setCreateForm({ ...createForm, area_id: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-xl text-sm"
                >
                <option value="all">Area: All</option>
                {areas.map(a => (
                  <option key={a.id} value={a.id}>{a.area_name}</option>
                ))}
                </select>
                
                {/* <select
                value={createForm.status}
                onChange={(e) =>
                    setCreateForm({ ...createForm, status: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-xl text-sm"
                >
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
                <option value="faulted">Faulted</option>
                <option value="offline">Offline</option>
                </select> */}

                {/* Category */}
                <select
                value={createForm.category_id}
                onChange={(e) =>
                    setCreateForm({ ...createForm, category_id: e.target.value })
                }
                className="w-full px-4 py-2.5 border rounded-xl text-sm"
                >
                <option value="">Category</option>
                <option value="1">Vibration</option>
                <option value="2">Temperature</option>
                <option value="3">Pressure</option>
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
                    onClick={handleCreate}
                    disabled={loadingAction}
                    className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                    {loadingAction ? "Loading..." : "Simpan"}
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
                            {loading ? (
                                <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-500">
                                    Loading devices...
                                </td>
                                </tr>
                            ) : filteredDevices.length === 0 ? (
                                <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-500">
                                    Tidak ada data device
                                </td>
                                </tr>
                            ) : (
                                paginatedDevices.map((device, i) => (
                                <tr key={device.id}>
                                    <td className="p-3">{startIndex + i + 1}</td>

                                    <td className="p-3 font-medium">
                                    {device.device_name || "-"}
                                    </td>

                                    {/* kalau backend kirim relasi object */}
                                    <td className="p-3">
                                    {device.category?.category_name || "-"}
                                    </td>

                                    <td className="p-3">
                                    {device.serial_number || "-"}
                                    </td>

                                    <td className="p-3">
                                    {device.date_active || "-"}
                                    </td>

                                    <td className="p-3">
                                    <span
                                        className={`px-3 py-1 text-xs text-white rounded-full ${
                                        {
                                            offline: "bg-purple-500",
                                            faulted: "bg-red-500",
                                            stopped: "bg-yellow-500 text-black",
                                            running: "bg-green-500",
                                        }[device.status] || "bg-gray-400"
                                        }`}
                                    >
                                        {device.status}
                                    </span>
                                    </td>


                                    <td className="p-3">
                                    {device.area?.area_name || "-"}
                                    </td>

                                    <td className="p-3">
                                    <div className="flex gap-2">
                                        <button
                                        onClick={() => handleEdit(device)}
                                        className="bg-yellow-600 text-white p-2 rounded-lg"
                                        >
                                        <Edit size={16} />
                                        </button>

                                        <button
                                        onClick={() => handleDelete(device)}
                                        className="bg-red-600 text-white p-2 rounded-lg"
                                        >
                                        <Trash size={16} />
                                        </button>
                                    </div>
                                    </td>
                                </tr>
                                ))
                            )}
                            </tbody>
                    </table> 
                </div>

                {/* Pagination Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
                <p className="text-sm text-gray-500">
                    {from} to {to} of {totalItems} entries
                </p>
                <div className="flex items-center space-x-2">
                    {/* Prev */}
                    <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                    &lt;
                    </button>

                    {/* Page number */}
                    <span className="text-sm font-medium text-gray-700">
                    {currentPage} of {totalPages || 1}
                    </span>

                    {/* Next */}
                    <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                    &gt;
                    </button>
                </div>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                    *Table menampilkan maksimal 10 data per halaman. Gunakan tombol panah
                    untuk melihat halaman berikutnya.
                </p>
            </section>

            {/* Edit Modal */}
                {showEditModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-8 animate-fadeIn">

                    <h2 className="text-2xl font-semibold mb-8">Edit Device</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Device Name */}
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-600">Device Name</label>
                        <input
                            value={editForm.device_name}
                            name="device_name"
                            onChange={handleChange}
                            
                            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        </div>

                        {/* Category */}
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <select
                            value={editForm.category_id}
                            name="category_id"
                            onChange={handleChange}
                            
                            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select category</option>
                            <option value="1">Vibration</option>
                            <option value="2">Temperature</option>
                            <option value="3">Pressure</option>
                        </select>
                        </div>

                        {/* Serial Number */}
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-600">Serial Number</label>
                        <input
                            value={editForm.serial_number}
                            name="serial_number"
                            onChange={handleChange}
                            
                            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        </div>

                        {/* Date Active */}
                        {/* <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-600">Active Date</label>
                        <input
                            type="date"
                            value={editForm.date_active}
                            name="date_active"
                            onChange={handleChange}
                            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        </div> */}

                        {/* Status */}
                        {/* <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <select
                            value={editForm.status}
                            name="status"
                            onChange={handleChange}
                            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select status</option>
                            <option value="running">Running</option>
                            <option value="stopped">Stopped</option>
                            <option value="faulted">Faulted</option>
                            <option value="offline">Offline</option>
                        </select>
                        </div> */}

                        {/* Area */}
                        <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-600">Area</label>
                        <select
                            value={editForm.area_id}
                            name="area_id"
                            onChange={handleChange}
                            className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                        <option value="all">Area: All</option>
                        {areas.map(a => (
                          <option key={a.id} value={a.id}>{a.area_name}</option>
                        ))}
                        </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-10">
                        <button
                        onClick={() => setShowEditModal(false)}
                        className="px-5 py-2 rounded-xl border text-gray-600 hover:bg-gray-100 transition"
                        >
                        Cancel
                        </button>

                        <button
                        onClick={handleUpdate}
                        disabled={loadingAction}
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-md flex justify-center"
                        >
                        {loadingAction ? "Loading..." : "Save Changes"}
                        </button>
                    </div>
                    </div>
                </div>
                )}


            {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl animate-fadeIn p-6 text-center">

                <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                    <Trash size={22} />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Delete Item
                </h2>

                <p className="text-gray-600 text-sm mb-6">
                Device{" "} <span className="font-semibold text-gray-800">{selectedItem?.device_name}</span> 
                </p>

                <div className="flex justify-center gap-3">
                    <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition"
                    >
                    Cancel
                    </button>

                    <button
                    onClick={confirmDelete}
                    disabled={loadingAction}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white flex justify-center"
                    >
                    {loadingAction ? "Deleting..." : "Delete"}
                    </button>

                </div>

                </div>
            </div>
            )}
            
        </DashboardLayout>
    );
};

export default DevicePage;