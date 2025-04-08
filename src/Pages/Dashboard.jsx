import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import "leaflet/dist/leaflet.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [option, setOption] = useState("option1");

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const response = await fetch("api domain here");
        if(!response.ok){
          throw new Error (`HTTP error!Status:${response.status}`);
        }
          const result = await response.json();
          if (result.lat&&result.lng){
            setLocation({lat:result.lat,lng
              :result.lng});
          }
          setData(result.data||[]);
        }
        catch(error){
          console.error("Error fetching data:",
          error);
        }
      };
      fetchData()
  },[]);
    

  const filteredData = data.filter(
    (sensor) =>
      (search === "" || sensor.title.toLowerCase().includes(search.toLowerCase())) &&
      (status === "all" || sensor.status === status)
  );

  return (
    <div className="dashboard-container min-h-screen p-6 bg-gray-700">
      {/* Controls */}
      <div className="controls flex flex-wrap justify-between items-center text-white bg-gray-800 shadow-md rounded-lg p-4 mb-4">
        <input
          type="text"
          placeholder="Search sensors..."
          className="p-2 border rounded w-1/4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="p-2 border rounded w-1/6 bg-gray-800 text-white" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <select className="p-2 border rounded w-1/6 bg-gray-800 text-white" value={option} onChange={(e) => setOption(e.target.value)}>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
          <option value="option4">Option 4</option>
        </select>
        <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Add Sensor</button>
      </div>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Board */}
        <div className="data-board bg-gray-800 shadow-md rounded-lg p-4 text-white">
          <h2 className="text-lg font-bold mb-2 ">Sensor Data</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className=" text-white">
                <th className="border p-2">Title</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">X</th>
                <th className="border p-2">Y</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((sensor, index) => (
                  <tr key={index} className="border hover:bg-gray-100">
                    <td className="border p-2">{sensor.title}</td>
                    <td className="border p-2">{sensor.unit}</td>
                    <td className="border p-2">{sensor.x}</td>
                    <td className="border p-2">{sensor.y}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Map Section */}
        <div className="map-container bg-gray-800 shadow-md rounded-lg p-4 text-white">
          <h2 className="text-lg font-bold mb-2 ">Sensor Locations</h2>
          {location.lat !== 0 && location.lng !== 0 ? (
            <MapContainer center={[location.lat, location.lng]} zoom={13} className="h-[300px] w-full rounded-md">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredData.map((sensor, index) => (
                <Marker key={index} position={[sensor.lat, sensor.lng]}>
                  <Popup>{sensor.title}</Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="text-center text-white">Loading map...</div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      {/* <div className="chart-container bg-white shadow-md rounded-lg p-4 mt-6">
        <h2 className="text-lg font-bold mb-2 text-gray-700">Sensor Data Trends</h2>
        <LineChart width={600} height={300} data={filteredData}>
          <XAxis dataKey="x" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#8884d8" />
        </LineChart>
      </div> */}
    </div>
  );
};

export default Dashboard;
