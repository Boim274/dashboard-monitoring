import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Dashboardlayout";
import {  Download  } from "lucide-react";
import api from "../../services/api";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";


const ReportPage = () => {
    const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedSensor, setSelectedSensor] = useState("all");
  const [range, setRange] = useState("year"); // year | month | day | hour
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredDevices = devices.filter((d) => {
    const matchArea =
      selectedArea === "all" || d.area?.area_name === selectedArea;
    const matchSensor =
      selectedSensor === "all" || d.device_name === selectedSensor;
    return matchArea && matchSensor;
  });

  const areas = [...new Set(devices.map((d) => d.area?.area_name).filter(Boolean))];
  const sensors = [...new Set(devices.map((d) => d.device_name))];

  const totalItems = filteredDevices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDevices = showModal
    ? filteredDevices
    : filteredDevices.slice(startIndex, endIndex);
  const from = totalItems === 0 ? 0 : startIndex + 1;
  const to = Math.min(endIndex, totalItems);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedArea, selectedSensor]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/devices");
      const data = res.data?.data || res.data || [];
      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal fetch devices", err);
    } finally {
      setLoading(false);
    }
  };

  const getRangeDates = () => {
    const now = new Date();
    let start;
  
    switch (range) {
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "hour":
        start = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getFullYear(), 0, 1);
    }
  
    const formatDate = (date) =>
      date.toISOString().split("T")[0] + (range === "hour" ? " " + date.toTimeString().split(" ")[0] : "");
  
    return {
      start: formatDate(start),
      end: formatDate(now),
    };
  };
  

  // Download single device report dari API
  const handleDownload = async (deviceId) => {
    try {
      const { start, end } = getRangeDates();
      const res = await api.get(`/reports/devices/${deviceId}?start=${start}&end=${end}`);
      const data = res.data;

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFontSize(14);
      doc.text(`Report Device #${data.device}`, 40, 40);

      const tableColumn = [
        "No",
        "Sensor Name",
        "Running (s)",
        "Stopped (s)",
        "Offline (s)",
        "Faulted (s)",
        "Alarms",
        "Uptime %"
      ];
      const tableRows = [];

      data.report.forEach((sensor, idx) => {
        tableRows.push([
          idx + 1,
          sensor.sensor_name,
          sensor.stats.running,
          sensor.stats.stopped,
          sensor.stats.offline,
          sensor.stats.faulted,
          sensor.stats.alarms,
          sensor.stats.uptime_percent
        ]);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        theme: "grid",
        styles: { fontSize: 10 }
      });

      doc.save(`report-${data.device}.pdf`);
    } catch (err) {
      console.error("Gagal generate report:", err);
      alert("Gagal fetch report device!");
    }
  };

  // Download semua device filtered dari API
  const handleDownloadAllFiltered = async () => {
    try {
      if (!filteredDevices.length) {
        alert("Tidak ada data untuk di-export!");
        return;
      }

      const { start, end } = getRangeDates();
      const promises = filteredDevices.map((d) =>
        api.get(`/reports/devices/${d.id}?start=${start}&end=${end}`)
      );
      const results = await Promise.all(promises);

      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`Report All Filtered Devices`, 14, 20);

      results.forEach((res, idxDevice) => {
        const data = res.data;
        doc.setFontSize(12);
        doc.text(
          `${idxDevice + 1}. Device: ${data.device}`,
          14,
          doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 40
        );

        const tableColumn = [
          "No",
          "Sensor Name",
          "Running (s)",
          "Stopped (s)",
          "Offline (s)",
          "Faulted (s)",
          "Alarms",
          "Uptime %"
        ];
        const tableRows = [];

        data.report.forEach((sensor, idx) => {
          tableRows.push([
            idx + 1,
            sensor.sensor_name,
            sensor.stats.running,
            sensor.stats.stopped,
            sensor.stats.offline,
            sensor.stats.faulted,
            sensor.stats.alarms,
            sensor.stats.uptime_percent
          ]);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60,
          theme: "grid",
          styles: { fontSize: 10 }
        });
      });

      doc.save(`report-all-filtered.pdf`);
    } catch (err) {
      console.error("Gagal generate report:", err);
      alert("Gagal fetch report semua device!");
    }
  };

  const sensorOptions = [
    { value: "all", label: "All Sensor" },
    ...sensors.map((s) => ({ value: s, label: s })),
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.75rem",
      borderColor: "#e5e7eb",
      padding: "0.25rem 0.5rem",
      minHeight: "2.5rem",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.75rem",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#eef2ff" : "white",
      color: "#111827",
    }),
  };
      
    return (
        <DashboardLayout>
            {/* FILTER SECTION */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                {/* LEFT SIDE (Area + Sensor) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">

                {/* Area */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 mb-1">
                    Area
                    </label>
                    <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm"
                    >
                    <option value="all">All Area</option>
                    {areas.map(a => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                    </select>

                </div>

                {/* Sensor */}
                <div className="w-64">
                <label className="text-xs font-semibold text-gray-500 mb-1">
                    Sensor
                </label>
                <Select
                    options={sensorOptions} 
                    value={sensorOptions.find(o => o.value === selectedSensor)}
                    onChange={(opt) => setSelectedSensor(opt.value)}
                    placeholder="Cari sensor..."
                    isSearchable
                    styles={customStyles}
                />
                </div>

                </div>

                {/* RIGHT SIDE (Range toggle) */}
                {/* <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 mb-2">
                    Time Range
                </span>

                <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1 shadow-inner">

                    {[
                    { label: "Year", value: "year" },
                    { label: "Month", value: "month" },
                    { label: "Day", value: "day" },
                    { label: "Hour", value: "hour" },
                    ].map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setRange(item.value)}
                        className={`
                        px-4 py-2 text-sm font-semibold rounded-lg transition
                        ${range === item.value
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-600 hover:bg-white hover:text-blue-600"}
                        `}
                    >
                        {item.label}
                    </button>
                    ))}

                </div>
                </div> */}

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

                <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition active:scale-95"
                >
                View All
                </button>


            </div>

            {/* Modal */}
            {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                <div className="bg-white w-[95%] md:w-[85%] max-h-[85vh] rounded-2xl shadow-xl flex flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b">
                    <div>
                    <h3 className="font-semibold text-lg">All Reports</h3>
                    <p className="text-xs text-gray-500">
                        {filteredDevices.length} devices found
                    </p>
                    </div>

                    <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-500 transition"
                    >
                    Close
                    </button>
                </div>

                {/* CONTENT */}
                <div className="overflow-auto">

                    <table className="min-w-full text-sm">

                    {/* HEAD */}
                    <thead className="sticky top-0 bg-gray-50 border-b text-gray-600">
                        <tr>
                        {["No", "Device", "Serial Number", "Area", "Last Update"].map((h) => (
                            <th key={h} className="p-3 text-left font-semibold">
                            {h}
                            </th>
                        ))}
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {filteredDevices.map((item, index) => (
                        <tr
                            key={item.id}
                            className="border-b odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                        >
                            <td className="p-3">{index + 1}</td>

                            <td className="p-3 font-medium text-gray-800">
                            {item.device_name}
                            </td>

                            <td className="p-3 text-gray-600">
                            {item.serial_number}
                            </td>

                            <td className="p-3 text-gray-600">
                            {item.area?.area_name}
                            </td>

                            <td className="p-3 text-xs text-gray-500">
                            {item.updated_at
                                ? new Date(item.updated_at).toLocaleString()
                                : "-"}
                            </td>
                        </tr>
                        ))}
                    </tbody>

                    </table>
                </div>
                </div>
            </div>
            )}


            

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
                    {loading ? (
                        <tr>
                        <td colSpan="5" className="p-6 text-center text-gray-400">
                            Loading...
                        </td>
                        </tr>
                    ) : devices.length === 0 ? (
                        <tr>
                        <td colSpan="5" className="p-6 text-center text-gray-400">
                            No data
                        </td>
                        </tr>
                    ) : (
                        paginatedDevices.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="p-3 text-sm">{startIndex + index + 1}</td>
                            <td className="p-3 text-sm font-medium">{item.device_name}</td>
                            <td className="p-3 text-sm">{item.serial_number}</td>
                            <td className="p-3 text-sm">{item.area?.area_name}</td>
                            <td>
                            <button
                                onClick={() => handleDownload(item.id)}
                                className="text-blue-600"
                            >
                                <Download size={18} />
                            </button>
                            </td>



                        </tr>
                        ))
                    )}
                    </tbody>

                </table>
            </div>

            {/* Pagination */}
             {/* Pagination Section */}
             <div className="flex flex-col md:flex-row items-center justify-between mt-4 space-y-3 md:space-y-0">
                <p className="text-sm text-gray-500">
                    {from} to {to} of {totalItems} entries
                </p>
                <div className="flex items-center space-x-2">
                    {/* Prev */}
                    <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

        </DashboardLayout>
    );
};

export default ReportPage;