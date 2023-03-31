import API from "../API";
export default {
    getCompanies() {
        return API().get('/company');
    },
    createCompany(data) {
        return API().post('/company', data);
    },
    updateCompany(id, data) {
        return API().put('/company/' + id, data);
    },
    deleteCompany(id) {
        return API().delete('/company/' + id);
    },
    changeStatus(id, status) {
        return API().put('/company/status/' + id,status)
    }
}