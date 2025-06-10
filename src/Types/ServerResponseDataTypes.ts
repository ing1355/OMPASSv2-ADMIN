type AgentInstallerListDataType = AgentInstallerDataType[]

type AgentInstallerDataType = {
  fileId: number
  uploader: string
  version: string
  uploadDate: string
  downloadTarget: boolean
  downloadUrl: string
  fileName: string
  note: string
}

// export type userRoleType = "USER" | "ADMIN" | "SUPER_ADMIN" | null;
type userRoleType = "USER" | "ADMIN" | "ROOT";

type OsNamesType = "Windows" | "Mac" | "Gooroom" | "Ubuntu" | "CentOS" | 'Android' | 'iOS' | 'Rocky';


type UserSignUpMethodType = "USER_SELF_ADMIN_PASS" | "USER_SELF_ADMIN_ACCEPT"
type SecurityQuestionsKeyType = "FIRST_PET_NAME" | "FAVORITE_CHILDHOOD_MOVIE" | "MOTHERS_MAIDEN_NAME" | "FAVORITE_BOOK_TITLE" | "FIRST_SCHOOL_NAME" | "FIRST_JOB_NAME" | "CHILDHOOD_NEIGHBORHOOD" | "FATHERS_NAME" | "FAVORITE_FOOD" | "FIRST_CAR_MODEL" | "FIRST_PHONE_MODEL" | "FAVORITE_COLOR" | "HOMETOWN_STREET" | "FIRST_FOREIGN_CITY" | "FAVORITE_CHILDHOOD_HOBBY" | "FIRST_FRIEND_NAME" | "FAVORITE_TRAVEL_DESTINATION" | "FAVORITE_SPORT" | "FAVORITE_SUBJECT" | "PARENTS_ANNIVERSARY" | "MEMORABLE_BIRTHDAY_GIFT" | "FAVORITE_SEASON" | "FIRST_SHOW_LOCATION" | "FAVORITE_MOVIE_GENRE" | "FREQUENT_CHILDHOOD_PLACE" | "FAVORITE_CHILDHOOD_CHARACTER" | "FIRST_FRIEND_ADDRESS" | "FAVORITE_CHILDHOOD_GAME" | "FAVORITE_MUSIC_GENRE" | "CLOSEST_FAMILY_MEMBER" | "MEMORABLE_TRAVEL_DESTINATION" | "FIRST_CONCERT_ARTIST" | "FAVORITE_TV_SHOW" | "PARENTS_MARRIAGE_LOCATION" | "FAVORITE_FLOWER" | "FIRST_BIKE_COLOR" | "FAVORITE_CELEBRITY" | "FAVORITE_CHILDHOOD_RIDE" | "PARENTS_MARRIAGE_PLACE" | "FAVORITE_CAR_BRAND" | "CHILDHOOD_NICKNAME" | "BEST_CHILDHOOD_FRIEND" | "FAVORITE_ANIMAL" | "FIRST_PIZZA_PLACE" | "FAVORITE_MOVIE_CHARACTER" | "PARENTS_BIRTHPLACE" | "MEMORABLE_FAMILY_TRIP" | "FIRST_OVERSEAS_COUNTRY" | "FAVORITE_COFFEE_DRINK" | "FIRST_HOME_FEATURE"

type SecurityQuestionType = {
  isRootAdminSignupComplete: boolean,
  questions: SecurityQuestionsKeyType[]
}

type PlanFeatureType = "DASHBOARD" | "ADMIN_NOTIFICATION" | "USER_EXTERNAL_DIRECTORY_SYNC" | "ADMIN_APPLICATION" | "WEB_APPLICATION" | "WINDOWS_LOGIN_APPLICATION" | "LINUX_LOGIN_APPLICATION" | "RADIUS_APPLICATION" | "LDAP_APPLICATION" | "MICROSOFT_ENTRA_ID_APPLICATION" | "REDMINE_APPLICATION"

type PlanDataType = {
  type: "TRIAL_PLAN" | "SUBSCRIPTION_PLAN_L1" | "SUBSCRIPTION_PLAN_L2" | "SUBSCRIPTION_PLAN_L3" | "LICENSE_PLAN_L1" | "LICENSE_PLAN_L2",
  status: "RUN" | "EXPIRED",
  availableFeatures: PlanFeatureType[]
  maxUserCount: number
  maxApplicationCount: number
  maxSessionCount: number
  expiredDate: string
  createdAt: string
}

type SubDomainInfoDataType = {
  serverType: 'ON_PREMISE' | 'CLOUD',
  plan?: PlanDataType
  securityQuestion: SecurityQuestionType
  name: PortalSettingsDataType['name']
  logoImage: PortalSettingsDataType['logoImage']
  noticeMessage: PortalSettingsDataType['noticeMessage']
  userSignupMethod: PortalSettingsDataType['userSignupMethod']
  selfSignupEnabled: PortalSettingsDataType['selfSignupEnabled']
  backendVersion: {
    fidoApp: string
    interfaceApp: string
    portalApp: string
  }
  windowsAgentUrl?: string
  linuxPamDownloadUrl?: string
  ompassProxyDownloadUrl?: string
  redminePluginDownloadUrl?: string
  keycloakPluginDownloadUrl?: string
  passwordless?: PolicyDataType['passwordless']
}

type PortalSettingsDataType = {
  name: string
  logoImage: logoImageType
  noticeMessage: string
  userSignupMethod: UserSignUpMethodType
  selfSignupEnabled: boolean
  timeZone: string
  isUserAllowedToRemoveAuthenticator: boolean
  noticeToAdmin: {
    isEnabled: RestrictionNoticeDataType['isEnabled'],
    admins: RestrictionNoticeDataType['admins'],
    methods: RestrictionNoticeDataType['methods']
  }
}

type UpdatePortalSettingsDataType = {
  name: string
  userSignupMethod: UserSignUpMethodType
  logoImage: updateLogoImageType
  noticeMessage: string
  timeZone: string
  isUserAllowedToRemoveAuthenticator: boolean
  selfSignupEnabled: boolean
  noticeToAdmin: {
    isEnabled: RestrictionNoticeDataType['isEnabled'],
    admins: RestrictionNoticeDataType['admins'],
    methods: RestrictionNoticeDataType['methods']
  }
}

type ServerGlobalConfigDataType = {
  isUserAllowedToRemoveAuthenticator: boolean
  googleApiKey: string
}

type GlobalDatasType = ServerGlobalConfigDataType & {
  loading: boolean
}

type DashboardTopDataType = {
  totalUserCount: number,
  activeUserCount: number,
  deActiveUserCount: number,
  userCountByDeActiveStatus: {
    count: number
    status: UserStatusType
  }[]
}

type DashboardApplicationRPUserDataType = {
  applicationId: ApplicationListDataType['id'],
  registeredRpUserCount: number,
  unRegisteredRpUserCount: number
}

type UserHierarchyDataServerResponseType = DefaultUserHierarchyDataType & {
  rpUsers: UserHierarchyDataRpUserServerResponseType[]
}

type UserHierarchyDataRpUserServerResponseType = DefaultUserHierarchyDataRpUserType & {
  applicationId: ApplicationListDataType['id']
  groupId: DefaultUserGroupDataType['id']
}

type LdapTransportType = "CLEAR" | "LDAPS" | "STARTTLS"
type LdapAuthenticationEnumType = "PLAIN" | "NTLMv2"
type LdapAuthenticationType = {
  type: LdapAuthenticationEnumType
  ntlmDomain?: string | null
  ntlmWorkstation?: string | null
}
type ProxyServerDataType = {
  address: string
  port: number
}
type LdapDirectoryServerDataType = {
  address: string
  port: number
}

type LdapConfigDataType = {
  id: string
  type: ExternalDirectoryType
  name: string
  description: string
  createdAt: string
  secretKey: string
  apiServerHost: string
  directoryServers: LdapDirectoryServerDataType[]
  proxyServer: ProxyServerDataType
  baseDn: string
  ldapAuthenticationType: LdapAuthenticationType
  ldapTransportType: LdapTransportType
  isConnected: boolean
  lastUserSyncedAt: string
}

type RpUserListDataType = {
  portalUser: PortalUserType
  rpUser: RPUserType
  authenticationInfoId: AuthenticatorDataType['id']
  groupName: UserGroupDataType['name']
  application: {
    type: ApplicationDataType['type']
    name: ApplicationDataType['name']
  }
  ompassRegisteredAt: string
  lastLoggedInAt: string
  lastLoggedInAuthenticator: AuthenticatorDataType['type']
  ompassDeviceName: string
  ompassAppVersion: string
  pcName?: string
  windowsAgentVersion?: string
  hasPasscode: boolean
}