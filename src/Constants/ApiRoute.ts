// 로그인
export const PostLoginApi = '/v2/login';
export const PostTokenVerifyApi = '/v2/login/token-verification';
export const UpdatePasswordApi = '/v2/users/password'
export const ResetPasswordApi = `/v2/recovery-account`
export const ResetPasswordEmailSendApi = `/v2/recovery-account/mail`
export const ResetPasswordEmailCodeVerifyApi = `/v2/recovery-account/verification`

// Windows agent 파일
export const GetAgentInstallerListApi = (type: UploadFileTypes) => `/v2/agent-installer/type/${type}`;
export const CurrentAgentInstallerVersionChangeApi = (type: UploadFileTypes, fileId: AgentInstallerDataType['fileId']) => `/v2/agent-installer/type/${type}/id/${fileId}/target`
export const DeleteAgentInstallerApi = (fileIds: string) => `/v2/id/${fileIds}`;
export const DownloadAgentInstallerApi = '/v2/agent-installer/download';
export const UploadAgentInstallerApi = `/v2/upload`;
export const UpdateAgentNoteApi = (fileId: AgentInstallerDataType['fileId']) => `/v2/id/${fileId}/note`

// PASSCODE 관리
export const GetPasscodeHistoriesApi = '/v2/passcode-histories';
export const GetPasscodeListApi = '/v2/passcode'
export const AddPasscodeApi = '/v2/rp/users/passcode'
export const SendPasscodeEmailApi = '/v2/passcode/email'

// 애플리케이션
export const GetApplicationListApi = '/v2/applications'
export const GetApplicationDetailApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}/detail`
export const AddApplicationListApi = '/v2/applications'
export const UpdateApplicationListApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}`
export const DeleteApplicationListApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}`
export const UpdateApplicationSecretkeyApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/${applicationId}/reissuance`
export const GetAuthorizeMSEntraUriApi = (applicationId: ApplicationDataType['id']) => `/v2/applications/ms-entra-id/${applicationId}/authorize`

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
export const GetUserHierarchyApi = () => '/v2/users-hierarchy'

// 관리자 페이지 사용자 관리
export const GetUserDataListApi = '/v2/users'
export const AddUserDataApi = '/v2/users'
export const ApprovalUserApi = (userId: UserDataType['userId']) => `/v2/users/${userId}/approval`
export const UpdateUserDataApi = (userId: UserDataType['userId']) => `/v2/users/${userId}`
export const DeleteUserDataApi = (userId: UserDataType['userId']) => `/v2/users/${userId}`
export const GetUserDetailDataApi = (userId: UserDataType['userId']) => `/v2/users/${userId}/rp/details`
export const DeleteAuthenticatorData = (authenticatorId: AuthenticatorDataType['id']) => `/v2/authenticators/${authenticatorId}`
export const UnlockUserApi = (userId: UserDataType['userId']) => `/v2/users/${userId}/unlock`
export const AddUserWithCsvDataApi = '/v2/users/csv'
export const DuplicateUserNameCheckApi = (username: string) => `/v2/users/username/${username}/existence`;
export const RoleSwappingApi = '/v2/users/role-swapping'
export const GetRpUserListApi = 'v2/users/rp'
export const EmailChangeCodeVerificationApi = '/v2/users/email/code-verification'
export const SendEmailChangeEmailByAdminApi = '/v2/users/email/update-auth'
export const VerificationEmailChangeApi = '/v2/users/email/token-verification'

// 인증장치 정책 업데이트
export const UpdateUserAuthenticatorPolicyApi = (authId: string, policyId: string) => `/v2/rp/authentication-data/${authId}/policy/${policyId}`

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
export const RootSignUpRequestApi = '/v2/users/root/signup'
export const SignUpVerificationCodeSendApi = '/v2/users/verification-code'
export const SignUpVerificationCodeVerifyApi = '/v2/users/verification-code/verify'

// config
export const GetGlobalConfigApi = '/v2/global-config'

// 대시보드
export const GetDashboardTopApi = '/v2/dashboard/user-count'
export const GetDashboardApplicationRPUserApi = '/v2/dashboard/rp-user-count'
export const GetDashboardApplicationAuthApi = '/v2/dashboard/auth-req-count'
export const GetDashboardApplicationAuthSumApi = '/v2/dashboard/auth-req-sum-count'

// 세션 갱신
export const PatchSessionTokenApi = '/v2/refresh-session'

// 계정 복구
export const SendRecoveryMailApi = '/v2/recovery-account/mail'
export const ValidateRecoveryMailApi = '/v2/recovery-account/verification'
export const FindPortalUsernameApi = '/v2/username'

// 인증 모듈
export const OMPASSAuthStartApi = '/v2/enhanced-authentication'
export const GetOMPASSAuthResultApi = (type: string, pollingKey: string) => `/v2/enhanced-authentication/type/${type}/polling-key/${pollingKey}`

// LDAP
export const GetLdapConfigListApi = '/v2/ldap-configs'
export const AddLdapConfigListApi = '/v2/ldap-configs'
export const UpdateLdapConfigListApi = (id: LdapConfigDataType['id']) => `/v2/ldap-configs/id/${id}`
export const DeleteLdapConfigListApi = (id: LdapConfigDataType['id']) => `/v2/ldap-configs/id/${id}`
export const SyncLdapUserListApi = '/v2/ldap/sync'
export const TestLdapConnectionApi = '/v2/ldap/test-connection'

// RADIUS
export const AddRadiusUserListApi = '/v2/radius-rp-users'

// 보안 질문
export const UpdateSecurityQuestionsApi = '/v2/users/security-qna'