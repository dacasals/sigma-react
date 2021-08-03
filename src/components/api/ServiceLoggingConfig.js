import React, {} from 'react';
import { LoggingConfigTable } from './LoggingConfigTable';

export const ServiceLoggingConfig = () => {

    return (
        <div className="p-grid table-demo">
            <div className="p-col-12">                    
                <div className="card">
                    <h5>Configure logging status</h5>
                    <LoggingConfigTable/>
                </div>
            </div>
        </div>
    )
}
