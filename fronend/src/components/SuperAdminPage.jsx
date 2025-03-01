import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';


const SuperAdminPage = () => {
    const [controllerName, setControllerName] = useState('');
    const [serviceProvider, setServiceProvider] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [devices, setDevices] = useState([]);
    const [controllers, setControllers] = useState([]);
    const [contDropdown, setContDropdown] = useState([]);

    useEffect(() => {
        fetchDevicesAndControllers();
    }, []);

    const fetchDevicesAndControllers = async () => {
        try {
            const deviceRes = await axios.get(`http://${serverIP}:8000/device/all`);
            setDevices(deviceRes.data.map(record => record.Record));

            const controllerRes = await axios.get(`http://${serverIP}:8000/controller/all`);
            setControllers(controllerRes.data.map(record => record.Record.controllerID));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const registerControllerHandler = async (ev) => {
        ev.preventDefault();
        try {
            await axios.post(`http://${serverIP}:8000/controller/register`, {
                controllerName,
                serviceProvider,
                location: { long: longitude, lat: latitude }
            });
            setControllerName('');
            setServiceProvider('');
            setLongitude('');
            setLatitude('');
            fetchDevicesAndControllers();
        } catch (error) {
            console.error("Error registering controller:", error);
        }
    };

    const handleControllerAssignment = async (ev, contId, devId, index, isChange) => {
        ev.preventDefault();
        try {
            const url = `http://${serverIP}:8000/controller/${isChange ? 'change' : 'assign'}`;
            await axios.post(url, {
                deviceID: devId,
                [isChange ? 'newControllerID' : 'controllerID']: contId
            });
            fetchDevicesAndControllers();
        } catch (error) {
            console.error("Error assigning controller:", error);
        }
    };

    return (
        <div className="p-4">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Register Controller">
                    <Card title="Register a New Controller">
                        <form onSubmit={registerControllerHandler} className="p-fluid">
                            <div className="p-field">
                                <label>Controller Name:</label>
                                <InputText value={controllerName} onChange={(e) => setControllerName(e.target.value)} />
                            </div>
                            <div className="p-field">
                                <label>Service Provider:</label>
                                <InputText value={serviceProvider} onChange={(e) => setServiceProvider(e.target.value)} />
                            </div>
                            <div className="p-field">
                                <label>Longitude:</label>
                                <InputText value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                            </div>
                            <div className="p-field">
                                <label>Latitude:</label>
                                <InputText value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                            </div>
                            <Button type="submit" label="Register" className="p-button-success" />
                        </form>
                    </Card>
                </TabPanel>
                <TabPanel header="Assign/Change Controller">
                    <Card title="Manage Device Controllers">
                        <DataTable value={devices} paginator rows={5} responsiveLayout="scroll">
                            <Column field="deviceID" header="Device ID" />
                            <Column field="controllerID" header="Controller ID" body={(rowData) => rowData.controllerID || 'Not Assigned'} />
                            <Column header="Action" body={(rowData, { rowIndex }) => (
                                <Dropdown
                                    value={contDropdown[rowIndex]}
                                    options={controllers.map(id => ({ label: id, value: id }))}
                                    onChange={(e) => handleControllerAssignment(e, e.value, rowData.deviceID, rowIndex, !!rowData.controllerID)}
                                    placeholder="Select a Controller"
                                />
                            )} />
                        </DataTable>
                    </Card>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default SuperAdminPage;
