import axios from "axios";
import { useLayoutEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { message } from 'antd';
import { ReduxStateType } from 'Types/ReduxStateTypes';

let oldInterceptorId = 0;
let alertId = 0

const AxiosController = () => {
    const { formatMessage } = useIntl();
    // const history = useHistory()
    const { lang } = useSelector((state: ReduxStateType) => ({
      lang: state.lang!,
    }));

    useLayoutEffect(() => {
        axios.interceptors.request.use(req => {
            // CustomConsoleLog(req);
            return req;
        }, err => {
            // CustomConsoleLog(err);
        })
        axios.interceptors.response.eject(oldInterceptorId)
        oldInterceptorId = axios.interceptors.response.use(res => {
            return res;
        }, (err) => {
            if(err && err.response && err.response.data) {
              const { code } = err.response.data;
              console.log(code)
              message.error(formatMessage({ id: code}));
            }
            return Promise.reject(err);
        })
    }, [lang])
    return <></>
}

export default AxiosController;