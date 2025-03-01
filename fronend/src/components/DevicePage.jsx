import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import Table from "react-bootstrap/Table";
import dayjs from "dayjs";
import axios from "axios";
import { FaThermometerHalf, FaSearch, FaSync } from "react-icons/fa";

const DevicePage = () => {
  const [deviceId, setDeviceId] = useState("");
  const [deviceData, setDeviceData] = useState(null);
  const [inputTemp, setInputTemperature] = useState("");
  const [inputStatus, setInputStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDeviceInformationIdHandler = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://${serverIP}:8000/device/id`, {
        params: { deviceId },
      });
      setDeviceData(res.data);
    } catch (error) {
      console.error("Error fetching device data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentTempHandler = async (ev) => {
    ev.preventDefault();
    try {
      await axios.post("http://localhost:8000/device/update", {
        deviceId,
        currentTemp: inputTemp,
      });
    } catch (error) {
      console.error("Failed to update temperature:", error);
    }
  };

  const setInUseStatus = async (e) => {
    setInputStatus(e.value);
    try {
      await axios.post("http://localhost:8000/device/updateStatus", {
        deviceId,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <section className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Search Device</h2>
        <form onSubmit={getDeviceInformationIdHandler} className="flex items-center gap-4">
          <InputText
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="p-2 rounded-md w-full bg-gray-700 text-white"
            placeholder="Enter Device ID"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-2"
          >
            <FaSearch /> Search
          </button>
        </form>
      </section>

      {deviceData && (
        <section className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Device Information</h2>
          <Table striped bordered hover variant="dark" className="rounded-md overflow-hidden">
            <tbody>
              {Object.entries({
                "Device ID": deviceData.deviceId,
                "Brand": deviceData.brand,
                "Model": deviceData.model,
                "MAC Address": deviceData.macAddress,
                "Power Type": deviceData.powerType,
                "Controller ID": deviceData.controllerID,
                "Longitude": deviceData.location?.long || "N/A",
                "Latitude": deviceData.location?.lat || "N/A",
                "Last Seen": deviceData.lastSeen
                  ? dayjs(deviceData.lastSeen).format("YYYY-MM-DD HH:mm:ss")
                  : "N/A",
                "Temperature": deviceData.currentTemp,
                "In-Use Status": deviceData.inUse ? "Active" : "Inactive",
                "Last Command": deviceData.lastExecCommand,
              }).map(([key, value]) => (
                <tr key={key}>
                  <th className="p-2">{key}</th>
                  <td className="p-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}

      <section className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaThermometerHalf /> Update Device's Temperature
        </h2>
        <form onSubmit={setCurrentTempHandler} className="flex items-center gap-4 mt-4">
          <InputText
            value={inputTemp}
            onChange={(e) => setInputTemperature(e.target.value)}
            className="p-2 rounded-md w-full bg-gray-700 text-white"
            placeholder="Enter New Temperature"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md flex items-center gap-2"
          >
            <FaSync /> Update
          </button>
        </form>
      </section>

      <section className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Set Device Status</h2>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-gray-300">In Use:</span>
          <InputSwitch checked={inputStatus} onChange={setInUseStatus} />
        </div>
      </section>
    </div>
  );
};

export default DevicePage;
