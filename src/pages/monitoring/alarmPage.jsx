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
import {  Clock, AlertCircleIcon, CircleArrowDownIcon, ArrowDownIcon, ArrowDownUpIcon, ArrowUp, Settings, Mail, X, AlertTriangle, Search } from "lucide-react";
import { Switch } from "@headlessui/react";
import DashboardLayout from "../../components/Dashboardlayout";

const AlarmPage = () => {

   
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
    
    const [selectedArea, setSelectedArea] = useState("ALL");
    const [selectedSensor, setSelectedSensor] = useState("");
    const [showSensorDropdown, setShowSensorDropdown] = useState(false);
    const [showAreaDropdown, setShowAreaDropdown] = useState(false);
    const [searchSensor, setSearchSensor] = useState("");
    const areaRef = useRef(null);
    const sensorRef = useRef(null);

    const [enabled, setEnabled] = React.useState(true);

    const allAreas = Object.keys(sensorDataByArea);
    const sensorsForSelectedArea =
    selectedArea !== "ALL"
        ? Object.keys(sensorDataByArea[selectedArea])
        : allAreas.flatMap((area) => Object.keys(sensorDataByArea[area]));

    const filteredSensors = sensorsForSelectedArea.filter((sensor) =>
    sensor.toLowerCase().includes(searchSensor.toLowerCase())
    );

    const chartDataToDisplay = [];

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

       {/* Alarm Setting */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-5">
        <p className="text-lg font-semibold mb-4">Alarm Setting</p>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1 */}
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
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    </div>
                </div>
                {/* Variables List with Divider */}
                <ul className="divide-y divide-gray-200">
                    {[
                    { title: "Vibration X", desc: "vibration BE1" },
                    { title: "Vibration Y", desc: "vibration BE1" },
                    { title: "Vibration Z", desc: "vibration BE1" },
                    ].map((item, idx) => (
                    <li
                        key={idx}
                        className="p-3 hover:bg-blue-50 transition cursor-pointer group"
                    >
                        <p className="font-medium text-gray-800 group-hover:text-blue-600 transition">
                        {item.title}
                        </p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </li>
                    ))}
                </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                    <p className="text-lg font-semibold text-gray-800">Alarm</p>
                    <p className="text-sm text-gray-500">Aktifkan atau nonaktifkan alarm</p>
                    </div>

                    {/* Switch */}
                    <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={`${
                        enabled ? "bg-blue-600" : "bg-gray-300"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                    <span
                        className={`${
                        enabled ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                    </Switch>
                </div>

                {/* Variable Info */}
                <div className="mb-5">
                    <p className="font-medium text-gray-800">Vibration X</p>
                    <p className="text-sm text-gray-500">vibration BE1</p>
                </div>

                {/* Alarm Form */}
                <div className="space-y-4">
                    {/* Alarm Low Value */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alarm Low Value
                    </label>
                    <input
                        type="number"
                        placeholder="Masukkan nilai batas bawah"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    {/* Alarm Low Text */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alarm Low Text
                    </label>
                    <input
                        type="text"
                        placeholder="Deskripsi alarm low"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    {/* Alarm High Value */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alarm High Value
                    </label>
                    <input
                        type="number"
                        placeholder="Masukkan nilai batas atas"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    {/* Alarm High Text */}
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alarm High Text
                    </label>
                    <input
                        type="text"
                        placeholder="Deskripsi alarm high"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                    <button
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition"
                    >
                    Save
                    </button>
                </div>
            </div>
        </div>
        </section>



        </DashboardLayout>
    );
};

export default AlarmPage;