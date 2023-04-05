import API from "../API";
export default {
    getCurrencies() {
        return API().get('/currency');
    },
    createCurrency(data) {
        return API().post('/currency', data);
    },
    updateCurrency(id, data) {
        return API().put('/currency/' + id, data);
    },
    deleteCurrency(id) {
        return API().delete('/currency/' + id);
    }
}