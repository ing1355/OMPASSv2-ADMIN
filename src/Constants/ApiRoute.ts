// OMPASS API
export const GetPutSecretKeyApi = '/v1/ompass/secretkey';

// 로그인
export const PostLoginApi = '/v1/login';
export const PostTokenVerifyApi = '/v1/ompass/token-verification';

// 사용자
export const PostSignUpApi = '/v1/signup';
export const PostExcelUploadApi = '/v1/signup/excel-upload';
export const GetPutUsersApi = '/v1/users';
export const GetUsersDetailsApi = (id: string) => `/v1/users/${id}/details`;
export const DeleteUsersApi = (id: string) => `/v1/users/${id}`;
export const GetUsersCountApi = '/v1/users/count';
export const PatchUsersResetPasswordApi = '/v1/users/reset-password';
export const GetUsernameCheckApi = (username: string) => `/v1/users/username/${username}`;

// Windows agent 파일
export const GetAgentInstallerApi = `/v1/agent-installer`;
export const PatchAgentInstallerApi = (fileId: number) => `/v1/agent-installer/${fileId}/target`
export const DeleteAgentInstallerApi = (fileIds: string) => `/v1/agent-installer/${fileIds}`;
export const GetAgentInstallerDownloadApi = '/v1/agent-installer/download';
export const PostAgentInstallerUploadApi = `/v1/agent-installer/upload`;

// 장치(pc)
export const DeleteAccessUserApi = (deviceId: number, accessUserId: number) => `/v1/device/${deviceId}/access-user/${accessUserId}`;
export const PostAccessUserApi = '/v1/device/access-user';
export const DeleteDeviceApi = (userId: string, deviceId: number) => `/v1/users/${userId}/device/${deviceId}`;

// 패스코드
export const PutPasscodeApi = '/v1/passcode';
export const PostPutPasscodeApi = '/v1/passcode';
export const DeletePasscodeApi = (passcodeId: number) => `/v1/passcode/${passcodeId}`;


// 패스코드 이력
export const GetPasscodeHistoriesApi = '/v1/passcode-histories';