import React, { useState } from "react";

export function ControllerPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [powerType, setPowerType] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [controllerId, setControllerId] = useState("");
  const [activeTab, setActiveTab] = useState("devices");

  return (
    <div className="container mx-auto p-6">
      <nav className="flex space-x-4 mb-6">
        <button 
          className={`px-4 py-2 rounded ${activeTab === "devices" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
          onClick={() => setActiveTab("devices")}
        >
          Show Devices
        </button>
        <button 
          className={`px-4 py-2 rounded ${activeTab === "register" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
          onClick={() => setActiveTab("register")}
        >
          Register Device
        </button>
      </nav>

      {activeTab === "devices" && (
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Show All Device Info of Controller</h2>
          <label className="block text-gray-700">Controller ID:</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            value={controllerId}
            onChange={(e) => setControllerId(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Display</button>
        </div>
      )}

      {activeTab === "register" && (
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Register Device</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Brand" className="p-2 border rounded" value={brand} onChange={(e) => setBrand(e.target.value)} />
            <input type="text" placeholder="Model" className="p-2 border rounded" value={model} onChange={(e) => setModel(e.target.value)} />
            <input type="text" placeholder="Power Type" className="p-2 border rounded" value={powerType} onChange={(e) => setPowerType(e.target.value)} />
            <input type="text" placeholder="Longitude" className="p-2 border rounded" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            <input type="text" placeholder="Latitude" className="p-2 border rounded" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Register</button>
        </div>
      )}
    </div>
  );
}

export default ControllerPage;
