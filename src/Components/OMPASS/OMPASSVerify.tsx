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
      () => {
        navigate('/InformationList');
      },
      {
        username: username,
        accessToken: access_token,
      },
      () => {
        console.log('실패');
      }
    );
  })
  return (
    <>
    </>
  )
}

export default OMPASSVerify;