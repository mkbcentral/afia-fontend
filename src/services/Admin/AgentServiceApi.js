import API from "../API";
export default {
    getServices() {
        return API().get('/service-agent');
    },
    createService(data) {
        return API().post('/service-agent', data);
    },
    updateService(id, data) {
        return API().put('/service-agent/' + id, data);
    },
    deleteService(id) {
        return API().delete('/service-agent/' + id);
    },
}