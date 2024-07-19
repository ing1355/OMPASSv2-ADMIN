import { CustomAxiosPost } from 'Components/CommonCustomComponents/CustomAxios';
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
  const { username, token, authorization } = query;

  useEffect(() => {
    CustomAxiosPost(
      PostTokenVerifyApi,
      (data: {
        username: string
      }, header: string) => {
        localStorage.setItem('authorization', header);
        dispatch(userInfoChange(header))
        navigate('/Main')
      },
      {
        username: username,
        token,
        applicationType: "ADMIN"
      } as {
        username: string
        token: string
        applicationType: ApplicationDataType['type']
      }, {
      authorization
    }
    ).catch(err => {
      console.log('ompass 인증 실패');
      navigate('/Main')
    });
  }, [])
  return (
    <>
    </>
  )
}

export default OMPASSVerify;