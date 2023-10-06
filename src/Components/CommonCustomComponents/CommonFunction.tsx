export function error1Fun(err: any, navigate: any) { 
  if(err.response.data.code === 'ERR_001') {
    navigate('/AutoLogout');
  }
}