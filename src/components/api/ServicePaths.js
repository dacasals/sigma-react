import React, {} from 'react';
import { TreeTableSP } from './TreeTableSP'; 
export const ServicePaths = () => {

    return (
        <div className="p-grid table-demo">
            <div className="p-col-12">                    
                <div className="card">
                    <h5>Service Paths Tree</h5>
                    <TreeTableSP/>
                </div>
            </div>
        </div>
    )
}
