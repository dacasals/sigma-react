import axios from 'axios';

export class LoggingConfigStatusService {

    getServicePathsTree() {
        
        return axios.get('/config/logging_status').then(res => {
            let nodes_data = res.data["services"];
            console.log(nodes_data)
            return nodes_data; 
        });
    }

    putServicePathTree(node) {
        
        return axios.put('/config/logging_status', node)
        .then(res => {
            let nodes_data = res.data["services"];            
            return nodes_data; 
        })
        .catch(res => {return null});
    }
}
