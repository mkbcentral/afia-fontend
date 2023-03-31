import API from "../APIGEUEST";

export default {
    login(values) {
        return API().post('/login',values)
    },
}