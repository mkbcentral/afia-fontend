import axios from "axios";
export default (url = 'http://127.0.0.1:8000/api/v1') => {
    return axios.create({
        baseURL: url, headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
}