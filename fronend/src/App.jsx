import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import HomePage from "./components/HomePage";
import ControllerPage from "./components/ControllerPage";
import SuperAdminPage from "./components/SuperAdminPage";
import DevicePage from "./components/DevicePage";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const serverIP = "127.0.0.1";
const defaultURL = `http://${serverIP}:8000`;

const Home = () => (
  <div className="content">
    <h1>EV Charging Station Management</h1>
    <p>Welcome to the blockchain-secure EV charging management system.</p>
    <HomePage />
  </div>
);

const Controllers = () => {
  const [controllers, setControllers] = useState([]);

  useEffect(() => {
    axios
      .get(`${defaultURL}/controller/list`)
      .then((res) => setControllers(res.data))
      .catch((err) => console.error("Error fetching controllers", err));
  }, []);

  return (
    <div className="content">
      <h2>Controller List</h2>
      <ul>
        {controllers.map((controller) => (
          <li key={controller.id}>{controller.name}</li>
        ))}
      </ul>
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  return (
    <div className="navbar">
      <Menubar
        start={<h3 className="brand-title">EV Charging</h3>}
        end={
          <div className="button-group">
            <Button label="Home" icon="pi pi-home" className={`nav-btn ${activePage === "/" ? "active" : ""}`} onClick={() => navigate("/")} />
            <Button label="Controllers" icon="pi pi-server" className={`nav-btn ${activePage === "/controllers" ? "active" : ""}`} onClick={() => navigate("/controllers")} />
            <Button label="Devices" icon="pi pi-tablet" className={`nav-btn ${activePage === "/devices" ? "active" : ""}`} onClick={() => navigate("/devices")} />
            <Button label="Controller Page" icon="pi pi-desktop" className={`nav-btn ${activePage === "/controller-page" ? "active" : ""}`} onClick={() => navigate("/controller-page")} />
            <Button label="Super Admin" icon="pi pi-user" className={`nav-btn ${activePage === "/superadmin" ? "active" : ""}`} onClick={() => navigate("/superadmin")} />
          </div>
        }
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/controllers" element={<Controllers />} />
          <Route path="/devices" element={<DevicePage />} />
          <Route path="/controller-page" element={<ControllerPage />} />
          <Route path="/superadmin" element={<SuperAdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;