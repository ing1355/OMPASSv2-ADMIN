import { CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { PostTokenVerifyApi } from 'Constants/ApiRoute';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import queryString from 'query-string'; 
import { useDispatch } from 'react-redux';
import { userInfoChange } from 'Redux/actions/userChange';

const OMPASSVerify = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = queryString.parse(location.search);
  const { username, access_token } = query;

  useEffect(() => {
    CustomAxiosPost(
      PostTokenVerifyApi,
      (data:any, header:any) => {
        const role = data.user.role;
        localStorage.setItem('authorization', header);
        dispatch(userInfoChange(header))
        if(role.includes('ADMIN')) {
          navigate('/Main')
        } else {
          navigate('/InformationDetail/User')
        }
      },
      {
        username: username,
        accessToken: access_token,
        device: {
          clientType: 'BROWSER',
        }
      },
      () => {
        console.log('ompass 인증 실패');
      }
    );
  },[])
  return (
    <>
    </>
  )
}

export default OMPASSVerify;