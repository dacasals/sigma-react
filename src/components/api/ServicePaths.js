import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TreeTableSP } from './TreeTableSP'; 
export const ServicePaths = () => {

    const [expandedRows, setExpandedRows] = useState([]);
    const toast = useRef(null);



    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    };

    const onRowCollapse = (event) => {
        toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };
    
    const bodyTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data[props.field]}
            </>
        );
    };

    
    const rowExpansionMethodsTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>URLs for {data.name}</h5>
                <DataTable value={data.urls} onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                    rowExpansionTemplate={rowExpansionTemplate}>
                    <Column field="url" header="URL" sortable body={bodyTemplate}></Column>
                    <Column field="weight" header="Weight" sortable ></Column>
                </DataTable>
            </div>
        );
    };

    const rowExpansionRetrieversTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Methods for {data.name}</h5>
                <DataTable value={data.methods} expandedRows={expandedRows} className="p-datatable-customers" dataKey="name" onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                        rowExpansionTemplate={rowExpansionMethodsTemplate}>
                        <Column expander headerStyle={{ width: '3rem' }} />
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };
    const rowExpansionTemplate = (data) => {
        return (
            <div className="orders-subtable">
                <h5>Retrievers for {data.name}</h5>
                <DataTable value={data.retrievers} expandedRows={expandedRows} className="p-datatable-customers" dataKey="name" onRowToggle={(e) => setExpandedRows(e.data)} onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
                        rowExpansionTemplate={rowExpansionRetrieversTemplate}>
                        <Column expander headerStyle={{ width: '3rem' }} />
                        <Column field="name" header="Name" sortable body={bodyTemplate}></Column>
                </DataTable>
            </div>
        );
    };
    return (
        <div className="p-grid table-demo">
            <div className="p-col-12">                    
                <div className="card">
                    <h5>Service Paths Tree</h5>
                    <TreeTableSP></TreeTableSP>
                </div>
            </div>
        </div>
    )
}
