import API from "../API";

export default {
    getUsers() {
        return API().get('/user');
    },
    createUser(data) {
        return API().post('/user', data);
    },
    updateUser(id, data) {
        return API().put('/user/' + id, data);
    },
    deleteUser(id) {
        return API().delete('/user/' + id);
    },
    changeStatus(id, status) {
        return API().put('/user/status/' + id, status)
    }
}