import ApiData from "@/services/Admin/AdminApi";
import { useRouter } from 'vue-router';
const router = useRouter()

export const postData = async (url, data) => {
    try {
        const response = await ApiData.create(url, data);
        return response;
    } catch (error) {
        let message = { error: '' };
        let errors={errors:{}}
        if (error.response.status == 404) {
            message.error = 'URL REQUEST INVALID';
            return message;
        } else if (error.response.status == 401) {
            message.error = error.response.statusText;
            router.push('/login');
            return message;
        } else if(error.response.status == 422){
            errors.errors=error.response.data.errors
            return errors
        }else if (error.code) {
            message.error = 'ERRR: ACTION FAILD';
            return message;
        }
    }
}

export const updateData = async (url,id, data) => {
    try {
        const response = await ApiData.update(url,id, data);
        return response;
    } catch (error) {
        let message = { error: '' };
        let errors={errors:{}}
        if (error.response.status == 404) {
            message.error = 'URL REQUEST INVALID';
            return message;
        } else if (error.response.status == 401) {
            message.error = error.response.statusText;
            router.push('/login');
            return message;
        } else if(error.response.status == 422){
            errors.errors=error.response.data.errors
            return errors
        }else if (error.code) {
            message.error = 'ERRR: ACTION FAILD';
            return message;
        }
    }
}

export const postDataParams = async (url, data) => {
    try {
        const response = await ApiData.sendByParams(url, data);
        return response;
    } catch (error) {
        let message = { error: '' };
        if (error.response.status == 404) {
            message.error = 'URL REQUEST INVALID';
            return message;
        } else if (error.response.status == 401) {
            message.error = error.response.statusText;
            router.push('/login');
            return message;
        } else if (error.code) {
            message.error = 'ERRR: ACTION FAILD';
            return message;
        }
    }
}

export const getData = async (url) => {
    try {
        const response = await ApiData.getData(url);
        return response;
    } catch (error) {
        let message = { error: '' };
        if (error.response.status == 404) {
            message.error = 'URL REQUEST INVALID';
            return message;
        } else if (error.response.status == 401) {
            message.error = error.response.statusText;
            router.push('/login');
            return message;
        } else if (error.code) {
            message.error = 'ERRR: ACTION FAILD';
            return message;
        }
    }
}

