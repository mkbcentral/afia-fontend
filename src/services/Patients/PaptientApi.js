import API from "../API";
export default {
    getPatients(path) {
        return API().get(path)
    },
    createPatient(data,path) {
        return API().post(path, data)
    },
    updatePatient(id, data,path) {
        return API().put(path + id, data)
    },
    deletePatient(id,path) {
        return API().delete(path + id)
    },
}