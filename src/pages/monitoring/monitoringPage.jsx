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
import DashboardLayout from "../../components/Dashboardlayout";

const MonitoringPage = () => {
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

  const [selectedArea, setSelectedArea] = useState("Area: ALL");
  const [selectedSensor, setSelectedSensor] = useState("");
  const [showSensorDropdown, setShowSensorDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [searchSensor, setSearchSensor] = useState("");
  const areaRef = useRef(null);
  const sensorRef = useRef(null);

  const allAreas = Object.keys(sensorDataByArea);
  const sensorsForSelectedArea =
    selectedArea !== "Area: ALL"
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
    if (selectedArea !== "Area: ALL") {
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
  } else if (selectedArea !== "Area: ALL") {
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
                        setSelectedArea("Area: ALL");
                        setSelectedSensor("");
                        setShowAreaDropdown(false);
                      }}
                    >
                      Area: ALL
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

      {/* 📊 Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {chartDataToDisplay.length > 0 ? (
          chartDataToDisplay.map((item, index) => (
            <div
              key={index}
              className="p-5 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.sensor}
                  </h2>
                  <p className="text-sm text-gray-500">{item.area}</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                  Online
                </span>
              </div>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={item.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {item.data[0]?.x !== undefined ? (
                      <>
                        <Line
                          type="monotone"
                          dataKey="x"
                          stroke="#ef4444"
                          name="X"
                        />
                        <Line
                          type="monotone"
                          dataKey="y"
                          stroke="#22c55e"
                          name="Y"
                        />
                        <Line
                          type="monotone"
                          dataKey="z"
                          stroke="#3b82f6"
                          name="Z"
                        />
                      </>
                    ) : (
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4f46e5"
                        name="Value"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500 border border-gray-200">
            Tidak ada data untuk ditampilkan
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MonitoringPage;
