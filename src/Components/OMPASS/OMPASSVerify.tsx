import { CustomAxiosPost } from 'Components/CustomComponents/CustomAxios';
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
        const uuid = data.user.id;
        localStorage.setItem('authorization', header);
        dispatch(userInfoChange(header))
        if(role.includes('ADMIN')) {
          navigate('/Main')
        } else {
          navigate(`/information/detail/User/${uuid}`)
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