import axios, { AxiosError } from 'axios';

export const controller = new AbortController()

const defaultHeaders = () => ({
    authorization: localStorage.getItem('authorization'),
    'Content-Type': 'application/json'
})

export function CustomAxiosGet(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
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
        params, headers: defaultHeaders()
    }).then(res => {
        // if (res.headers.authorization) {
        //     localStorage.setItem('authorization', res.headers.authorization);
        // }
        // if (callback) callback(res.data);
        if (callback) callback(res.data);
        return res.data
    }).catch((err) => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if (errCallback) errCallback();
        return err
    })
}

export function CustomAxiosGetFile(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void) {
    if (!callback) {
        return axios.get(url, {
            params, headers: defaultHeaders()
        })
    }
    return axios.get(url, {
        params, headers: defaultHeaders(), responseType: 'blob'
    }).then(res => {
        // if (res.headers.authorization) {
        //     localStorage.setItem('authorization', res.headers.authorization);
        // }
        if (callback) callback(res);
        return res
    }).catch((err) => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if (errCallback) errCallback();
        return err
    })
}

export function CustomAxiosPost(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : localStorage.getItem('authorization'),
        ...config.headers
    } : defaultHeaders()

    return axios.post(url, params, { headers }).then(res => {
        // if (callback) callback(res.data.data, res.headers.authorization);
        if (callback) callback(res.data, res.headers.authorization);
        return res.data
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if (errCallback) errCallback();
        return err
    })
}

export function CustomAxiosDelete(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void) {
    return axios.delete(url, {
        params, headers: defaultHeaders()
    }).then(res => {
        if (callback) callback(res.data);
        return res.data
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if (errCallback) errCallback();
        return err
    })
}

export function CustomAxiosPut(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : localStorage.getItem('authorization'),
        ...config.headers
    } : defaultHeaders()
    return axios.put(url, params, { headers }).then(res => {
        if (callback) callback(res.data);
        return res.data
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if (errCallback) errCallback();
        return err
    })
}

export function CustomAxiosPatch(url: string, callback?: Function, params?: any, errCallback?: (err?: AxiosError) => void, config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : localStorage.getItem('authorization'),
        ...config.headers
    } : defaultHeaders()
    return axios.patch(url, params, { headers }).then(res => {
        if (callback) callback(res.data);
        return res.data
    }).catch(err => {
        if (errCallback && err.response && err.response.data) errCallback(err);
        else if (errCallback) errCallback();
        return err
    })
}

export async function CustomAxiosGetAll(url: string[], callback?: Function[], params?: any[], config?: any) {
    const headers = config ? {
        ...defaultHeaders(),
        authorization: config.authorization ? config.authorization : localStorage.getItem('authorization'),
        ...config.headers
    } : defaultHeaders()
    // const getFunc = (_ind: number): any => {
    //     if(url[_ind]) return CustomAxiosGet(url[_ind], undefined, params && params[_ind]).then(async (_: any) => {
    //         if(url[_ind + 1]) return [_.data, await getFunc(_ind + 1)]
    //     })
    // }

    // return getFunc(0)
    axios.all(url.map((_, ind) => axios.get(_, { headers, signal: controller.signal, params: params && params[ind] })))
        .then(axios.spread((...res) => {
            console.log(res)
            res.forEach((_, ind) => {
                if (callback && callback[ind]) callback[ind](_.data)
            })
        }))
}