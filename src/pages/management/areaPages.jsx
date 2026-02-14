import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  SearchIcon, PlusCircle, Edit, Trash} from "lucide-react";
import api from "../../services/api";

const AreaPage = () => {
    const [openModal, setOpenModal] = useState(false);
    
    const [areas, setAreas] = useState([]);
    const [meta, setMeta] = useState({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    });
    
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name_asc");
    
    const fetchAreas = async (page = 1) => {
        setLoading(true);
        try {
          const res = await api.get("/areas", {
            params: {
              page,
              per_page: meta.per_page,
            },
          });
      
          setAreas(res.data.data);
          setMeta({
            current_page: res.data.current_page,
            last_page: res.data.last_page,
            per_page: res.data.per_page,
            total: res.data.total,
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchAreas(meta.current_page);
      }, [meta.current_page]);
      

      const filteredAreas = areas
      // SEARCH
      .filter((area) => {
        const keyword = search.toLowerCase();
        return (
          area.area_name?.toLowerCase().includes(keyword) ||
          area.area_location?.toLowerCase().includes(keyword)
        );
      })
    
      // FILTER STATUS
      .filter((area) => {
        if (statusFilter === "all") return true;
        return area.status === statusFilter;
      })
    
      // SORT
      .sort((a, b) => {
        switch (sortBy) {
          case "name_asc":
            return a.area_name.localeCompare(b.area_name);
          case "name_desc":
            return b.area_name.localeCompare(a.area_name);
          case "date_newest":
            return new Date(b.created_at) - new Date(a.created_at);
          case "date_oldest":
            return new Date(a.created_at) - new Date(b.created_at);
          default:
            return 0;
        }
      });
    

      

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition 
                placeholder:text-gray-400"
                />

                <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Filter status */}
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                <option value="all">Semua Status</option>
                <option value="active">Online</option>
                <option value="inactive">Offline</option>
                </select>


                {/* Sort */}
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                <option value="name_asc">Nama A–Z</option>
                <option value="name_desc">Nama Z–A</option>
                <option value="date_newest">Terbaru</option>
                <option value="date_oldest">Terlama</option>
                </select>

                {/* Add Area */}
                {/* <div className="flex justify-end">
                    <button
                    
                    className="flex items-center justify-center gap-2 px-4 py-2.5 
                    bg-blue-600 text-white text-sm font-semibold rounded-xl 
                    hover:bg-blue-700 active:scale-95 transition">
                    <PlusCircle className="w-5 h-5" />
                    Tambah Area
                    </button>
                    </div> */}

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
                    {loading && (
                        <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">
                            Loading data...
                        </td>
                        </tr>
                    )}

                    {!loading && filteredAreas.length === 0 && (
                        <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">
                            Data area tidak ditemukan
                        </td>
                        </tr>
                    )}

                    {!loading &&
                        filteredAreas.map((area, index) => (
                        <tr key={area.id} className="bg-white">
                            <td className="p-3 text-gray-700">{index + 1}</td>
                            <td className="p-3 font-medium text-gray-800">{area.area_name}</td>
                            <td className="p-3 text-gray-800">{area.area_location}</td>
                            <td className="p-3 text-gray-700">
                            <span
                                className={`px-3 py-1 text-xs font-medium text-white rounded-full
                                ${area.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                            >
                                {area.status === "active" ? "Aktif" : "Nonaktif"}
                            </span>
                            </td>
                            <td className="p-3 text-gray-700">
                            {area.date_active || "-"}
                            </td>
                            <td className="p-3 text-gray-700">
                            {area.admin?.name || "-"}
                            </td>
                        </tr>
                        ))}
                    </tbody>

                    </table> 
                </div>

                {/* Pagination Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
                    <p className="text-sm text-gray-500">
                        {(meta.current_page - 1) * meta.per_page + 1}
                        {" to "}
                        {Math.min(meta.current_page * meta.per_page, meta.total)}
                        {" of "}
                        {meta.total} entries
                    </p>

                    <div className="flex items-center space-x-2">
                        <button
                        onClick={() =>
                            setMeta((prev) => ({
                            ...prev,
                            current_page: prev.current_page - 1,
                            }))
                        }
                        disabled={meta.current_page === 1}
                        className="px-3 py-1 text-sm border rounded-lg text-gray-600 disabled:opacity-40"
                        >
                        &lt;
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                        {meta.current_page}
                        </span>
                        <button
                        onClick={() =>
                            setMeta((prev) => ({
                            ...prev,
                            current_page: prev.current_page + 1,
                            }))
                        }
                        disabled={meta.current_page === meta.last_page}
                        className="px-3 py-1 text-sm border rounded-lg text-gray-600 disabled:opacity-40"
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

        </DashboardLayout>
    );
};

export default AreaPage;