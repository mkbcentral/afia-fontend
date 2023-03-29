import API from "../API";
export default{
    getHospials(){
        return API().get('/hospital')
    },
    creteHospital(data){
        return API().post('/hospital',data);
    },
    updateHopital(id,data){
        return API().put('/hospital/'+id,data)
    },
    deleHospital(id){
        return API().delete('/hospital/'+id);
    },
    changeStutus(id,status){
        return API().put('/hospital/status/'+id,status);
    }
}