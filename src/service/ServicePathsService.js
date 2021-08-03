import axios from 'axios';

export class ServicePathsService {
    
    _buildServiceFromNode(node) {
        let service = {}
        service["name"] = node.data.name;
        service["retrievers"] = [];
        for (let i = 0; i < node.children.length; i++) {
            const nodeI = node.children[i];
            service["retrievers"].push(this._buildRetrieverFromNode(nodeI));
        }
        return service;
    }
    _buildRetrieverFromNode(node) {
        let data = {}
        data["name"] = node.data.name;
        data["methods"] = [];
        for (let i = 0; i < node.children.length; i++) {
            const nodeI = node.children[i];
            data["methods"].push(this._buildMethodFromNode(nodeI));
        }
        return data;
    }

    _buildMethodFromNode(node) {
        let data = {}
        data["name"] = node.data.name;
        data["urls"] = [];
        for (let i = 0; i < node.children.length; i++) {
            const nodeI = node.children[i];
            data["urls"].push(this._buildUrlFromNode(nodeI));
        }
        return data;
    }

    _buildUrlFromNode(node) {
        let data = {}
        data["url"] = node.data.url;
        data["weight"] = node.data.weight;
        return data;
    }

    _buildNodeFromUrlData(prefix_id, url_data){
        return {"key": prefix_id, "data": {"url": url_data["url"], "weight": url_data["weight"], "type": "URL model"}};
    }

    _buildNodeFromMethod(prefix_id, method){
        
        let elementR = {
            "key": prefix_id,
             "data": {
                "name": method["name"],
                "type": "Method"
            },
            "children": []
        };
        
        for (let k = 0; k < method["urls"].length; k++) {
            const url_data = method["urls"][k];
            elementR["children"].push(this._buildNodeFromUrlData(prefix_id+"-"+k.toString(), url_data));
        }
        return elementR;
    }

    _buildNodeFromRetriever(prefix_id, retriever){
        
        let elementR = {
            "key": prefix_id,
             "data": {
                "name": retriever["name"],
                "type": "Retriever"
            },
            "children": []
        };
        
        for (let k = 0; k < retriever["methods"].length; k++) {
            const method = retriever["methods"][k];
            elementR["children"].push(this._buildNodeFromMethod(prefix_id+"-"+k.toString(), method));
        }
        return elementR;
    }

    _buildNodeFromService(prefix_id, service){
        let element = {"key": prefix_id, "data": {"name": service["name"], "type": "Service"}};
        element["children"] = [];
        
        for (let retriverIndex = 0; retriverIndex < service["retrievers"].length; retriverIndex++) {
            const retriever = service["retrievers"][retriverIndex];
            
            element["children"].push(this._buildNodeFromRetriever(prefix_id+"-"+retriverIndex.toString(), retriever));
        }
        return element;
    }

    getServicePathsTree() {
        
        return axios.get('/config/service_path',{"proxy": {
            host: 'localhost',
            port: 8000
          },}).then(res => {
            let spdata = res.data["services"];
            let nodes_data = []
            for (let index = 0; index < spdata.length; index++) {
                let service = spdata[index]
                nodes_data.push(this._buildNodeFromService(index, service));
            }
            return nodes_data; 
        });
    }
    
    putServicePathTree(node) {
        
        return axios.put('/config/service_path', 
        this._buildServiceFromNode(node),
        {"proxy": {
            host: 'localhost',
            port: 8000
          }
        }).then(res => {
            let spdata = res.data["services"];
            let nodes_data = []
            for (let index = 0; index < spdata.length; index++) {
                let service = spdata[index]
                nodes_data.push(this._buildNodeFromService(index, service));
            }
            return nodes_data; 
        }).catch(res => {
            return null
        });
    }
}

