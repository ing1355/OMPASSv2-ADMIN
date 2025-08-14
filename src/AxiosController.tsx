import axios from "axios";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { message as _message } from 'antd';
import { userInfoClear } from "Redux/actions/userChange";
import { controller } from "Components/CommonCustomComponents/CustomAxios";
import { getStorageAuth } from "Functions/GlobalFunctions";
import { useNavigate } from "react-router";
import { PasswordlessLoginApi } from "Constants/ApiRoute";

let oldInterceptorId = 0;

const AxiosController = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userInfo = useSelector((state: ReduxStateType) => state.userInfo)
  const lang = useSelector((state: ReduxStateType) => state.lang!);
  const userInfoRef = useRef(userInfo)

  useEffect(() => {
    userInfoRef.current = userInfo
  }, [userInfo])

  useLayoutEffect(() => {
    axios.interceptors.response.eject(oldInterceptorId)
    oldInterceptorId = axios.interceptors.response.use(res => {
      return res;
    }, (err) => {
      console.log(err)
      if (err && err.response && err.response) {
        const { data } = err.response
        if (data && data.code === 'ERR_B009') {
          console.log('why session expired ?', getStorageAuth(), err.config.headers)
          dispatch(userInfoClear());
          if(!userInfoRef.current) {
            _message.error(formatMessage({ id: 'ERR_B009' }))
          }
        } else if (data) {
          const { code, message, value } = err.response.data;
          console.log(code, message)
          if (code) {
            if(err.response.config.url === PasswordlessLoginApi) {
              return Promise.reject(err)
            }
            if (code.startsWith("ERR_C")) {
              _message.error(formatMessage({ id: `${code} - ${message}` }, { value }))
            } else if (code === 'ERR_B051') {
              window.alert(formatMessage({ id: code }, { value }))
              // window.location.href = `https://test.ompasscloud.com/${lang === 'KR' ? 'ko' : 'en'}/adminLogin/`;
            } else if (code === 'ERR_B052') {
              window.alert(formatMessage({ id: code }, { value }))
              navigate('/', {
                replace: true
              })
              // window.location.href = `https://test.ompasscloud.com/${lang === 'KR' ? 'ko' : 'en'}/adminLogin/`;
            } else {
              _message.error(formatMessage({ id: code }, { value }))
            }
          } else {
            _message.error(formatMessage({ id: 'SERVER_CONNECTION_ERROR' }))
          }
          controller.abort()
        }
      } else {
        _message.error(formatMessage({ id: 'SERVER_CONNECTION_ERROR' }))
      }
      return Promise.reject(err);
    })
  }, [lang])
  return <></>
}

export default AxiosController;