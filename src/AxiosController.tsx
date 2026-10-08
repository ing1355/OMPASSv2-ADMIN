import axios from "axios";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { message as _message } from 'antd';
import { userInfoClear } from "Redux/actions/userChange";
import { controller } from "Functions/CustomAxios";
import { getStorageAuth } from "Functions/GlobalFunctions";
import { useNavigate } from "react-router";
import { PasswordlessLoginApi } from "Constants/ApiRoute";

let oldInterceptorId = 0;

const formatLogBytes = (value: string) => {
  const bytes = Number(value)
  if (!Number.isFinite(bytes) || bytes < 0) return value
  if (bytes < 1024) return `${Math.round(bytes)} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let size = bytes / 1024
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }
  const rounded = size >= 10 ? size.toFixed(0) : size.toFixed(1)
  return `${rounded} ${units[unitIndex]}`
}

const AxiosController = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userInfo = useSelector((state: ReduxStateType) => state.userInfo)
  const lang = useSelector((state: ReduxStateType) => state.lang!);
  const userInfoRef = useRef(userInfo)

  const checkSessionExpired = () => {
    const sessionExpired = sessionStorage.getItem('sessionExpired')
    if (sessionExpired === 'true') {
      sessionStorage.removeItem('sessionExpired')
      _message.error(formatMessage({ id: 'SESSION_EXPIRED_MSG' }))
    } else if (sessionStorage.getItem('logout') === 'true') {
      sessionStorage.removeItem('logout')
      _message.error(formatMessage({ id: 'ERR_B066' }))
    }
  }

  useEffect(() => {
    checkSessionExpired()
  }, [])

  useEffect(() => {
    userInfoRef.current = userInfo
  }, [userInfo])

  useLayoutEffect(() => {
    axios.interceptors.response.eject(oldInterceptorId)
    oldInterceptorId = axios.interceptors.response.use(res => {
      return res;
    }, async (err) => {
      console.log(err)
      if (err && err.response && err.response) {
        if (typeof Blob !== 'undefined' && err.response.data instanceof Blob) {
          try {
            const text = await err.response.data.text()
            err.response.data = text ? JSON.parse(text) : null
          } catch {
            err.response.data = null
            _message.error(formatMessage({ id: 'SERVER_CONNECTION_ERROR' }))
            return Promise.reject(err)
          }
        }
        const { data } = err.response
        if (data) {
          const { code, message, value } = err.response.data;
          console.log(code, message)
          if (code) {
            if (err.response.config.url === PasswordlessLoginApi) {
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
              if (code === 'ERR_B009' || code === 'ERR_B066') {
                console.log('why session expired ?', getStorageAuth(), err.config.headers)
                dispatch(userInfoClear(false, true));
              }
              if (code === 'ERR_LOG_B078') {
                const raw = err.response.headers?.['x-log-raw-bytes']
                const max = err.response.headers?.['x-log-max-bytes']
                if (raw != null && max != null && String(raw) !== '' && String(max) !== '') {
                  _message.error(formatMessage({ id: 'ERR_LOG_B078_DETAIL' }, {
                    raw: formatLogBytes(String(raw)),
                    max: formatLogBytes(String(max))
                  }))
                } else {
                  _message.error(formatMessage({ id: code }, { value }))
                }
              } else {
                _message.error(formatMessage({ id: code }, { value }))
              }
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