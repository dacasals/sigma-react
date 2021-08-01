import React, { Component } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ServicePathsService } from '../../service/ServicePathsService';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import './TreeTableDemo.css';



export class TreeTableSP extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodes: []
        };
        this.spService = new ServicePathsService();
        this.actionTemplate = this.actionTemplate.bind(this);
        this.urlEditor = this.urlEditor.bind(this);
        this.weightEditor = this.weightEditor.bind(this);
        this.updateService = this.updateService.bind(this);
        this.deleteUrl = this.deleteUrl.bind(this);
        this.addUrl = this.addUrl.bind(this);

    }

    componentDidMount() {
        this.spService.getServicePathsTree().then(data => this.setState({ nodes: data }));
    }

    async updateService(node) {
        console.log(node);
        let data = await this.spService.putServicePathTree(node);
        // let data = await this.spService.getServicePathsTree();
        this.setState({ nodes: data })
    }

    deleteUrl(node) {
        console.log(node);
        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        this.deleteNodeByKey(newNodes, node.key);

        this.setState({
            nodes: newNodes
        });
    }

    addUrl(node) {
        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        let editedNode = this.findNodeByKey(newNodes, node.key);
        let newChild = {"key": editedNode.key+"-0", "data": {"url": "/", "weight": 1}};
        if(editedNode.children.length > 0)
            //Make a deepcopy of last url
            newChild = JSON.parse(JSON.stringify(editedNode.children.slice(-1)[0])); //Array en 0 para el slice
        
            newChild.key = newChild.key+"1";
        editedNode.children.push(newChild);
        console.log(editedNode)

        this.setState({
            nodes: newNodes
        });
    }


    actionTemplate(node, column) {
        if (node.data["type"] === "Service") 
        return <div>
            <Button type="button" label="Save" icon="pi pi-check" onClick={() => this.updateService(node)} className="p-button-info"></Button>
        </div>
        else if (node.data["type"] === "Method") 
        return <div>
            <Button type="button" icon="pi pi-plus" onClick={() => this.addUrl(node)} className="p-button-success"></Button>
        </div>
        else if (node.data["type"] === "URL model") 
            return <div>
            <Button type="button" icon="pi pi-trash" onClick={() => this.deleteUrl(node)} className="p-button-danger"></Button>
        </div>
        else
            return "";
    }

    onEditorValueChange(props, value) {
        let newNodes = JSON.parse(JSON.stringify(this.state.nodes));
        let editedNode = this.findNodeByKey(newNodes, props.node.key);
        editedNode.data[props.field] = value;

        this.setState({
            nodes: newNodes
        });
    }

    findNodeByKey(nodes, key) {
        let path = key.split('-');
        let node;

        while (path.length) {
            let list = node ? node.children : nodes;
            if (path.length == 1) {
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    if (element.key == key){
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
                break;
            }
            node = list[parseInt(path[0], 10)];
            path.shift();
        }
        console.log(nodes);
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

    urlEditor(props) {
        console.log(props)
        return this.inputTextEditor(props, 'url');
    }

    weightEditor(props) {
        console.log(props)
        return this.inputNumberEditor(props, 'weight');
    }

    render() {
        const header = "Service Paths";
        const footer = <div style={{ textAlign: 'left' }}><Button icon="pi pi-refresh" tooltip="Reload" /></div>;

        return (
            <div>
                <div className="card">
                    <TreeTable value={this.state.nodes} header={header} footer={footer}>
                        <Column field="name" header="Name" expander style={{width:'25%'}}></Column>
                        <Column field="url" header="Url Model" editor={this.urlEditor} style={{width:'45%'}}></Column>
                        <Column field="weight" header="Weight"  editor={this.weightEditor} style={{width:'10%'}}></Column>
                        <Column field="type" header="Type" style={{width:'10%'}}></Column>
                        <Column body={this.actionTemplate} style={{width:'10%', textAlign: 'right'}}/>
                    </TreeTable>
                </div>
            </div>
        )
    }
    
}