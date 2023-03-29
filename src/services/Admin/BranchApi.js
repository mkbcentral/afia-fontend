import API from "../API";

export default {
    getBranches() {
        return API().get('/branch')
    },
    createBranch(data) {
        return API().post('/branch', data)
    },
    updateBranch(id, data) {
        return API().put('/branch/' + id, data)
    },
    deleteBranch(id) {
        return API().delete('/branch/' + id)
    },
    changeStatus(id, status) {
        return API().put('/branch/status/' + id,status)
    }
}