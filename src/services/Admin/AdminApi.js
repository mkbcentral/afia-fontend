import API from "../API";
export default {
    getData(path) {
        return API().get(path);
    },
    getFirstData(path) {
        return API().get(path);
    },
    create(path, data) {
        return API().post(path, data);
    },
    createItme(path, data) {
        return API().post(path, data);
    },
    update(path, id, data) {
        return API().put(path + id, data);
    },
    updateItem(path, id, data) {
        return API().put(path + id, data);
    },
    delete(path, id) {
        return API().delete(path + id);
    },
    changeStatusString(path, id, status) {
        return API().put(path + id, status)
    },
    changeStatusBoolean(path, id) {
        return API().put(path + id)
    },
    getCurrentData(path) {
        return API().get(path)
    },
    searchData(path,query) {
        return API().get(path, {
            params: {
                query: query
            }
        });
    },
    sendByParams(path,items) {
        return API().get(path, {
            params: {
                items: items
            }
        });
    }
}