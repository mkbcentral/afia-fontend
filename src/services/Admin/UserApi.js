import API from "../API";

export default {
    getUsers(page) {
        return API().get('/user?page='+page);
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
    },
    searchUser(query){
        return API().get('users/search/',{
            params:{
                query:query
            }
        });
    }
}