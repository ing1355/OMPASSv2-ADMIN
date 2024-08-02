// OMPASS API
export const GetPutSecretKeyApi = '/v1/ompass/secretkey';

// 로그인
export const PostLoginApi = '/v2/login';
export const PostTokenVerifyApi = '/v2/login/token-verification';

// 사용자
export const PostSignUpApi = '/v1/signup';
export const PostExcelUploadApi = '/v1/signup/excel-upload';
export const GetPutUsersApi = '/v1/users';
export const GetUsersDetailsApi = (id: string) => `/v1/users/${id}/details`;
export const DeleteUsersApi = (id: string) => `/v1/users/${id}`;
export const GetUsersCountApi = '/v1/users/count';
export const PatchUsersResetPasswordApi = '/v1/users/reset-password';
export const DuplicateUserNameCheckApi = (username: string) => `/v2/users/username/${username}/existence`;

// Windows agent 파일
export const GetAgentInstallerListApi = `/v2/agent-installer`;
export const CurrentAgentInstallerVersionChangeApi = (fileId: AgentInstallerDataType['fileId']) => `/v2/agent-installer/${fileId}/target`
export const DeleteAgentInstallerApi = (fileIds: string) => `/v2/agent-installer/${fileIds}`;
export const DownloadAgentInstallerApi = '/v2/agent-installer/download';
export const UploadAgentInstallerApi = `/v2/agent-installer/upload`;

// 장치(pc)
export const DeleteAccessUserApi = (deviceId: number, accessUserId: number) => `/v1/device/${deviceId}/access-user/${accessUserId}`;
export const PostAccessUserApi = '/v1/device/access-user';
export const DeleteDeviceApi = (userId: string, deviceId: number) => `/v1/users/${userId}/device/${deviceId}`;

// 패스코드
export const PutPasscodeApi = '/v1/passcode';
export const PostPutPasscodeApi = '/v1/passcode';
// export const DeletePasscodeApi = (passcodeId: number) => `/v1/passcode/${passcodeId}`;

// 패스코드 이력
// export const GetPasscodeHistoriesApi = '/v1/passcode-histories';
export const GetPasscodeHistoriesApi = '/v2/passcode-histories';

// 패스코드 관리
export const AddPasscodeApi = '/v2/rp/users/passcode'

// 권한 설정
export const GetPatchPermissionsSettingApi = '/v1/permissions';

// 어플리케이션
export const GetApplicationListApi = '/v2/applications'
export const GetApplicationDetailApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}/detail`
export const AddApplicationListApi = '/v2/applications'
export const UpdateApplicationListApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}`
export const DeleteApplicationListApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}`
export const UpdateApplicationSecretkeyApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}/reissuance`

// 정책 관리
export const GetPoliciesListApi = '/v2/policies'
export const GetPolicyDetailDataApi = (policyId: PolicyDataType['id']) => `/v2/policies/${policyId}/detail`
export const AddPoliciesListApi = '/v2/policies'
export const UpdatePoliciesListApi = (policyId: PolicyDataType['id']) => `/v2/policies/${policyId}`
export const DeletePoliciesListApi = (policyId: PolicyDataType['id']) => `/v2/policies/${policyId}`


// 그룹 관리
export const GetUserGroupsApi = '/v2/groups'
export const GetUserGroupDetailApi = (groupId: UserGroupDataType['id']) => `/v2/groups/${groupId}/detail`
export const AddUserGroupApi = '/v2/groups'
export const UpdateUserGroupApi = (groupId: UserGroupDataType['id']) => `/v2/groups/${groupId}`
export const DeleteUserGroupApi = (groupId: UserGroupDataType['id']) => `/v2/groups/${groupId}`

// 관리자 페이지 사용자 관리
export const GetUserDataListApi = '/v2/users'
export const AddUserDataApi = '/v2/users'
export const UpdateUserDataApi = (userId: UserDataType['userId']) => `/v2/users/${userId}`
export const DeleteUserDataApi = (userId: UserDataType['userId']) => `/v2/users/${userId}`
export const GetUserDetailDataApi = (userId: UserDataType['userId']) => `/v2/users/${userId}/rp/details`
export const DeleteAuthenticatorData = (authenticatorId: AuthenticatorDataType['id']) => `/v2/authenticators/${authenticatorId}`

// 로그 관리
export const GetAuthLogDataListApi = '/v2/logs/auth'
export const GetPortalLogDataListApi = '/v2/logs/admin-behavior'

// 서브도메인 정보
export const GetSubDomainInfoApi = (subdomain: string) => `/v2/tenant/sub-domain/${subdomain}`

// 포탈 설정
export const GetPortalSettingsDataApi = '/v2/setting'
export const UpdatePortalSettingsDataApi = '/v2/setting'

// 회원가입
export const SignUpRequestApi = '/v2/users/signup'