import API from "../API";
export default {
    getSubscriptions() {
        return API().get('/subscription');
    },
    createSubscription(data) {
        return API().post('/subscription', data);
    },
    updateSubscription(id, data) {
        return API().put('/subscription/' + id, data);
    },
    deleteSubscription(id) {
        return API().delete('/subscription/' + id);
    },
    changeStatus(id, status) {
        return API().put('/subscription/status/' + id,status)
    }
}