import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import DashboardLayout from "../../components/Dashboardlayout";
import GaugeChart from "react-gauge-chart";
import api from "../../services/api";

const MonitoringPage = () => {
  const [areas, setAreas] = useState([]);
  const [sensorDataByArea, setSensorDataByArea] = useState({});
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState("");
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showSensorDropdown, setShowSensorDropdown] = useState(false);
  const [searchSensor, setSearchSensor] = useState("");
  const [loadingAreas, setLoadingAreas] = useState(true);

  const areaRef = useRef(null);
  const sensorRef = useRef(null);

  // Ambil daftar area
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await api.get("/areas");
        setAreas(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };
    fetchAreas();
  }, []);

  // Ambil data sensor saat area berubah
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const params = {};
        if (selectedAreaId) params.area_id = selectedAreaId;
        const res = await api.get("/monitoring", { params });
        setSensorDataByArea(res.data && typeof res.data === "object" ? res.data : {});
      } catch (err) {
        console.error(err);
        setSensorDataByArea({});
      }
    };
    fetchSensorData();
    setSelectedSensor(""); // reset sensor saat area berubah
  }, [selectedAreaId]);

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (areaRef.current && !areaRef.current.contains(e.target)) setShowAreaDropdown(false);
      if (sensorRef.current && !sensorRef.current.contains(e.target)) setShowSensorDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sensor untuk area yang dipilih
  const sensorsForSelectedArea = React.useMemo(() => {
    if (!sensorDataByArea) return [];
    const area = selectedAreaId ? sensorDataByArea[selectedAreaId] : null;
    return area?.sensors
      ? Object.keys(area.sensors)
      : Object.values(sensorDataByArea).flatMap(a => Object.keys(a.sensors || {}));
  }, [sensorDataByArea, selectedAreaId]);

  // Filter sensor berdasarkan search
  const filteredSensors = React.useMemo(() => {
    return sensorsForSelectedArea.filter(sensor =>
      sensor.toLowerCase().includes(searchSensor.toLowerCase())
    );
  }, [sensorsForSelectedArea, searchSensor]);

  // Chart data, filter di frontend
 // Chart data, filter di frontend
// Chart data, filter di frontend
const chartDataToDisplay = React.useMemo(() => {
  const data = [];
  Object.entries(sensorDataByArea || {}).forEach(([areaId, area]) => {
    if (!selectedAreaId || String(selectedAreaId) === String(areaId)) {
      Object.entries(area.sensors || {}).forEach(([sensorName, logs]) => {
        if (!selectedSensor || sensorName === selectedSensor) {
          const lastLog = Array.isArray(logs) ? logs.at(-1) || {} : {};
          let status = lastLog.status;

          // Kalau status kosong, cek value / x/y/z
          const hasData = lastLog.value !== undefined ||
                          lastLog.x !== undefined ||
                          lastLog.y !== undefined ||
                          lastLog.z !== undefined;

          if (!status && hasData) {
            status = "running"; // paksa running kalau ada data
          }

          data.push({
            area: area.area_name,
            sensor: sensorName,
            status: status || "offline",
            data: Array.isArray(logs) ? logs : []
          });
        }
      });
    }
  });
  return data;
}, [sensorDataByArea, selectedAreaId, selectedSensor]);



  const getStatusStyle = (status) => {
    switch (status) {
      case "running": return "bg-green-500 text-white";
      case "stopped": return "bg-yellow-500 text-white";
      case "faulted": return "bg-red-500 text-white";
      case "offline": return "bg-gray-400 text-white";
      default: return "bg-gray-300 text-white";
    }
  };
  
  

  const normalizeStatus = (status) => {
    if (!status) return "offline";
    const s = String(status).toLowerCase();
    if (["running", "1"].includes(s)) return "running";
    if (["stopped", "0"].includes(s)) return "stopped";
    if (["faulted", "2"].includes(s)) return "faulted";
    if (["alarm", "3"].includes(s)) return "alarm";
    if (["data"].includes(s)) return "data";
    if (["status"].includes(s)) return "status";
    return "offline";
  };

  return (
    <DashboardLayout>
      {/* FILTER */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">

          {/* Area Dropdown */}
          <div className="relative w-full md:w-64" ref={areaRef}>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Pilih Area</label>
            <div
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer flex justify-between items-center hover:shadow transition"
              onClick={() => setShowAreaDropdown(!showAreaDropdown)}
            >
              <span className="font-medium text-gray-800 truncate">
                {selectedAreaId
                  ? areas.find(a => String(a.id) === String(selectedAreaId))?.area_name ?? "Area tidak ditemukan"
                  : "Area: ALL"}
              </span>
              <span className="text-gray-500">▾</span>
            </div>
            {showAreaDropdown && (
              <div className="absolute mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-20 w-full overflow-hidden">
                <div
                  className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700 text-sm"
                  onClick={() => { setSelectedAreaId(null); setShowAreaDropdown(false); }}
                >
                  Area: ALL
                </div>
                {loadingAreas
                  ? <div className="px-4 py-2 text-gray-400 text-sm">Loading...</div>
                  : (areas || []).map(area => (
                      <div
                        key={area.id}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700 text-sm"
                        onClick={() => { setSelectedAreaId(area.id); setShowAreaDropdown(false); }}
                      >
                        {area.area_name}
                      </div>
                    ))
                }
              </div>
            )}
          </div>

          {/* Sensor Dropdown */}
          <div className="relative w-full md:w-64" ref={sensorRef}>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Pilih Sensor</label>
            <div
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer flex justify-between items-center hover:shadow transition"
              onClick={() => setShowSensorDropdown(!showSensorDropdown)}
            >
              <span className="font-medium text-gray-800 truncate">{selectedSensor || "Pilih Sensor..."}</span>
              <span className="text-gray-500">▾</span>
            </div>

            {showSensorDropdown && (
              <div className="absolute z-20 w-full bg-white border border-gray-100 rounded-xl shadow-lg mt-2 max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 sticky top-0 bg-white">
                  <input
                    type="text"
                    placeholder="Cari sensor..."
                    value={searchSensor}
                    onChange={e => setSearchSensor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                {filteredSensors.length > 0 ? (
                  filteredSensors.map(sensor => (
                    <div
                      key={sensor}
                      className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 ${
                        sensor === selectedSensor ? "bg-indigo-100 font-semibold" : ""
                      }`}
                      onClick={() => {
                        setSelectedSensor(sensor);
                        setShowSensorDropdown(false);
                      }}
                    >
                      {sensor}
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-gray-500 text-sm text-center">Sensor tidak ditemukan</p>
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* CHART */}
      <div className="flex flex-col space-y-6">

        {chartDataToDisplay.length === 0 && (
          <div className="p-6 bg-white rounded-2xl shadow-md text-center text-gray-500 border border-gray-200">
            Tidak ada data untuk ditampilkan
          </div>
        )}

        {chartDataToDisplay.map((item, index) => {
          const lastLog = item.data?.at(-1) || {};

          // tentukan status logika baru
          const hasData = lastLog.value !== undefined || lastLog.x !== undefined || lastLog.y !== undefined || lastLog.z !== undefined;
          const rawStatus = lastLog.status ?? item.status ?? null;
          const lastStatus = rawStatus || (hasData ? "running" : "offline");
          const lastStatusNormalized = normalizeStatus(lastStatus);

          // hitung value terakhir untuk gauge
          const lastValue = Math.sqrt(
            (Number(lastLog.x ?? 0) ** 2) +
            (Number(lastLog.y ?? 0) ** 2) +
            (Number(lastLog.z ?? 0) ** 2)
          ) || Number(lastLog.value ?? 0);

          const formattedData = (item.data || []).map(log => ({
            time: log.time || "",
            x: Number(log.x ?? 0),
            y: Number(log.y ?? 0),
            z: Number(log.z ?? 0),
            value: Number(log.value ?? 0),
          }));

          const lastX = Number(lastLog.x ?? 0);

          return (
            <div
              key={index}
              className="flex flex-col p-6 rounded-2xl shadow-xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 truncate">{item.sensor}</h3>
                  <p className="text-sm text-gray-500">{item.area}</p>
                </div>

                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize flex items-center gap-1 ${getStatusStyle(lastStatusNormalized)}`}>
                  <span className="w-2 h-2 rounded-full bg-white/80"></span>
                  {lastStatusNormalized}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4 w-full h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis domain={['auto','auto']} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="x" stroke="#ef4444" fill="#ef444430" name="X Axis" strokeWidth={2} />
                      <Area type="monotone" dataKey="y" stroke="#22c55e" fill="#22c55e30" name="Y Axis" strokeWidth={2} />
                      <Area type="monotone" dataKey="z" stroke="#3b82f6" fill="#3b82f630" name="Z Axis" strokeWidth={2} />
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#f59e0b30" name={item.sensor} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="md:w-1/4 w-full">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-col items-center">
                    <p className="text-xs text-gray-500 mb-2 tracking-wide uppercase">Current Value</p>
                    <GaugeChart
                      id={`gauge-${index}`}
                      nrOfLevels={30}
                      percent={Math.min(lastValue / 100, 1)}
                      arcsLength={[0.3,0.4,0.3]}
                      colors={["#22c55e","#facc15","#ef4444"]}
                      arcPadding={0.02}
                      textColor="transparent"
                      needleColor="#111827"
                      needleBaseColor="#111827"
                      animate={true}
                    />
                    <p className="text-3xl font-bold text-gray-800 mt-2">{lastValue.toFixed(2)}</p>
                    <span
                      className={`mt-1 text-xs px-3 py-1 rounded-full font-medium ${
                        lastX < 40 ? "bg-green-100 text-green-600" : lastX < 75 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.unit || "unit"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}


      </div>

    </DashboardLayout>
  );
};

export default MonitoringPage;
