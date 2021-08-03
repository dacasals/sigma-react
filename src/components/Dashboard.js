import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { InputText } from 'primereact/inputtext';
import config from 'react-global-configuration';


const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860'
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e'
        }
    ]
};

export const Dashboard = () => {

    // const [events, setEvents] = useState(null);
    const [endpoint_path, setEnpointPath] = useState(null);

    useEffect(() => {

    }, []);

    const updateApiService = (value) => {
        config.set({ "axios": {"baseURL": endpoint_path }});
    };

    return (
        <div className="p-grid p-fluid dashboard">
            <div className="p-col-12 p-lg-4">
                <div className="card summary">
                    <span className="title">Services</span>
                    <span className="detail">Number of request</span>
                    <span className="count visitors">12</span>
                </div>
            </div>
            <div className="p-col-12 p-lg-4">
            <div className="card">
                <Panel header="Contact Us">
                    <div className="p-fluid">
                        <div className="p-field p-fluid p-col-6">
                            <label htmlFor="endpoint" className="p-sr-only">Personalization API endpoint</label>
                            <InputText id="endpoint" value={endpoint_path} onChange={(e) => setEnpointPath(e.target.value)} type="text" placeholder="https://api-personalization.com" />
                        </div>
                        <div className="p-field p-fluid p-col-6">
                            <Button type="button" label="Save" onClick={updateApiService} icon="pi pi-envelope" />
                        </div>
                    </div>
                </Panel>
            </div>
            </div>
           

             <div className="p-col-12 p-md-6 p-lg-4 p-fluid contact-form">
                <div className="card">
                    <Chart type="line" data={lineData} />
                </div>
            </div>

        </div>
    );
}
