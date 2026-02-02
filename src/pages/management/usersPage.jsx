import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  SearchIcon, PlusCircle, Edit, Trash  } from "lucide-react";
import api from "../../services/api";


const UserPage = () => {

    const [notifications, setNotifications] = useState([]);
    const [loadingNotif, setLoadingNotif] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name_asc");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [userMeta, setUserMeta] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      });
    const filteredNotifications = notifications.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );
    const [alert, setAlert] = useState({
    show: false,
    type: "success", // success | error
    message: "",
    });
    const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    email: "",
    no_phone: "",
    role: "",
    });
    const [createForm, setCreateForm] = useState({
        name: "",
        username: "",
        email: "",
        no_phone: "",
        password: "",
        role: "admin",
    });
    const handleCreateUser = async () => {
        setActionLoading(true);
        try {
          await api.post("/users", createForm);
      
          setAlert({
            show: true,
            type: "success",
            message: "User berhasil ditambahkan",
          });
      
          setOpenModal(false);
          setCreateForm({
            name: "",
            username: "",
            email: "",
            no_phone: "",
            password: "",
            role: "admin",
          });
      
          fetchUsers();
        } catch (err) {
          setAlert({
            show: true,
            type: "error",
            message: err.response?.data?.message || "Gagal menambahkan user",
          });
        } finally {
          setActionLoading(false);
        }
    };
    const handleDelete = (user) => {
      setSelectedUser(user);
      setDeleteModal(true);
    };
    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditForm({
          name: user.name,
          username: user.username,
          email: user.email,
          no_phone: user.no_phone,
          role: user.role,
        });
        setEditModal(true);
    };
    const handleUpdateUser = async () => {
        setActionLoading(true);
        try {
          await api.put(`/users/${selectedUser.id}`, editForm);
      
          setAlert({
            show: true,
            type: "success",
            message: "User berhasil diperbarui",
          });
      
          setEditModal(false);
          setSelectedUser(null);
          fetchUsers();
        } catch (err) {
          setAlert({
            show: true,
            type: "error",
            message: err.response?.data?.message || "Gagal update user",
          });
        } finally {
          setActionLoading(false);
        }
    };
    const confirmDeleteUser = async () => {
        setActionLoading(true);
        try {
          await api.delete(`/users/${selectedUser.id}`);
      
          setAlert({
            show: true,
            type: "success",
            message: "User berhasil dihapus",
          });
      
          setDeleteModal(false);
          setSelectedUser(null);
          fetchUsers();
        } catch (err) {
          setAlert({
            show: true,
            type: "error",
            message: err.response?.data?.message || "Gagal hapus user",
          });
        } finally {
          setActionLoading(false);
        }
    };
    

    useEffect(() => {
        fetchNotifications();
    }, []);
    const fetchNotifications = async () => {
        try {
          const res = await api.get("/user-notifications");
          setNotifications(res.data.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingNotif(false);
        }
    };

    useEffect(() => {
        fetchUsers(userMeta.current_page);
      }, [userMeta.current_page, search, roleFilter]);
      
    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
          const res = await api.get("/users", {
            params: {
              page,
              per_page: userMeta.per_page,
              search,
              role: roleFilter !== "all" ? roleFilter : undefined,
            },
          });
      
          setUsers(res.data.data);
          setUserMeta({
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
    
    const filteredUsers = users
    .filter((user) => {
      const keyword = search.toLowerCase();
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    })
    .filter((user) => {
      if (roleFilter === "all") return true;
      return user.role === roleFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "email_asc":
          return a.email.localeCompare(b.email);
        case "email_desc":
          return b.email.localeCompare(a.email);
        default:
          return 0;
      }
    });

    useEffect(() => {
        if (alert.show) {
          const timer = setTimeout(() => {
            setAlert({ ...alert, show: false });
          }, 2500);
          return () => clearTimeout(timer);
        }
      }, [alert]);
    
    
    return (
        
        <DashboardLayout>

            {/* Alert */}
            {alert.show && (
            <div
                className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl shadow-lg text-sm font-medium
                ${alert.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"}`}
            >
                {alert.message}
            </div>
            )}

            {/* User Notifikasi Card */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4 space-y-4">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-800">
                User Notifikasi
                </h2>

                {/* Search */}
                <div className="relative w-full md:w-72">
                <input
                type="text"
                placeholder="Cari user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition 
                placeholder:text-gray-400"
                />

                <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                    <th className="p-3 text-left font-semibold text-gray-600">No</th>
                    <th className="p-3 text-left font-semibold text-gray-600">User</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Whatsapp</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Email</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Event</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Alarm</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                {loadingNotif ? (
                    <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                        Loading data...
                    </td>
                    </tr>
                ) : filteredNotifications.length === 0 ? (
                    <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                        Tidak ada notifikasi
                    </td>
                    </tr>
                ) : (
                    filteredNotifications.map((item, i) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-700">{i + 1}</td>
                        <td className="p-3 font-medium text-gray-800">{item.name}</td>
                        <td className="p-3 text-gray-700">{item.no_phone}</td>
                        <td className="p-3 text-gray-700">{item.email}</td>
                        <td className="p-3 text-gray-700">{item.event_date}</td>
                        <td className="p-3">
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${
                                item.alarm === "active"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {item.alarm === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
                </table>
            </div>

            </section>

            {/* User Table Filter */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

                    {/* Search */}
                    <div className="relative">
                        <input
                        type="text"
                        placeholder="Cari user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 
                        focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition 
                        placeholder:text-gray-400"
                        />
                    <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>

                    {/* Filter Role */}
                    <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                    <option value="all">All Role</option>
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
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
                    <option value="email_asc">Email A–Z</option>
                    <option value="email_desc">Email Z–A</option>
                    </select>

                    {/* Add User Button */}
                    <div className="flex justify-end">
                    <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 
                    bg-blue-600 text-white text-sm font-semibold rounded-xl 
                    hover:bg-blue-700 active:scale-95 transition">
                    <PlusCircle className="w-5 h-5" />
                    Tambah User
                    </button>
                    </div>
                </div>
            </section>
            {openModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                {/* Modal Box */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                    Tambah User
                    </h2>
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
                    type="email"
                    placeholder="Email"
                    value={createForm.email}
                    onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl text-sm"
                />

                <input
                    type="text"
                    placeholder="Name"
                    value={createForm.name}
                    onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl text-sm"
                />

                <input
                    type="text"
                    placeholder="Username"
                    value={createForm.username}
                    onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl text-sm"
                />

                <input
                    type="text"
                    placeholder="No Phone"
                    value={createForm.no_phone}
                    onChange={(e) =>
                    setCreateForm({ ...createForm, no_phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl text-sm"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={createForm.password}
                    onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl text-sm"
                />

                {/* ROLE */}
                <select
                    value={createForm.role}
                    onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white"
                >
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
                </select>
                </div>
                {/* Footer */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 transition"
                    >
                    Batal
                    </button>
                    <button
                        onClick={handleCreateUser}
                        disabled={actionLoading}
                        className={`px-4 py-2 text-sm rounded-xl text-white transition
                        ${actionLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                        {actionLoading ? "Menyimpan..." : "Simpan"}
                    </button>


                </div>
                </div>
            </div>
            )}

            {/* User Table */}
            <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-4">
            <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full border-collapse text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="p-3 text-left font-semibold text-gray-600">No</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Username</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Name</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Email</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Phone</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Role</th>
                    <th className="p-3 text-left font-semibold text-gray-600">Action</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                {loading ? (
                <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                    Loading users...
                    </td>
                </tr>
                ) : users.length === 0 ? (
                <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                    Tidak ada user
                    </td>
                </tr>
                ) : (
                    filteredUsers.map((user, i) => (
                    <tr key={user.id}>
                    <td className="p-3">
                    {(userMeta.current_page - 1) * userMeta.per_page + i + 1}
                    </td>
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.no_phone}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                        <div className="flex gap-2">
                        <button onClick={() => handleEdit(user)} className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 active:scale-95 transition"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(user)} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 active:scale-95 transition"><Trash size={16} /></button>
                        </div>
                    </td>
                    </tr>
                ))
                )}
                </tbody>
            </table>
            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
                {(userMeta.current_page - 1) * userMeta.per_page + 1}
                {" to "}
                {Math.min(
                userMeta.current_page * userMeta.per_page,
                userMeta.total
                )}
                {" of "}
                {userMeta.total} users
            </p>

            <div className="flex items-center space-x-2">
                <button
                onClick={() =>
                    setUserMeta((prev) => ({
                    ...prev,
                    current_page: prev.current_page - 1,
                    }))
                }
                disabled={userMeta.current_page === 1}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40"
                >
                &lt;
                </button>

                <span className="text-sm font-medium">
                {userMeta.current_page}
                </span>

                <button
                onClick={() =>
                    setUserMeta((prev) => ({
                    ...prev,
                    current_page: prev.current_page + 1,
                    }))
                }
                disabled={userMeta.current_page === userMeta.last_page}
                className="px-3 py-1 text-sm border rounded-lg disabled:opacity-40"
                >
                &gt;
                </button>
            </div>
            </div>

            </div>
            </section>
            {/* EDIT MODAL */}
            {editModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-scaleIn">

                    <h2 className="text-lg font-semibold mb-4">Edit User</h2>

                    <div className="space-y-3">
                    <input
                    value={editForm.name}
                    onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl"
                    />
                    <input
                        value={editForm.email}
                        onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border rounded-xl"
                        />
                    <input
                    value={editForm.no_phone}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setEditForm({ ...editForm, no_phone: value });
                      }}
                    className="w-full px-4 py-2.5 border rounded-xl"
                    />
                    <select
                    value={editForm.role}
                    onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border rounded-xl bg-white"
                    >
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
                    </select>
                    </div>
                    {/* FOOTER */}
                    <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={() => setEditModal(false)}
                        className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100"
                    >
                        Close
                    </button>

                    <button
                        onClick={handleUpdateUser}
                        disabled={actionLoading}
                        className={`px-4 py-2 rounded-xl text-white
                        ${actionLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                        {actionLoading ? "Menyimpan..." : "Save"}
                    </button>


                    </div>
                </div>
                </div>
            )}
            {/* DELETE MODAL */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl animate-scaleIn">

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Delete User
                    </h3>
                    <p className="text-sm text-gray-600">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-red-600">
                        {selectedUser?.name}
                    </span>
                    ?
                    </p>

                    <div className="flex justify-end gap-2 mt-6">

                    <button
                        onClick={() => setDeleteModal(false)}
                        className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100"
                    >
                        Close
                    </button>

                    <button
                        onClick={confirmDeleteUser}
                        disabled={actionLoading}
                        className={`px-4 py-2 text-white rounded-xl
                        ${actionLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}`}
                        >
                        {actionLoading ? "Menghapus..." : "Delete"}
                    </button>

                    </div>
                </div>
                </div>
            )}
            
        </DashboardLayout>
    );
};

export default UserPage;