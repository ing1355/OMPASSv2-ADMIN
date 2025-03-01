import axios from "axios";
import { useLayoutEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { message as _message } from 'antd';
import { userInfoClear } from "Redux/actions/userChange";
import { controller } from "Components/CommonCustomComponents/CustomAxios";
import { getStorageAuth } from "Functions/GlobalFunctions";

let oldInterceptorId = 0;

const AxiosController = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const lang = useSelector((state: ReduxStateType) => state.lang!);

  useLayoutEffect(() => {
    axios.interceptors.response.eject(oldInterceptorId)
    oldInterceptorId = axios.interceptors.response.use(res => {
      return res;
    }, (err) => {
      console.log(err)
      if (err && err.response && err.response) {
        const { data } = err.response
        if(data && data.code === 'ERR_B009') {
          console.log('why session expired ?', getStorageAuth(), err.config.headers)
          dispatch(userInfoClear());
          // navigate('/', {
          //   replace: true
          // });
          if(data) {
            const { code } = err.response.data;
            // _message.error(formatMessage({id: code}))
          }
        } else {
          if(data) {
            const { code, message } = err.response.data;
            if(code.startsWith("ERR_C")) {
              _message.error(formatMessage({id: `${code} - ${message}`}))
            } else {
              _message.error(formatMessage({id: code}))
            }
            controller.abort()
          }
        }
      } else {

      }
      return Promise.reject(err);
    })
  }, [lang])
  return <></>
}

export default AxiosController;