import axios, { AxiosError } from 'axios';
import { getStorageAuth } from 'Functions/GlobalFunctions';

export const controller = new AbortController()

const defaultDomain = ''

const defaultConfig = (config?: any) => ({
    ...(config || {}),
    headers: {
        'Content-Type': 'application/json',
        authorization: config?.authorization ? config.authorization : getStorageAuth(),
        ...config?.headers
    }
})

// const cancelToken = axios.CancelToken.source()

export function CustomAxiosGet(url: string, callback?: Function, params?: any, config?: any) {
    let _config = {
        params, ...defaultConfig(config)
    }
    if (config) {
        if (!callback) {
            return axios.get(url, _config)
        }
    }
    const result = axios.get(defaultDomain + url, {
        ..._config,
        paramsSerializer: {
            indexes: null
        }, params,
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
            params, headers: defaultConfig()
        })
    }
    return axios.get(url, {
        params, headers: defaultConfig(), responseType: 'blob'
    }).then(res => {
        if (callback) callback(res);
        return res
    })
}

export function CustomAxiosPost(url: string, callback?: Function, params?: any, config?: any) {
    return axios.post(defaultDomain + url, params, { ...defaultConfig(config) }).then(res => {
        // if (callback) callback(res.data.data, res.headers.authorization);
        if (callback) callback(res.data, res.headers.authorization);
        return res.data
    })
}

export function CustomAxiosDelete(url: string, callback?: Function, params?: any, config?: any) {
    return axios.delete(defaultDomain + url, {
        params, ...defaultConfig(config)
    }).then(res => {
        if (callback) callback(res.data);
        return res.data
    })
}

export function CustomAxiosPut(url: string, callback?: Function, params?: any, config?: any) {
    return axios.put(defaultDomain + url, params, { ...defaultConfig(config) }).then(res => {
        if (callback) callback(res.data);
        return res.data
    })
}

export function CustomAxiosPatch(url: string, callback?: Function, params?: any, config?: any) {
    console.log(config)
    return axios.patch(defaultDomain + url, params, { ...defaultConfig(config) }).then(res => {
        if (callback) callback(res.data, res.headers.authorization);
        return res.data
    })
}

export async function CustomAxiosGetAll(url: string[], callback?: Function[], params?: any[], config?: any) {
    axios.all(url.map((_, ind) => axios.get(defaultDomain + _, { ...defaultConfig(config), signal: controller.signal, params: params && params[ind] })))
        .then(axios.spread((...res) => {
            res.forEach((_, ind) => {
                if (callback && callback[ind]) callback[ind](_.data)
            })
        }))
}