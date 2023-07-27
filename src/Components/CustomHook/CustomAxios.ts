import axios, { AxiosError } from 'axios';

export function CustomAxiosGet(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any, finalCallback?: any) {
    if (!callback) {
        return axios.get(url, {
            params, headers: {
                authorization: localStorage.getItem('authorization')
            }
        })
    }
    return axios.get(url, {
        params, headers: {
            authorization: localStorage.getItem('authorization'),
        }
    }).then(res => {
        if (res.headers.authorization) {
            localStorage.setItem('authorization', res.headers.authorization);
        }
        // if (callback) callback(res.data.rows);
        if (callback) callback(res.data.data);
    }).catch((err) => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    }).finally(() => {
        if(finalCallback) finalCallback();
    })
}

export function CustomAxiosGetFile(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any, finalCallback?: any) {
    if (!callback) {
        return axios.get(url, {
            params, headers: {
                authorization: localStorage.getItem('authorization')
            }
        })
    }
    return axios.get(url, {
        params, headers: {
            authorization: localStorage.getItem('authorization'),
        }, responseType : 'blob'
    }).then(res => {
        if (res.headers.authorization) {
            localStorage.setItem('authorization', res.headers.authorization);
        }
        if (callback) callback(res);
    }).catch((err) => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    }).finally(() => {
        if(finalCallback) finalCallback();
    })
}

export function CustomAxiosPost(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any, finalCallback?: any) {
    const headers = config ? {
        authorization: config.authorization ? config.authorization : localStorage.getItem('authorization'),
        ...config.headers
    } : {
        authorization: localStorage.getItem('authorization'),
    }

    // const headers = config ? {
    //     ...config.headers
    // } : {
    // }

    return axios.post(url, params, { headers }).then(res => {
        // if (callback) callback(res.data.data, res.headers.authorization);
        if (callback) callback(res.data.data, res.headers.authorization);
    }).catch(err => {
        console.log('err',err)
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    }).finally(() => {
        if(finalCallback) finalCallback();
    })

    // return axios.post(url, params).then(res => {
    //     // if (callback) callback(res.data.rows);
    //     if (callback) callback(res.data.data);
    // }).catch(err => {
    //     if (errCallback && err.response && err.response.data) errCallback(err);
    //     else if(errCallback) errCallback();
    // })
}

export function CustomAxiosDelete(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void) {
    return axios.delete(url, {
        params, headers: {
            authorization: localStorage.getItem('authorization')
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
        authorization: config.authorization ? config.authorization : localStorage.getItem('authorization'),
        ...config.headers
    } : {
        authorization: localStorage.getItem('authorization'),
    }
    return axios.put(url, params, { headers }).then(res => {
        if (callback) callback(res.data.rows);
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    })
}

export function CustomAxiosPatch(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
    const headers = config ? {
        authorization: config.authorization ? config.authorization : localStorage.getItem('authorization'),
        ...config.headers
    } : {
        authorization: localStorage.getItem('authorization'),
    }
    return axios.patch(url, params, { headers }).then(res => {
        if (callback) callback(res.data.rows);
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if(errCallback) errCallback();
    })
}