import axios from "axios";
import { useLayoutEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { message } from 'antd';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { userInfoClear } from "Redux/actions/userChange";

let oldInterceptorId = 0;
let alertId = 0

const NOT_AUTHORIZED_CODES = ['001', '002', '003', '004', '005', '006']

const AxiosController = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
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
      if (err && err.response && err.response.data) {
        const { code } = err.response.data;
        console.log(code)
        if (code === 'ERR_001') {
          // message.error('오류');
          // navigate('/AutoLogout');
          if (NOT_AUTHORIZED_CODES.includes(code.split('_')[1])) {
            dispatch(userInfoClear());
          }
        } else if (code === 'ERR_007') {
          message.error('에러가 발생했습니다.');
        } else {
          message.error(formatMessage({ id: code }));
          if (NOT_AUTHORIZED_CODES.includes(code.split('_')[1])) {
            dispatch(userInfoClear())
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