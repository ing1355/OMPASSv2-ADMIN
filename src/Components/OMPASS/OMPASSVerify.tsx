import { CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { PostTokenVerifyApi } from 'Constants/ApiRoute';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import queryString from 'query-string'; 

const OMPASSVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = queryString.parse(location.search);
  const { username, access_token } = query;

  useEffect(() => {
    CustomAxiosPost(
      PostTokenVerifyApi,
      (data:any) => {
        console.log('data', data);
        const role = data.user.role;
        const userInfo = {
          userId: data.user.username,
          userRole: role,
          uuid: data.user.id,
        }
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        if(role === 'USER') {
          navigate('/InformationDetail');
        } else if(role === 'ADMIN') {
          navigate('/InformationList');
        } else {
          navigate('/InformationList');
        }
      },
      {
        username: username,
        accessToken: access_token,
      },
      () => {
        console.log('ompass 인증 실패');
      }
    );
  })
  return (
    <>
    </>
  )
}

export default OMPASSVerify;