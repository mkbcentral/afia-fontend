import API from "../API";
export default {
    getPatients(path) {
        return API().get(path)
    },
    getPatient(path,id) {
        return API().get(path+id)
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
    searcchPatient(query,path){
        return API().get(path,{
            params:{
                query:query
            }
        });
    }
}