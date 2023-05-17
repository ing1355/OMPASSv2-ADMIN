// 로그인
export const PostLoginApi = '/v1/login';
export const PostTokenVerifyApi = '/v1/ompass/token-verification';

// 사용자
export const PostSignUpApi = '/v1/signup';
export const GetPutUsersApi = '/v1/users';
export const GetUsernameCheckApi = (username: string) => `/v1/users/username/${username}`;