import API from "../API";
export default {
    getRoles() {
        return API().get('/role');
    },
    createRole(data) {
        return API().post('/role', data);
    },
    updateRole(id, data) {
        return API().put('/role/' + id, data);
    },
    deleteRole(id) {
        return API().delete('/role/' + id);
    },
    changeStatus(id, status) {
        return API().put('/role/status/' + id, status)
    }
}