import axios, { AxiosError } from 'axios';
import { getStorageAuth } from 'Functions/GlobalFunctions';

export const controller = new AbortController()

const defaultDomain = ''

const defaultHeaders = () => ({
    authorization: getStorageAuth(),
    'Content-Type': 'application/json'
})

// const cancelToken = axios.CancelToken.source()

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
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    const result = axios.get(defaultDomain + url, {
        paramsSerializer: {
            indexes: null
        }, params, headers,
        // cancelToken: cancelToken.token
    }).then(res => {
        if (callback) callback(res.data);
        return res.data
    })
    // cancelToken.cancel()
    return result
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
    console.log(config)
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    console.log(headers)
    return axios.post(defaultDomain + url, params, { headers }).then(res => {
        // if (callback) callback(res.data.data, res.headers.authorization);
        if (callback) callback(res.data, res.headers.authorization);
        return res.data
    })
}

export function CustomAxiosDelete(url: string, callback?: Function, params?: any, config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    return axios.delete(defaultDomain + url, {
        params, headers
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
    return axios.put(defaultDomain + url, params, { headers }).then(res => {
        if (callback) callback(res.data);
        return res.data
    })
}

export function CustomAxiosPatch(url: string, callback?: Function, params?: any, config?: any) {
    console.log(config)
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : getStorageAuth(),
        ...config.headers
    } : defaultHeaders()
    console.log(headers)
    return axios.patch(defaultDomain + url, params, { headers }).then(res => {
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
    axios.all(url.map((_, ind) => axios.get(defaultDomain + _, { headers, signal: controller.signal, params: params && params[ind] })))
        .then(axios.spread((...res) => {
            res.forEach((_, ind) => {
                if (callback && callback[ind]) callback[ind](_.data)
            })
        }))
}