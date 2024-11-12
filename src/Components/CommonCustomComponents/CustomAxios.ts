import axios, { AxiosError } from 'axios';
import { getStorageAuth } from 'Functions/GlobalFunctions';

export const controller = new AbortController()

const defaultHeaders = () => ({
    authorization: getStorageAuth(),
    'Content-Type': 'application/json'
})

export function CustomAxiosGet(url: string, callback?: Function, params?: any, config?: any) {
    let _config = {
        params, headers: defaultHeaders()
    }
    if (config) {
        _config = {
            ..._config,
            ...config
        }
    }
    if (!callback) {
        return axios.get(url, _config)
    }
    return axios.get(url, {
        paramsSerializer: {
            indexes: null
        },
        params, headers: defaultHeaders()
    }).then(res => {
        if (callback) callback(res.data);
        return res.data
    })
}

export function CustomAxiosGetFile(url: string, callback?: Function, params?: any) {
    if (!callback) {
        return axios.get(url, {
            params, headers: defaultHeaders()
        })
    }
    return axios.get(url, {
        params, headers: defaultHeaders(), responseType: 'blob'
    }).then(res => {
        if (callback) callback(res);
        return res
    })
}

export function CustomAxiosPost(url: string, callback?: Function, params?: any, config?: any) {

    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    return axios.post(url, params, { headers }).then(res => {
        // if (callback) callback(res.data.data, res.headers.authorization);
        if (callback) callback(res.data, res.headers.authorization);
        return res.data
    })
}

export function CustomAxiosDelete(url: string, callback?: Function, params?: any) {
    return axios.delete(url, {
        params, headers: defaultHeaders()
    }).then(res => {
        if (callback) callback(res.data);
        return res.data
    })
}

export function CustomAxiosPut(url: string, callback?: Function, params?: any, config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    return axios.put(url, params, { headers }).then(res => {
        if (callback) callback(res.data);
        return res.data
    })
}

export function CustomAxiosPatch(url: string, callback?: Function, params?: any, config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    return axios.patch(url, params, { headers }).then(res => {
        if (callback) callback(res.data, res.headers.authorization);
        return res.data
    })
}

export async function CustomAxiosGetAll(url: string[], callback?: Function[], params?: any[], config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    axios.all(url.map((_, ind) => axios.get(_, { headers, signal: controller.signal, params: params && params[ind] })))
        .then(axios.spread((...res) => {
            res.forEach((_, ind) => {
                if (callback && callback[ind]) callback[ind](_.data)
            })
        }))
}