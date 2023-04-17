import API from "../API";
export default {
    getRates() {
        return API().get('/rate');
    },
    createRate(data) {
        return API().post('/rate', data);
    },
    updateRate(id, data) {
        return API().put('/rate/' + id, data);
    },
    deletetRate(id) {
        return API().delete('/rate/' + id);
    },
    changeStatus(id) {
        return API().put('/rate/status/' + id)
    },
    getCurrentRate() {
        return API().put('/rate/current/')
    }
}