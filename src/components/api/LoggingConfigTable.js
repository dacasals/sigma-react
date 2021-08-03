import React, { Component } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { LoggingConfigStatusService } from '../../service/LoggingConfigStatusService';
import { InputSwitch } from 'primereact/inputswitch';

export class LoggingConfigTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logging_status: [],
            loading: true,
            
        };
        this.lcsService = new LoggingConfigStatusService();
        this.updateService = this.updateService.bind(this);
        this.rowClassName = this.rowClassName.bind(this);
        this.switch_template = this.switch_template.bind(this);
    }

    componentDidMount() {
        this.lcsService.getServicePathsTree().then(data => this.setState({ logging_status: data, loading: false }));
    }
    reloadPage = () => {
        this.lcsService.getServicePathsTree().then(data => this.setState({ nodes: data }));
    }

    onServiceUpdated = (data) => {
        this.toast.show({ severity: 'success', summary: 'Logging status', detail: data.name, life: 3000 });
    };
    onServiceUpdatedFailed = (data) => {
        this.toast.show({ severity: 'error', summary: 'Logging status', detail: data.error, life: 3000 });
    };


    async updateService(node) {
        let data = await this.lcsService.putServicePathTree(node);
        if (data === null){
            this.onServiceUpdatedFailed({"error": "Service update failed."})
        }
        this.setState({ nodes: data })
        this.onServiceUpdated({"name": "Service updated."});
    }

    onEditorValueChange(props, value) {
        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = value;
        editedNode.data["changed"] = true;
        this.setState({
            nodes: newNodes
        });
    }

    findNodeByKey(nodes, key) {
        let path = key.split('-');
        let node;

        while (path.length) {
            let list = node ? node.children : nodes;
            if (path.length === 1) {
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    if (element.key === key){
                        return element;
                    }
                }
            }
            node = list[parseInt(path[0], 10)];
            path.shift();
        }

        return node;
    }

    deleteNodeByKey(nodes, key) {
        let path = key.split('-');
        let node;

        while (path.length) {
            let list = node ? node.children : nodes;
            if(path.length === 1) {
                list.splice(parseInt(path[0], 10), 1)
                node.data["changed"] = true;
                break;
            }
            node = list[parseInt(path[0], 10)];
            path.shift();
        }
    }


    inputTextEditor(props, field) {
        return props.node.data.url ? <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col">
            <InputText type="text" value={props.node.data[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />
        </div>
    </div>: ''
    }

    inputNumberEditor(props, field) {
        return props.node.data.url ? <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col">
            <InputNumber 
                value={props.node.data[field]}
                onChange={
                    (e) => {
                        return this.onEditorValueChange(props, e.value)
                    }
                }
                mode="decimal" showButtons min={0} max={100}
            />
        </div>
    </div>: ''
    }


    rowClassName(node) {

        
        let resp = {
            'row-modified': node.data["changed"] === true
        }
        return resp;
    }

    switch_template(node) {
        console.log(node)
        return <InputSwitch checked={node.status} onChange={(e) => {
            console.log(e.value);
            node.status = e.value;
            this.updateService(node)
        }
        } />

    }

    render() {
        const footer = <div style={{ textAlign: 'left' }}><Button icon="pi pi-refresh" onClick={this.reloadPage} tooltip="Reload" /></div>;

        return (
            <div>
                <Toast ref={(el) => this.toast = el}></Toast>
                <div className="card">
                    <DataTable 
                        value={this.state.logging_status}
                        footer={footer}
                    >
                        <Column field="name" header="Name"></Column>
                        <Column field="status" header="Status" body={this.switch_template}></Column>
                    </DataTable>
                </div>
            </div>
        )
    }
}