import { CustomAxiosPost } from 'Components/CommonCustomComponents/CustomAxios';
import { PostTokenVerifyApi } from 'Constants/ApiRoute';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { userInfoChange } from 'Redux/actions/userChange';
import { setStorageAuth } from 'Functions/GlobalFunctions';

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
      }, token: string) => {
        setStorageAuth(token)
        dispatch(userInfoChange(token))
        navigate('/Dashboard', {replace: true})
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
      navigate('/Dashboard')
    });
  }, [])
  return (
    <>
    </>
  )
}

export default OMPASSVerify;