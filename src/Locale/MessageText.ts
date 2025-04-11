const MessageText = {
    'KR': {
        USERNAME_CHECK: '아이디는 4~16자의 영소문자 및 숫자만 사용 가능합니다.',
        EMAIL_CHECK: '올바른 이메일 형식이 아닙니다. (영문, 숫자, 일부 특수문자 사용 가능)',
        NAME_CHECK: '한글, 영문 및 숫자만 사용 가능합니다.',
        PASSWORD_CHECK: '비밀번호는 8자 이상 3가지 조합 혹은 10자 이상 2가지 조합만 가능합니다.',
        PASSWORD_CONFIRM_CHECK: '비밀번호가 일치하지 않습니다.',
        PASSWORD_NOT_MATCH: '비밀번호가 일치하지 않습니다.',
        PHONE_NUMBER_CHECK: '10~11자리 숫자만 입력해주세요.',
        PLEASE_INPUT_HASH: '해시값을 입력해주세요.',
        THE_FILE_SIZE_EXCEEDS_200MB: '파일 용량(200MB)을 초과하였습니다.',
        ONLY_ZIP_FILES_CAN_BE_UPLOADED: 'zip 파일만 업로드 가능합니다.',
        ONLY_DEB_FILES_CAN_BE_UPLOADED: 'deb 파일만 업로드 가능합니다.',
        PLEASE_ENTER_A_CODE: '코드를 입력해주세요.',
        PLEASE_ENTER_TIME: '시간을 입력해주세요.',
        PLEASE_ENTER_THE_NUMBER_OF_REUSES: '재사용 횟수를 입력해주세요.',
        PLEASE_ENTER_AT_LEAST_1_MIN: '1분 이상으로 입력해주세요.',
        PLEASE_ENTER_MORE_THAN_1: '1번 이상으로 입력해주세요.',
        PLEASE_ENTER_A_6DIGIT_NUMBER: '6자리 숫자를 입력해주세요.',
        NOTE_PATCH_SUCCESS_MSG: '메모 수정에 성공하였습니다.',
        API_SERVER_ADDRESS_COPY_SUCCESS: 'API 서버 주소가 복사되었습니다.',
        API_SERVER_ADDRESS_COPY_FAIL: 'API 서버 주소 복사에 실패하였습니다.',
        APPLICATION_MODIFY_SUCCESS_MSG: '애플리케이션 수정에 성공하였습니다.',
        APPLICATION_ADD_SUCCESS_MSG: '애플리케이션 추가에 성공하였습니다.',
        APPLICATION_MS_ENTRA_TENANT_ID_COPY_SUCCESS_MSG: '테넌트 아이디가 복사되었습니다.',
        APPLICATION_MS_ENTRA_TENANT_ID_COPY_FAIL_MSG: '테넌트 아이디 복사에 실패하였습니다.',
        APPLICATION_MS_ENTRA_APP_ID_COPY_SUCCESS_MSG: '앱 아이디가 복사되었습니다.',
        APPLICATION_MS_ENTRA_APP_ID_COPY_FAIL_MSG: '앱 아이디 복사에 실패하였습니다.',
        APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_SUCCESS_MSG: '검색 엔드포인트가 복사되었습니다.',
        APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_FAIL_MSG: '검색 엔드포인트 복사에 실패하였습니다.',

        APPLICATION_CLIENT_ID_COPY_SUCCESS_MSG: '클라이언트 아이디가 복사되었습니다.',
        APPLICATION_CLIENT_ID_COPY_FAIL_MSG: '클라이언트 아이디 복사에 실패하였습니다.',
        APPLICATION_SECRET_KEY_COPY_SUCCESS_MSG: '시크릿 키가 복사되었습니다.',
        APPLICATION_SECRET_KEY_COPY_FAIL_MSG: '시크릿 키 복사에 실패하였습니다.',
        APPLICATION_SECRET_KEY_REISSUANCE_SUCCESS_MSG: '시크릿 키 재발급에 성공하였습니다.',
        APPLICATION_DELETE_SUCCESS_MSG: '애플리케이션 삭제에 성공하였습니다.',
        GROUP_ADD_SUCCESS_MSG: '그룹 추가에 성공하였습니다.',
        GROUP_MODIFY_SUCCESS_MSG: '그룹 수정에 성공하였습니다.',
        GROUP_MODIFY_DELETE_MSG: '그룹 삭제에 성공하였습니다.',
        PASSCODE_COPY_SUCCESS_MSG: 'PASSCODE 복사되었습니다.',
        PASSCODE_COPY_FAIL_MSG: 'PASSCODE 복사에 실패하였습니다.',
        SEND_CODE_NEED_EMAIL_SEND_FIRST: '이메일을 입력한 뒤 인증 코드를 발송해주세요.',
        NEED_CODE_VERIFY_MSG: '인증 코드 확인은 필수입니다.',
        EMAIL_SEND_FOR_CODE_VERIFY_SUCCESS_MSG: '인증 코드 발송에 성공하였습니다.',
        EMAIL_CODE_VERIFY_SUCCESS_MSG: '인증 코드 검증에 성공하였습니다.',
        PASSCODE_DELETE_SUCCESS_MSG: 'PASSCODE 삭제에 성공하였습니다.',
        SIGNUP_APPROVE_SUCCESS_MSG: '회원가입 승인에 성공하였습니다.',
        USER_ADD_SUCCESS_MSG: '사용자 추가에 성공하였습니다.',
        USER_MODIFY_SUCCESS_MSG: '사용자 수정에 성공하였습니다.',
        USER_ID_EXIST_CHECK_SUCCESS_MSG: '사용 가능한 아이디 입니다.',
        USER_ID_EXIST_CHECK_FAIL_MSG: '이미 사용중인 아이디 입니다.',
        PASSCODE_ADD_SUCCESS_MSG: 'PASSCODE 추가에 성공하였습니다.',
        USER_UNLOCK_SUCCESS_MSG: '계정 잠금 해제에 성공하였습니다.',
        USER_WITHDRAWAL_SUCCESS_MSG: '회원 탈퇴에 성공하였습니다.',
        USER_AUTH_DEVICE_UNREGISTER_SUCCESS_MSG: '인증 장치 등록 해제에 성공하였습니다.',
        EXCEL_EMPTY_MSG: '엑셀 파일이 비어있습니다.',
        EXCEL_UPLOAD_SUCCESS_MSG: '엑셀 파일 업로드에 성공하였습니다.',
        EXCEL_UPLOAD_FAIL_MSG: '제공한 템플릿 파일의 형식에 맞는 파일을 업로드해야 합니다.',
        SESSION_RENEWAL_SUCCESS_MSG: '세션 갱신에 성공하였습니다.',
        INVALID_INPUT_DOMAIN_MSG: '도메인 값이 올바르지 않습니다.',
        INVALID_INPUT_REDIRECT_URI_MSG: '리다이렉트 URI 값이 올바르지 않습니다.',
        NO_CONNECTED_RADIUS_APPLICATION_MSG: '연결된 RADIUS 애플리케이션이 없습니다.',
        RADIUS_USER_SYNC_SUCCESS_MSG: 'RADIUS 사용자 동기화에 성공하였습니다.',
        PLEASE_SELECT_FOR_GROUP_INCLUDE_MSG: '그룹에 추가할 사용자를 선택해주세요.',
        PLEASE_SELECT_FOR_GROUP_OUT_MSG: '그룹에서 제거할 사용자를 선택해주세요.',
        GROUP_USER_RESET_SUCCESS_MSG: '그룹 인원 초기화에 성공하였습니다.',
        SESSION_EXPIRED_MSG: '세션이 만료되었습니다.',
        PLEASE_INPUT_ID_MSG: '아이디를 입력해주세요.',
        PLEASE_INPUT_PASSWORD_MSG: '비밀번호를 입력해주세요.',
        PLEASE_INPUT_PASSWORD_CONFIRM_MSG: '비밀번호 확인을 입력해주세요.',
        PLEASE_INPUT_EMAIL_MSG: '이메일을 입력해주세요',
        PASSWORD_INIT_SUCCESS_MSG: '비밀번호 초기화에 성공하였습니다.',
        PASSWORD_CHANGE_SUCCESS_MSG: '비밀번호 변경에 성공하였습니다. 다시 로그인해주세요.',
        PASSWORD_CHANGE_NEED_MSG: '비밀번호 초기화 대상입니다. 비밀번호 초기화를 진행해주세요.',
        AUTH_POLICY_ADD_SUCCESS_MSG: '정책 추가에 성공하였습니다.',
        AUTH_POLICY_UPDATE_SUCCESS_MSG: '정책 수정에 성공하였습니다.',
        AUTH_POLICY_DELETE_SUCCESS_MSG: '정책 삭제에 성공하였습니다.',
        PLEASE_SELECT_APPLICATION_TYPE_MSG: '애플리케이션 유형은 필수 선택 사항입니다.',
        PLEASE_INPUT_POLICY_NAME_MSG: '정책명은 필수 입력 항목입니다.',
        PLEASE_SELECT_BROWSER_POLICY_MSG: '브라우저 접근은 최소 1개 이상 허용해야 합니다.',
        PLEASE_SELECT_USER_LOCATION_POLICY_MSG: '사용자 위치 정책을 1개 이상 설정해주세요.',
        PLEASE_INPOUT_LOCATION_NAME_MSG: '사용자 위치 정책은 위치명이 필수 입력 사항입니다.',
        PLEASE_SETTING_IP_ADDRESS_POLICY_MSG: 'IP 접근 정책을 1개 이상 설정해주세요.',
        PLEASE_SETTING_TIME_POLICY_MSG: '시간 접근 정책을 1개 이상 설정해주세요.',
        PLEASE_SETTING_NOTI_TO_ADMIN_POLICY_MSG: '위반 시 알림 방식을 1개 이상 설정해주세요.',
        PLEASE_SETTING_NOTI_TO_ADMIN_ONE_MORE_MSG: '위반 시 알림 받을 관리자를 1명 이상 설정해주세요.',
        NOTI_TO_ADMIN_INCLUDE_WITHDRAWAL_ADMIN_MSG: '탈퇴한 관리자가 포함되어 있습니다. 해당 관리자를 제외시켜 주세요.',
        PLEASE_SETTING_NOTI_TO_ADMIN_POLICY_ONE_MORE_MSG: '위반 시 알림 대상 정책을 1개 이상 설정해주세요.',
        LDAP_ADD_SUCCESS_MSG: 'LDAP 설정 추가에 성공하였습니다.',
        LDAP_MODIFY_SUCCESS_MSG: 'LDAP 설정 수정에 성공하였습니다.',
        LDAP_DELETE_SUCCESS_MSG: 'LDAP 설정 삭제에 성공하였습니다.',
        LDAP_USER_LOAD_SUCCESS_MSG: '사용자 목록을 불러옵니다.',
        LDAP_USER_SYNC_FAIL_NO_USERS_MSG: '동기화 할 사용자가 존재하지 않습니다. 불러오기를 먼저 진행해주세요.',
        LDAP_USER_SYNC_SUCCESS_MSG: 'LDAP 사용자 목록 동기화에 성공하였습니다.',
        EXCEL_DATA_INIT_MSG: '엑셀 데이터가 초기화 되었습니다.',
        EXCEL_USER_ADD_SUCCESS_MSG: '사용자 추가에 성공하였습니다.',
        EXCEL_UPLOAD_FAIL_FILE_NOT_CORRECTED_MSG: '파일 읽기에 실패했습니다.',
        OMPASS_MODULE_TIME_EXPIRED_MSG: '시간이 초과되었습니다. 다시 진행해주세요.',
        NEED_OMPASS_COMPLETE_MSG: 'OMPASS 인증을 완료해야 합니다.',
        ACCESS_TIME_NO_SELECTED_TIME_MSG: '시간 접근 정책에서 시간 선택을 확인해주세요.',
        IP_ADDRESS_DUPLICATE_MSG: '동일한 ip가 이미 설정되어 있습니다.',
        IP_ADDRESS_NOT_CORRECTED_MSG: 'IP 주소 또는 범위 형식이 잘못되었습니다.',
        PLEASE_INPUT_IP_ADDRESS_MSG: 'IP 주소를 입력해주세요.',
        LOCATION_GET_FAIL_MSG: '현재 위치 획득에 실패하였습니다.',
        LOCATION_PERMISSION_DENY_MSG: '위치 권한이 차단되어 있습니다.',
        LOCATION_GET_TIMEOUT_MSG: '위치 정보를 획득할 수 없습니다. 잠시 후 다시 시도해주세요.',
        LOCATION_RADIUS_NEED_VALUE_MSG: '반경은 최소 1m 이상 필수 입력 사항입니다.',
        LOCATION_NAME_REQUIRED_MSG: '위치명은 필수 입력 사항입니다.',
        LOCATION_NAME_ALREADY_EXIST_MSG: '이미 존재하는 위치명입니다. 다른 위치명으로 다시 시도해주세요.',
        SETTING_NOTICE_TO_ADMIN_METHOD_NEED_SELECT_MSG: '관리자 알림 설정 중 알림 방식을 선택해주세요.',
        SETTING_NOTICE_TO_ADMIN_TARGET_NEED_SELECT_MSG: '관리자 알림 설정 중 알림 받을 관리자를 선택해주세요.',
        SETTING_NOTI_TO_ADMIN_INCLUDE_WITHDRAWAL_ADMIN_MSG: '알림 받을 관리자에 이미 탈퇴한 관리자가 포함되어 있습니다. 해당 관리자를 제외시켜 주세요.',
        SETTING_SAVE_SUCCESS_MSG: '설정 저장에 성공하였습니다.',
        NO_DOWNLOAD_URL_MSG: '해당 패키지가 업로드되지 않았습니다. 메인 메뉴의 패키지 관리에서 해당하는 패키지를 업로드해주세요.',
        RADIUS_OMPASS_REGISTRATION_SUCCESS_MSG: 'RADIUS OMPASS 등록에 성공하였습니다.',
        LDAP_OMPASS_REGISTRATION_SUCCESS_MSG: 'LDAP OMPASS 등록에 성공하였습니다.',
        PASSCODE_RE_SEND_SUCCESS_MSG: 'PASSCODE를 사용자 이메일로 재발송하였습니다.',
        USER_AUTHORITY_SUCCESSION_SUCCESS_MSG: '권한 승계에 성공하였습니다. 포탈을 이용하려면 다시 로그인해주세요.',
        RECOVERY_CODE_COPY_SUCCESS_MSG: '복구 코드 복사에 성공하였습니다.',
        RECOVERY_CODE_COPY_FAIL_MSG: '복구 코드 복사에 실패하였습니다.',
        FAIL_REGISTER_MSG: '회원가입에 실패하였습니다.',
        SUCCESS_REGISTER_MSG: '회원가입에 성공하였습니다.',
        AVAILABLE_USERNAME: '사용 가능한 아이디입니다',
        UNAVAILABLE_USERNAME: '사용 불가능한 아이디입니다.',
        CURRENT_VERSION_CHANGE_COMPLETE: '현재 버전 변경을 완료하였습니다.',
        VERSION_DELETE: '버전 삭제를 완료하였습니다.',
        PLEASE_INPUT_SECURITY_QUESTION_MSG: '보안 질문에 대한 답변을 입력해주세요.',
        SECURITY_QUESTION_UPDATE_SUCCESS_MSG: '보안 질문 변경에 성공하였습니다.',
        PAM_BYPASS_DATA_USERNAME_REQUIRED_MSG: '바이패스 설정의 계정명을 입력해주세요.',
        PAM_BYPASS_DATA_IP_ADDRESS_REQUIRED_MSG: '바이패스 설정의 IP 주소를 입력해주세요.',
        PAM_BYPASS_DATA_IP_ADDRESS_INVALID_MSG: '바이패스 설정의 IP 주소가 올바르지 않습니다.',
        PLEASE_USE_PC_ENVIRONMENT_MSG: 'PC 환경에서 매뉴얼을 참고해주세요.',
        EMAIL_CODE_SEND_FIRST_MSG: '이메일 인증 코드 발송을 진행해주세요.',
        NEED_EMAIL_CODE_VERIFY_MSG: '이메일 인증 코드를 입력해주세요.',
        EMAIL_CHANGE_SUCCESS_MSG: '이메일 변경에 성공하였습니다.',
        EMAIL_CODE_SEND_SUCCESS_MSG: '코드 발송에 성공하였습니다. 이메일을 확인해주세요.',
        NOT_REGISTERED_MSG: 'OMPASS 등록이 되지 않은 사용자입니다.',
        PREPARING_MSG: '준비중인 기능입니다.',
        OMPASS_DEVICE_CHANGE_SUCCESS_MSG: '등록 기기 변경에 성공하였습니다.',
    },
    'EN': {
        USERNAME_CHECK: 'Only lowercase letters and numbers are allowed, with a length of 4 to 16 characters',
        EMAIL_CHECK: 'Please enter valid email address',
        NAME_CHECK: 'Please enter in Korean or English or numbers',
        PASSWORD_CHECK: 'Password must be 8 characters or more in 3 combinations or 10 characters or more in 2 combinations',
        PASSWORD_CONFIRM_CHECK: 'The passwords do not match',
        PASSWORD_NOT_MATCH: 'The passwords do not match',
        PHONE_NUMBER_CHECK: 'Please enter a 10-11 digit number only',
        PLEASE_INPUT_HASH: 'Please input hash for agent file',
        THE_FILE_SIZE_EXCEEDS_200MB: 'The file size exceeds 200 MB',
        ONLY_ZIP_FILES_CAN_BE_UPLOADED: 'Only zip files can be uploaded',
        ONLY_DEB_FILES_CAN_BE_UPLOADED: 'Only deb files can be uploaded',
        PLEASE_ENTER_A_CODE: 'Please enter a code',
        PLEASE_ENTER_TIME: 'Please enter time',
        PLEASE_ENTER_THE_NUMBER_OF_REUSES: 'Please enter the number of reuses',
        PLEASE_ENTER_AT_LEAST_1_MIN: 'Please enter at least 1 minute',
        PLEASE_ENTER_MORE_THAN_1: 'Please enter more than 1',
        PLEASE_ENTER_A_6DIGIT_NUMBER: 'Please enter a 6-digit number',
        NOTE_PATCH_SUCCESS_MSG: 'You have successfully edited the note',
        API_SERVER_ADDRESS_COPY_SUCCESS: 'The API server address has been copied',
        API_SERVER_ADDRESS_COPY_FAIL: 'Failed to copy API server address',
        APPLICATION_MODIFY_SUCCESS_MSG: 'The application modification was successful',
        APPLICATION_ADD_SUCCESS_MSG: 'Application addition was successful',
        APPLICATION_MS_ENTRA_TENANT_ID_COPY_SUCCESS_MSG: 'Tenant ID has been copied',
        APPLICATION_MS_ENTRA_TENANT_ID_COPY_FAIL_MSG: 'Failed to copy tenant ID',
        APPLICATION_MS_ENTRA_APP_ID_COPY_SUCCESS_MSG: 'Your App ID has been copied',
        APPLICATION_MS_ENTRA_APP_ID_COPY_FAIL_MSG: 'Failed to copy App ID',
        APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_SUCCESS_MSG: 'Discovery Endpoint has been copied.',
        APPLICATION_MS_ENTRA_DISCOVERY_ENDPOINT_COPY_FAIL_MSG: 'Discovery Endpoint copy failed',
        
        APPLICATION_CLIENT_ID_COPY_SUCCESS_MSG: 'The client ID has been copied',
        APPLICATION_CLIENT_ID_COPY_FAIL_MSG: 'Copying client ID failed',
        APPLICATION_SECRET_KEY_COPY_SUCCESS_MSG: 'Your secret key has been copied',
        APPLICATION_SECRET_KEY_COPY_FAIL_MSG: 'Secret key copy failed',
        APPLICATION_SECRET_KEY_REISSUANCE_SUCCESS_MSG: 'The secret key was successfully reissued',
        APPLICATION_DELETE_SUCCESS_MSG: 'The application was successfully deleted',
        GROUP_ADD_SUCCESS_MSG: 'Group addition was successful',
        GROUP_MODIFY_SUCCESS_MSG: 'Group modification was successful',
        GROUP_MODIFY_DELETE_MSG: 'Group deletion was successful',
        PASSCODE_COPY_SUCCESS_MSG: 'Your passcode has been copied',
        PASSCODE_COPY_FAIL_MSG: 'Passcode copy failed',
        SEND_CODE_NEED_EMAIL_SEND_FIRST: 'Please enter your email and send us a verification code',
        NEED_CODE_VERIFY_MSG: 'Verification of the authentication code is required',
        EMAIL_SEND_FOR_CODE_VERIFY_SUCCESS_MSG: 'The verification code has been successfully sent',
        EMAIL_CODE_VERIFY_SUCCESS_MSG: 'Authentication code verification was successful',
        PASSCODE_DELETE_SUCCESS_MSG: 'Passcode deletion was successful',
        SIGNUP_APPROVE_SUCCESS_MSG: 'Your membership registration has been successfully approved',
        USER_ADD_SUCCESS_MSG: 'User addition was successful',
        USER_MODIFY_SUCCESS_MSG: 'User modification was successful',
        USER_ID_EXIST_CHECK_SUCCESS_MSG: 'This ID is available',
        USER_ID_EXIST_CHECK_FAIL_MSG: 'This ID is already in use',
        PASSCODE_ADD_SUCCESS_MSG: 'Passcode addition was successful',
        USER_UNLOCK_SUCCESS_MSG: 'You have successfully unlocked your account',
        USER_WITHDRAWAL_SUCCESS_MSG: 'You have successfully withdrawn your membership',
        USER_AUTH_DEVICE_UNREGISTER_SUCCESS_MSG: 'Deregistering the authentication device was successful',
        EXCEL_EMPTY_MSG: 'The Excel file is empty',
        EXCEL_UPLOAD_SUCCESS_MSG: 'Excel file upload was successful',
        EXCEL_UPLOAD_FAIL_MSG: 'You must upload a file that matches the format of the provided form',
        SESSION_RENEWAL_SUCCESS_MSG: 'Session renewal was successful',
        INVALID_INPUT_DOMAIN_MSG: 'The domain value is incorrect',
        INVALID_INPUT_REDIRECT_URI_MSG: 'The redirect URI value is incorrect',
        NO_CONNECTED_RADIUS_APPLICATION_MSG: 'There is no RADIUS application connected',
        RADIUS_USER_SYNC_SUCCESS_MSG: 'RADIUS user synchronization was successful',
        PLEASE_SELECT_FOR_GROUP_INCLUDE_MSG: 'Please select the user you want to add to the group',
        PLEASE_SELECT_FOR_GROUP_OUT_MSG: 'Please select the user you want to remove from the group',
        GROUP_USER_RESET_SUCCESS_MSG: 'The group membership has been successfully reset',
        SESSION_EXPIRED_MSG: 'Your session has expired',
        PLEASE_INPUT_ID_MSG: 'Please enter your ID',
        PLEASE_INPUT_PASSWORD_MSG: 'Please enter your password',
        PLEASE_INPUT_PASSWORD_CONFIRM_MSG: 'Please enter your password confirm',
        PLEASE_INPUT_EMAIL_MSG: 'Please enter your email',
        PASSWORD_INIT_SUCCESS_MSG: 'Password reset was successful',
        PASSWORD_CHANGE_SUCCESS_MSG: 'You have successfully changed your password. Please log in again',
        PASSWORD_CHANGE_NEED_MSG: 'It is subject to password reset. Please proceed with password reset',
        AUTH_POLICY_ADD_SUCCESS_MSG: 'Policy addition was successful',
        AUTH_POLICY_UPDATE_SUCCESS_MSG: 'Policy modification was successful',
        AUTH_POLICY_DELETE_SUCCESS_MSG: 'Policy deletion was successful',
        PLEASE_SELECT_APPLICATION_TYPE_MSG: 'Application type is required',
        PLEASE_INPUT_POLICY_NAME_MSG: 'Policy name is a required field',
        PLEASE_SELECT_BROWSER_POLICY_MSG: 'Browser access policy must allow at least one.',
        PLEASE_SELECT_USER_LOCATION_POLICY_MSG: 'Please set at least one user location policy',
        PLEASE_INPOUT_LOCATION_NAME_MSG: 'The user location policy requires a location name',
        PLEASE_SETTING_IP_ADDRESS_POLICY_MSG: 'Please set at least one IP access policy',
        PLEASE_SETTING_TIME_POLICY_MSG: 'Please set at least one time access policy',
        PLEASE_SETTING_NOTI_TO_ADMIN_POLICY_MSG: 'Please set at least one notification method for administrator notification in case of violation',
        PLEASE_SETTING_NOTI_TO_ADMIN_ONE_MORE_MSG: 'Please set at least one administrator to receive administrator notifications in case of violation',
        NOTI_TO_ADMIN_INCLUDE_WITHDRAWAL_ADMIN_MSG: 'The administrators who will receive administrator notifications in case of violation include administrators who have already withdrawn. Please exclude the administrator in question',
        PLEASE_SETTING_NOTI_TO_ADMIN_POLICY_ONE_MORE_MSG: 'Please set at least one policy to be notified by administrator in case of violation',
        LDAP_ADD_SUCCESS_MSG: 'Adding LDAP settings was successful',
        LDAP_MODIFY_SUCCESS_MSG: 'The LDAP settings have been modified successfully',
        LDAP_DELETE_SUCCESS_MSG: 'Deletion of LDAP settings was successful',
        LDAP_USER_LOAD_SUCCESS_MSG: 'Load the user list',
        LDAP_USER_SYNC_FAIL_NO_USERS_MSG: 'The user to synchronize with does not exist. Please proceed with loading first',
        LDAP_USER_SYNC_SUCCESS_MSG: 'LDAP user list synchronization was successful',
        EXCEL_DATA_INIT_MSG: 'Excel data has been initialized',
        EXCEL_USER_ADD_SUCCESS_MSG: 'User addition was successful',
        EXCEL_UPLOAD_FAIL_FILE_NOT_CORRECTED_MSG: 'Reading the file failed',
        OMPASS_MODULE_TIME_EXPIRED_MSG: 'Timeout occurred. Please proceed again',
        NEED_OMPASS_COMPLETE_MSG: 'You must complete OMPASS authentication',
        ACCESS_TIME_NO_SELECTED_TIME_MSG: 'Please check your time selection in the time access policy',
        IP_ADDRESS_DUPLICATE_MSG: 'The same IP is already set',
        IP_ADDRESS_NOT_CORRECTED_MSG: 'The IP address or range format is incorrect',
        PLEASE_INPUT_IP_ADDRESS_MSG: 'Please enter your IP address',
        LOCATION_GET_FAIL_MSG: 'Failed to get current location',
        LOCATION_PERMISSION_DENY_MSG: 'Location permissions are blocked',
        LOCATION_GET_TIMEOUT_MSG: 'Location information cannot be obtained. Please try again later',
        LOCATION_RADIUS_NEED_VALUE_MSG: 'A radius of at least 1m is required',
        LOCATION_NAME_REQUIRED_MSG: 'Location alias is required',
        LOCATION_NAME_ALREADY_EXIST_MSG: 'This location alias already exists. Please try again with a different location alias.',
        SETTING_NOTICE_TO_ADMIN_METHOD_NEED_SELECT_MSG: 'Please select a notification method among administrator notification settings',
        SETTING_NOTICE_TO_ADMIN_TARGET_NEED_SELECT_MSG: 'During administrator notification settings, select the administrator who will receive notifications',
        SETTING_NOTI_TO_ADMIN_INCLUDE_WITHDRAWAL_ADMIN_MSG: 'Administrators who will receive notifications include administrators who have already withdrawn. Please exclude the administrator in question',
        SETTING_SAVE_SUCCESS_MSG: 'Settings were saved successfully',
        NO_DOWNLOAD_URL_MSG: 'The package was not uploaded. Please upload the relevant package from package management in the main menu.',
        RADIUS_OMPASS_REGISTRATION_SUCCESS_MSG: 'RADIUS OMPASS registration was successful',
        LDAP_OMPASS_REGISTRATION_SUCCESS_MSG: 'LDAP OMPASS registration was successful',
        PASSCODE_RE_SEND_SUCCESS_MSG: 'The passcode has been resent to your email address',
        USER_AUTHORITY_SUCCESSION_SUCCESS_MSG: 'The succession of authority was successful. Please log in again to use the OMPASS Portal.',
        RECOVERY_CODE_COPY_SUCCESS_MSG: 'Copying the recovery code was successful',
        RECOVERY_CODE_COPY_FAIL_MSG: 'Failed to copy recovery code',
        FAIL_REGISTER_MSG: 'Registration failed',
        SUCCESS_REGISTER_MSG: 'You have successfully registered',
        AVAILABLE_USERNAME: 'The username is available',
        UNAVAILABLE_USERNAME: 'The username is unavailable',
        CURRENT_VERSION_CHANGE_COMPLETE: 'Current version change complete',
        VERSION_DELETE: 'The version has been deleted',
        PLEASE_INPUT_SECURITY_QUESTION_MSG: 'Please enter your answer to your security question.',
        SECURITY_QUESTION_UPDATE_SUCCESS_MSG: 'You have successfully changed your security questions.',
        PAM_BYPASS_DATA_USERNAME_REQUIRED_MSG: 'Please enter the username for bypass settings.',
        PAM_BYPASS_DATA_IP_ADDRESS_REQUIRED_MSG: 'Please enter the IP address for bypass settings.',
        PAM_BYPASS_DATA_IP_ADDRESS_INVALID_MSG: 'The IP address in bypass settings is incorrect.',
        PLEASE_USE_PC_ENVIRONMENT_MSG: 'Please use the PC environment to access the manual.',
        EMAIL_CODE_SEND_FIRST_MSG: 'Please send the email verification code',
        NEED_EMAIL_CODE_VERIFY_MSG: 'Please enter the email verification code',
        EMAIL_CODE_SEND_SUCCESS_MSG: 'The verification code has been successfully sent. Please check your email.',
        EMAIL_CHANGE_SUCCESS_MSG: 'Email change was successful.',
        NOT_REGISTERED_MSG: 'This user is not registered with OMPASS.',
        PREPARING_MSG: 'This feature is under preparation.',
        OMPASS_DEVICE_CHANGE_SUCCESS_MSG: 'The device registration has been changed successfully.',
    }
}

export default MessageText