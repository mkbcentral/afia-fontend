import API from "../API";
export default {
    getCommunes() {
        return API().get('/commune');
    },
    createCommune(data) {
        return API().post('/commune', data);
    },
    updateCommune(id, data) {
        return API().put('/commune/' + id, data);
    },
    deleteCommune(id) {
        return API().delete('/commune/' + id);
    }
}