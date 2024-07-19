import axios from "axios";
import { useLayoutEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { message } from 'antd';
import { userInfoClear } from "Redux/actions/userChange";
import { useNavigate } from "react-router";
import { controller } from "Components/CommonCustomComponents/CustomAxios";

let oldInterceptorId = 0;

const AxiosController = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // const history = useHistory()
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang!,
  }));

  useLayoutEffect(() => {
    axios.interceptors.response.eject(oldInterceptorId)
    oldInterceptorId = axios.interceptors.response.use(res => {
      return res;
    }, (err) => {
      console.log(err)
      if (err && err.response && err.response) {
        const { data, status } = err.response
        console.log(data, status)
        if(status === 401 && localStorage.getItem('authorization')) {
          dispatch(userInfoClear());
          navigate('/AutoLogout');
          
          if(data) {
            const { code } = err.response.data;
            message.error(formatMessage({id: code}))
          }
        } else {
          if(data) {
            const { code } = err.response.data;
            message.error(formatMessage({id: code}))
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