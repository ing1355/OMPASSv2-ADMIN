// OMPASS API
export const GetPutSecretKeyApi = '/v1/ompass/secretkey';

// 로그인
export const PostLoginApi = '/v1/login';
export const PostTokenVerifyApi = '/v1/ompass/token-verification';

// 사용자
export const PostSignUpApi = '/v1/signup';
export const GetPutUsersApi = '/v1/users';
export const DeleteUsersApi = (id: string) => `/v1/users/${id}`;
export const GetUsersDetailsApi = (id: string) => `/v1/users/${id}/details`;
export const GetUsernameCheckApi = (username: string) => `/v1/users/username/${username}`;

// Windows agent 파일
export const GetAgentInstallerApi = `/v1/agent-installer`;
export const DeleteAgentInstallerApi = (fileIds: string) => `/v1/agent-installer/${fileIds}`;
export const PostAgentInstallerUploadApi = `/v1/agent-installer/upload`;
export const GetAgentInstallerDownloadApi = '/v1/agent-installer/download';

// 장치(pc)
export const DeleteDeviceApi = (deviceId: number) => `/v1/device/${deviceId}`;

// 패스코드
export const PostPutPasscodeApi = '/v1/passcode';
export const DeletePasscodeApi = (passcodeId: number) => `/v1/passcode/${passcodeId}`;
