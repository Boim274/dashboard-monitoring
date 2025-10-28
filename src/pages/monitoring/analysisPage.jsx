import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer, 
} from "recharts";
import {  Clock, AlertCircleIcon, CircleArrowDownIcon, ArrowDownIcon, ArrowDownUpIcon, ArrowUp, Settings, Mail, X, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../components/Dashboardlayout";

const AnalysisPage = () => {

    // Simulasi data sensor
    const sensorDataByArea = {
        "Area A": {
          "Sensor Vibrasi A1": [
            { time: "08:00", x: 2, y: 3, z: 1 },
            { time: "09:00", x: 4, y: 2, z: 3 },
            { time: "10:00", x: 3, y: 4, z: 2 },
          ],
          "Sensor Suhu A1": [
            { time: "08:00", value: 28 },
            { time: "09:00", value: 30 },
            { time: "10:00", value: 31 },
          ],
        },
        "Area B": {
          "Sensor Vibrasi B1": [
            { time: "08:00", x: 1, y: 2, z: 3 },
            { time: "09:00", x: 2, y: 3, z: 4 },
            { time: "10:00", x: 3, y: 4, z: 2 },
          ],
          "Sensor Tekanan B1": [
            { time: "08:00", value: 1.2 },
            { time: "09:00", value: 1.4 },
            { time: "10:00", value: 1.3 },
          ],
        },
        "Area C": {
          "Sensor Suhu C1": [
            { time: "08:00", value: 29 },
            { time: "09:00", value: 32 },
            { time: "10:00", value: 33 },
          ],
          "Sensor Vibrasi C1": [
            { time: "08:00", x: 3, y: 2, z: 4 },
            { time: "09:00", x: 4, y: 3, z: 2 },
            { time: "10:00", x: 2, y: 4, z: 3 },
          ],
          "Sensor Arus C1": [
            { time: "08:00", value: 4.1 },
            { time: "09:00", value: 4.3 },
            { time: "10:00", value: 4.2 },
          ],
        },
      };

    // event
      const events = [
        {
          id: 1,
          message:
            "PT Asian Isuzu Casting Center updated variable enabled from false to true on device 'Vibration BE1'.",
          time: "23/10/2025 10:46",
        },
        {
          id: 2,
          message:
            "Machine 02 reported unusual vibration threshold exceeded on sensor 'Vibration B1'.",
          time: "23/10/2025 09:13",
        },
        {
          id: 3,
          message:
            "Temperature in Area C exceeded 60°C, automatic cooling activated.",
          time: "22/10/2025 16:32",
        },
        {
          id: 4,
          message:
            "Power fluctuation detected on Phase 3, system stabilized automatically.",
          time: "22/10/2025 13:40",
        },
      ];
    
      const alarms = [
    {
      id: 1,
      title: "High Temperature Detected",
      message: "Sensor Suhu A1 mencatat suhu 85°C (di atas ambang batas).",
      time: "23/10/2025 10:15",
    },
    {
      id: 2,
      title: "Abnormal Vibration Level",
      message: "Sensor Vibrasi B2 menunjukkan getaran tidak normal.",
      time: "23/10/2025 09:52",
    },
    {
      id: 3,
      title: "Pressure Drop",
      message: "Tekanan di Area C turun di bawah 1.0 bar.",
      time: "23/10/2025 08:27",
    },
    {
      id: 4,
      title: "Power Interruption",
      message: "Pasokan daya di Area B sempat terputus 3 detik.",
      time: "22/10/2025 17:46",
    },
  ];

  const visibleAlarms = alarms.slice(0, 3);

    // data statistic
    const dataX = [
      { date: "14 Okt", value: 0 },
      { date: "15 Okt", value: 20000 },
      { date: "16 Okt", value: 40000 },
      { date: "17 Okt", value: 60000 },
      { date: "18 Okt", value: 80000 },
      // ... lanjutkan datanya
    ];
    const dataY= [
      { date: "14 Okt", value: 0 },
      { date: "15 Okt", value: 1 },
      { date: "16 Okt", value: 2 },
      { date: "17 Okt", value: 3 },
      { date: "18 Okt", value: 4 },
      // ... lanjutkan datanya
    ];
    const dataZ= [
      { date: "14 Okt", value: 0 },
      { date: "15 Okt", value: 20000 },
      { date: "16 Okt", value: 40000 },
      { date: "17 Okt", value: 60000 },
      { date: "18 Okt", value: 80000 },
      // ... lanjutkan datanya
    ];

    const [selectedRange, setSelectedRange] = useState("1H");
    const ranges = ["1H", "1D", "4D", "1W", "15D", "1M", "3M", "6M", "1Y"];

    const [showAll, setShowAll] = useState(false);
    

    // tampilkan hanya 3 item di dashboard
    const visibleEvents = events.slice(0, 3);

    // cari index dari range yang aktif sekarang
    const currentIndex = ranges.indexOf(selectedRange);

    const [selectedArea, setSelectedArea] = useState("ALL");
    const [selectedSensor, setSelectedSensor] = useState("");
    const [showSensorDropdown, setShowSensorDropdown] = useState(false);
    const [showAreaDropdown, setShowAreaDropdown] = useState(false);
    const [searchSensor, setSearchSensor] = useState("");
    const areaRef = useRef(null);
    const sensorRef = useRef(null);

    const allAreas = Object.keys(sensorDataByArea);
    const sensorsForSelectedArea =
      selectedArea !== "ALL"
        ? Object.keys(sensorDataByArea[selectedArea])
        : allAreas.flatMap((area) => Object.keys(sensorDataByArea[area]));
  
    const filteredSensors = sensorsForSelectedArea.filter((sensor) =>
      sensor.toLowerCase().includes(searchSensor.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (areaRef.current && !areaRef.current.contains(event.target)) {
            setShowAreaDropdown(false);
          }
          if (sensorRef.current && !sensorRef.current.contains(event.target)) {
            setShowSensorDropdown(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

       // 🔹 Ambil data berdasarkan filter
  let chartDataToDisplay = [];

  if (selectedSensor) {
    // Jika sensor dipilih → tampilkan 1 chart
    if (selectedArea !== "ALL") {
      chartDataToDisplay.push({
        area: selectedArea,
        sensor: selectedSensor,
        data: sensorDataByArea[selectedArea]?.[selectedSensor] || [],
      });
    } else {
      // Cari sensor di semua area
      allAreas.forEach((area) => {
        const data = sensorDataByArea[area]?.[selectedSensor];
        if (data) {
          chartDataToDisplay.push({ area, sensor: selectedSensor, data });
        }
      });
    }
  } else if (selectedArea !== "ALL") {
    // Jika area dipilih tapi sensor tidak → tampilkan semua sensor di area tsb
    Object.entries(sensorDataByArea[selectedArea]).forEach(([sensor, data]) => {
      chartDataToDisplay.push({ area: selectedArea, sensor, data });
    });
  } else {
    // Jika tidak pilih area & sensor → tampilkan semua sensor di semua area
    allAreas.forEach((area) => {
      Object.entries(sensorDataByArea[area]).forEach(([sensor, data]) => {
        chartDataToDisplay.push({ area, sensor, data });
      });
    });
  }

     // fungsi untuk pindah ke range sebelumnya
     const handlePrevious = () => {
        if (currentIndex > 0) {
          setSelectedRange(ranges[currentIndex - 1]);
        }
      };
    
      // fungsi untuk pindah ke range selanjutnya
      const handleNext = () => {
        if (currentIndex < ranges.length - 1) {
          setSelectedRange(ranges[currentIndex + 1]);
        }
      };

      return (
        <DashboardLayout>
          {/* FILTER SECTION */}
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
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
                      onClick={() => {
                        setSelectedArea("ALL");
                        setSelectedSensor("");
                        setShowAreaDropdown(false);
                      }}
                    >
                      ALL
                    </div>
                    {allAreas.map((area) => (
                      <div
                        key={area}
                        className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-gray-700 text-sm"
                        onClick={() => {
                          setSelectedArea(area);
                          setSelectedSensor("");
                          setShowAreaDropdown(false);
                        }}
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
                    {selectedSensor || "Pilih Sensor..."}
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
                        onChange={(e) => setSearchSensor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                      />
                    </div>
                    {filteredSensors.length > 0 ? (
                      filteredSensors.map((sensor) => (
                        <div
                          key={sensor}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                          onClick={() => {
                            setSelectedSensor(sensor);
                            setShowSensorDropdown(false);
                          }}
                        >
                          {sensor}
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
      
          {/* MOST RECENT SECTION */}
          <section className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm text-gray-700">Most Recent</span>
              <div className="flex bg-gray-50 rounded-lg p-1 space-x-1 overflow-x-auto scrollbar-hide">
                {ranges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedRange(range)}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                      selectedRange === range
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
      
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex items-center gap-1 font-medium transition ${
                  currentIndex === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === ranges.length - 1}
                className={`flex items-center gap-1 font-medium transition ${
                  currentIndex === ranges.length - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
              >
                Next →
              </button>
            </div>
          </section>
      
          {/* RECENT ALARMS & EVENTS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Alarms */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">Recent Alarms</h2>
                <span className="text-xs text-gray-400">Last updated 2 mins ago</span>
              </div>
              <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
                No alarms available
              </div>
              <button className="mt-4 w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                SHOW ALL
              </button>
            </div>
      
            {/* Recent Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">Recent Events</h2>
                <span className="text-xs text-gray-400">Last updated 5 mins ago</span>
              </div>

              {/* LIST EVENT */}
              <div
                className={`space-y-4 mb-4 ${
                  events.length > 3 ? "max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300" : ""
                }`}
              >
                {visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-start border-b border-gray-100 pb-3 hover:bg-indigo-50/40 rounded-lg transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0">
                        <AlertCircleIcon className="text-indigo-600 w-5 h-5" />
                      </div>
                      <p className="text-sm text-gray-700 leading-snug max-w-sm">
                        {event.message}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500 items-center whitespace-nowrap">
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SHOW ALL BUTTON */}
              <button
                onClick={() => setShowAll(true)}
                className="mt-3 w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                SHOW ALL
              </button>

              {/* MODAL */}
              {showAll && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-fadeIn">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b p-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        All Recent Events
                      </h3>
                      <button
                        onClick={() => setShowAll(false)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex justify-between items-start border-b border-gray-100 py-3 hover:bg-indigo-50/40 rounded-lg transition"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg flex-shrink-0">
                              <AlertCircleIcon className="text-indigo-600 w-5 h-5" />
                            </div>
                            <p className="text-sm text-gray-700 leading-snug">
                              {event.message}
                            </p>
                          </div>
                          <div className="flex gap-2 text-xs text-gray-500 items-center whitespace-nowrap">
                            <Clock size={14} />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Modal Footer */}
                    <div className="border-t p-4 text-right">
                      <button
                        onClick={() => setShowAll(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
      
          {/* STATISTIC CHARTS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[{ label: "X", data: dataX, color: "#3b82f6" },
              { label: "Y", data: dataY, color: "#22c55e" },
              { label: "Z", data: dataZ, color: "#f59e0b" }].map((axis) => (
              <div
                key={axis.label}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-transform hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Sumbu {axis.label}</p>
                    <p className="text-xl font-semibold text-gray-800">0.00</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                      <Settings size={16} />
                    </button>
                    <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                      <Mail size={16} />
                    </button>
                  </div>
                </div>
      
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={axis.data}>
                    <defs>
                      <linearGradient id={`grad-${axis.label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={axis.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={axis.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={axis.color}
                      strokeWidth={2}
                      dot={false}
                      fillOpacity={1}
                      fill={`url(#grad-${axis.label})`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </section>
        </DashboardLayout>
      );
      
      
};

export default AnalysisPage;