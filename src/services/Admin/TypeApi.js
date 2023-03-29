import API from "../API";
export default {
    getTypes() {
        return API().get('/patient-type');
    },
    createType(data) {
        return API().post('/patient-type', data);
    },
    updateType(id, data) {
        return API().put('/patient-type/' + id, data);
    },
    deleteType(id) {
        return API().delete('/patient-type/' + id);
    }
}