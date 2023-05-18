import axios, { AxiosError } from 'axios';

export function CustomAxiosGet(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
    if (!callback) {
        return axios.get(url, {
            params, headers: {
                authorization: localStorage.getItem('Authorization')
            }
        })
    }
    return axios.get(url, {
        params, headers: {
            authorization: localStorage.getItem('Authorization'),
        }
    }).then(res => {
        if (res.headers.authorization) {
            localStorage.setItem('Authorization', res.headers.authorization);
        }
        // if (callback) callback(res.data.rows);
        if (callback) callback(res.data.data);
    }).catch((err) => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    })
}

export function CustomAxiosPost(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
    // const headers = config ? {
    //     authorization: config.authorization ? config.authorization : localStorage.getItem('Authorization'),
    //     ...config.headers
    // } : {
    //     authorization: localStorage.getItem('Authorization'),
    // }

    // return axios.post(url, params, { headers }).then(res => {
    //     if (callback) callback(res.data.rows, res.headers.authorization);
    // }).catch(err => {
    //     if (errCallback && err.response && err.response.data) errCallback(err);
    //     else if(errCallback) errCallback();
    // })

    return axios.post(url, params).then(res => {
        // if (callback) callback(res.data.rows);
        if (callback) callback(res.data.data);
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    })
}

export function CustomAxiosDelete(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void) {
    return axios.delete(url, {
        params, headers: {
            authorization: localStorage.getItem('Authorization')
        }
    }).then(res => {
        if (callback) callback(res.data.rows);
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    })
}

export function CustomAxiosPut(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
    const headers = config ? {
        authorization: config.authorization ? config.authorization : localStorage.getItem('Authorization'),
        ...config.headers
    } : {
        authorization: localStorage.getItem('Authorization'),
    }
    return axios.put(url, params, { headers }).then(res => {
        if (callback) callback(res.data.rows);
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    })
}