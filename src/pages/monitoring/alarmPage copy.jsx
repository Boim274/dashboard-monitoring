import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Switch } from "@headlessui/react";
import DashboardLayout from "../../components/Dashboardlayout";
import api from "../../services/api";
const AlarmPage = () => {
  
  const [variables, setVariables] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [allAreas, setAllAreas] = useState([]);
  const [allSensors, setAllSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [searchSensor, setSearchSensor] = useState("");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showSensorDropdown, setShowSensorDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const areaRef = useRef(null);
  const sensorRef = useRef(null);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const filtered = filteredSensors.filter(item =>
    item.sensor_name.toLowerCase().includes(search.toLowerCase())
  );
  
  const [alarmForm, setAlarmForm] = useState({
    lowValue: "",
    lowText: "",
    highValue: "",
    highText: "",
  });
  const isDisabled = !selectedVariable;
  
  
  // Ambil Area dari API
  const fetchAreas = async () => {
    try {
      const res = await api.get("/areas");
      const areasData = res.data.data || res.data;
      setAllAreas(areasData.map(a => a.area_name));
    } catch (err) {
      console.error("Gagal fetch areas:", err);
    }
  };

  const fetchVariables = async (sensorId) => {
    try {
      const res = await api.get(`/sensors/${sensorId}`);
      const sensor = res.data.data;
  
      // contoh: vibration X, Y, Z
      // kalau backend 1 sensor = 1 axis, langsung push 1
      setVariables([sensor]);
  
    } catch (err) {
      console.error(err);
    }
  };
  
  // Ambil Sensor dari API
    const fetchSensors = async (area = null) => {
      try {
        const url = area ? `/sensors?area=${area}` : "/sensors";
        const res = await api.get(url);
        const sensorsData = res.data.data || res.data;
    
        setAllSensors(sensorsData);
        setFilteredSensors(sensorsData);
      } catch (err) {
        console.error("Gagal fetch sensors:", err);
      }
    };
  // Inisialisasi data
    useEffect(() => {
      fetchAreas();
      fetchSensors();
    }, []);

  // Filter sensor sesuai search
    useEffect(() => {
      if (!searchSensor) {
        setFilteredSensors(allSensors);
      } else {
        setFilteredSensors(
          allSensors.filter(s =>
            s.sensor_name.toLowerCase().includes(searchSensor.toLowerCase())
          )
        );
      }
    }, [searchSensor, allSensors]);
  

  // Close dropdown saat klik di luar
    useEffect(() => {
      const handleClickOutside = event => {
        if (areaRef.current && !areaRef.current.contains(event.target))
          setShowAreaDropdown(false);
        if (sensorRef.current && !sensorRef.current.contains(event.target))
          setShowSensorDropdown(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
      const fetchSensors = async () => {
        try {
          const res = await api.get("/sensors"); // endpoint Laravel kamu
          
        } catch (err) {
          console.error(err);
        }
      };
    
      fetchSensors();
    }, []);
    const handleSelectArea = (area) => {
      setSelectedArea(area);
    
      const sensorsByArea =
        area === "ALL"
          ? allSensors
          : allSensors.filter(s => s.area_name === area);
    
      setFilteredSensors(sensorsByArea);
    
      // jangan setVariables di sini
      setSelectedVariable(null);
    };
    
    
    
 useEffect(() => {
  if (!selectedVariable?.id) {
    setAlarmForm({ lowValue: "", lowText: "", highValue: "", highText: "" });
    setEnabled(false);
    return;
  }

  let isMounted = true; // untuk mencegah update state setelah unmount

  const fetchAlarm = async () => {
    try {
      const res = await api.get(`/alarms?sensor_id=${selectedVariable.id}`);
      const alarm = res.data.data?.[0];

      if (!isMounted) return;

      if (alarm) {
        setAlarmForm({
          lowValue: alarm.low_value ?? "",
          lowText: alarm.low_text ?? "",
          highValue: alarm.high_value ?? "",
          highText: alarm.high_text ?? "",
        });
        setEnabled(Boolean(alarm.is_active));
      } else {
        setAlarmForm({ lowValue: "", lowText: "", highValue: "", highText: "" });
        setEnabled(false);
      }
    } catch (err) {
      console.error(err);
      if (!isMounted) return;
      setAlarmForm({ lowValue: "", lowText: "", highValue: "", highText: "" });
      setEnabled(false);
    }
  };

  fetchAlarm();

  return () => { isMounted = false };
}, [selectedVariable?.id]);

    
    
    
    
    
    const handleChange = (key, value) => {
      setAlarmForm(prev => ({
        ...prev,
        [key]: value
      }));
    };

    const handleSaveAlarm = async () => {
      if (!selectedVariable) return;
    
      setLoading(true);
    
      const payload = {
        sensor_id: selectedVariable.id,
        is_active: enabled ? 1 : 0,
        low_value: alarmForm.lowValue ? Number(alarmForm.lowValue) : null,
        low_text: alarmForm.lowText || null,
        high_value: alarmForm.highValue ? Number(alarmForm.highValue) : null,
        high_text: alarmForm.highText || null,
      };
    
      try {
        // langsung POST, biar bisa tambah alarm baru
        const res = await api.post("/alarms", payload);
    
        // reset form
        setAlarmForm({ lowValue: "", lowText: "", highValue: "", highText: "" });
        setEnabled(false);
    
        alert("Alarm created 🚀");
        
      } catch (err) {
        console.error(err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    // Ketika pilih sensor baru
const handleSelectSensor = (sensor) => {
  setSelectedSensor(sensor);
  setSelectedVariable(sensor);
  setAlarmForm({ lowValue: "", lowText: "", highValue: "", highText: "" });
  setEnabled(false);
  setShowSensorDropdown(false);
};

    
    
    
    return (
        <DashboardLayout>

    {/* FILTER SECTION */}
    <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
          {/* Dropdown Area */}
          <div className="relative w-full md:w-64" ref={areaRef}>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Pilih Area
            </label>
            <div
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer flex justify-between items-center hover:shadow transition"
              onClick={() => setShowAreaDropdown(!showAreaDropdown)}
            >
              <span className="font-medium text-gray-800 truncate">
                {selectedArea}
              </span>
              <span className="text-gray-500">▾</span>
            </div>
            {showAreaDropdown && (
              <div className="absolute mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-20 w-full overflow-hidden">
                <div
                  className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-700 text-sm"
                  onClick={() => handleSelectArea("ALL")}
                >
                  ALL
                </div>
                {allAreas.map(area => (
                  <div
                    key={area}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-gray-700 text-sm"
                    onClick={() => handleSelectArea(area)}
                  >
                    {area}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown Sensor */}
          <div className="relative w-full md:w-64" ref={sensorRef}>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Pilih Sensor
            </label>
            <div
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer flex justify-between items-center hover:shadow transition"
              onClick={() => setShowSensorDropdown(!showSensorDropdown)}
            >
              <span className="font-medium text-gray-800 truncate">
              {selectedSensor?.sensor_name || "Pilih Sensor..."}
              </span>
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
                      key={sensor.id}
                      className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                      onClick={() => {
                        setSelectedSensor(sensor);
                        setSelectedVariable(sensor);
                        setAlarmForm({ lowValue: "", lowText: "", highValue: "", highText: "" });
                        setEnabled(false);
                        setShowSensorDropdown(false);
                      }}
                      
                      
                    >
                      {sensor.sensor_name}
                    </div>
                  ))

                ) : (
                  <p className="p-3 text-gray-500 text-sm text-center">
                    Sensor tidak ditemukan
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

        {/* Alarm Setting */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <p className="text-lg font-semibold mb-4">Alarm Setting</p>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* pilih sensor */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <p className="text-lg font-semibold text-gray-800">Variables</p>

                    {/* Search bar */}
                    <div className="relative w-48">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search variable..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    </div>
                </div>
                {/* Variables List with Divider */}
                <ul className="divide-y divide-gray-200 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filtered.map((item) => (

                  <li
                    key={item.id}
                    onClick={() => setSelectedVariable(item)}
                    className={`p-3 cursor-pointer transition
                      ${selectedVariable?.id === item.id ? "bg-blue-100" : "hover:bg-blue-50"}
                    `}
                  >
                    <p className="font-medium">{item.sensor_name}</p>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                  </li>
                ))}

                </ul>
            </div>

          {/* Form Alarm */}
          <div
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-lg font-semibold text-gray-800">Alarm</p>
                <p className="text-sm text-gray-500">Aktifkan atau nonaktifkan alarm</p>
              </div>

              <Switch
                checked={enabled} onChange={setEnabled} disabled={isDisabled}
                className={`${enabled ? "bg-blue-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </Switch>
            </div>

            {/* Variable Info */}
            <div className="mb-5">
              <p className="font-medium text-gray-800">
                {selectedVariable?.sensor_name || "Pilih variable dulu"}
              </p>
            </div>

            {/* Form */}
            <div className={`space-y-4 ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}>
              <input
                type="number"
                placeholder="Alarm Low Value"
                value={alarmForm.lowValue}
                onChange={(e) => handleChange("lowValue", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <textarea
                placeholder="Alarm Low Text"
                value={alarmForm.lowText}
                onChange={(e) => handleChange("lowText", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Alarm High Value"
                value={alarmForm.highValue}
                onChange={(e) => handleChange("highValue", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <textarea
                placeholder="Alarm High Text"
                value={alarmForm.highText}
                onChange={(e) => handleChange("highText", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Save */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={isDisabled || loading}
                onClick={handleSaveAlarm}
                className={`px-5 py-2 rounded-lg shadow-sm transition
                  ${isDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                 {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
            </div>
        </section>

      {/* recent Event Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Event</h2>
            <p className="text-sm text-gray-500">List of recent events</p>
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
                  Description
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activation Time
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 text-sm text-gray-700 font-medium" colSpan={3}>
                  Tidak ada event
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-gray-400">
            *Event akan ditampilkan jika API tersedia.
          </p>
        </div>
      </section>


 
        {/* recent Alarm Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Alarms</h2>
              <p className="text-sm text-gray-500">List of recent alarms</p>
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
                    Description
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Activation Time
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Termination Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 text-sm text-gray-700 font-medium">1</td>
                  <td className="p-3 text-sm text-gray-700">Alarm 1</td>
                  <td className="p-3 text-sm text-gray-700">2023-08-01 10:00:00</td>
                  <td className="p-3 text-sm text-gray-700">2023-08-01 11:00:00</td>
                </tr>
              </tbody>
            </table>

            {/* pagination */}
            <div className="flex items-center justify-between mt-4 space-y-3 md:space-y-0">
              <p className="text-sm text-gray-500">
                1 to 10 of 100 entries
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100">
                  &lt;
                </button>
                <span className="text-sm font-medium text-gray-700">1</span>
                <button className="px-3 py-1 text-sm border rounded-lg text-gray-600 hover:bg-gray-100">
                  &gt;
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

export default AlarmPage;