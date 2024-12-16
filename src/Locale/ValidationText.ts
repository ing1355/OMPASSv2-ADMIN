const ValidationText = {
    'KR': {
        USERNAME_CHECK: '아이디는 4~16자의 영소문자 및 숫자만 사용 가능합니다.',
        EMAIL_CHECK: '올바른 이메일 형식이 아닙니다. (영문, 숫자, 일부 특수문자 사용 가능).',
        NAME_CHECK: '이름은 한글, 영문 및 숫자만 사용 가능합니다.',
        FIRST_NAME_CHECK: '성은 한글, 영문, 숫자로 입력해주세요.',
        LAST_NAME_CHECK: '이름은 한글, 영문, 숫자로 입력해주세요.',
        PASSWORD_CHECK: '비밀번호는 8자 이상 3가지 조합 혹은 10자 이상 2가지 조합이어야 합니다.',
        PASSWORD_CONFIRM_CHECK: '비밀번호가 일치하지 않습니다.',
        PASSWORD_NOT_MATCH: '비밀번호가 일치하지 않습니다.',
        PHONE_NUMBER_CHECK: '10~11자리 숫자만 입력해주세요.',
        PLEASE_INPUT_HASH: '해시값을 입력해주세요.',
        THE_FILE_SIZE_EXCEEDS_200MB: '파일 용량(200MB)을 초과하였습니다.',
        ONLY_ZIP_FILES_CAN_BE_UPLOADED: 'zip 파일만 업로드 가능합니다.',
        PLEASE_ENTER_A_CODE: '코드를 입력해주세요.',
        PLEASE_ENTER_TIME: '시간을 입력해주세요.',
        PLEASE_ENTER_THE_NUMBER_OF_REUSES: '재사용 횟수를 입력해주세요.',
        PLEASE_ENTER_AT_LEAST_1_MIN: '1분 이상으로 입력해주세요.',
        PLEASE_ENTER_MORE_THAN_1: '1번 이상으로 입력해주세요.',
        PLEASE_ENTER_A_6DIGIT_NUMBER: '6자리 숫자를 입력해주세요.',
        ID_CHECK: '아이디 중복 확인은 필수입니다.',
        PLEASE_ENTER_ALL_THE_ITEMS: '항목을 모두 입력해주세요.',
        PLEASE_UPLOAD_INPUT_FILE: '파일을 업로드해주세요.',
        PLEASE_SELECT_APPLICATION_TYPE: '어플리케이션 타입을 선택해주세요.',
        PLEASE_INPUT_APPLICATION_NAME: '어플리케이션 이름을 입력해주세요.',
        PLEASE_INPUT_APPLICATION_DOMAIN: '도메인을 입력해주세요.',
        PLEASE_INPUT_APPLICATION_REDIRECT_URI: '리다이렉트 URI을 입력해주세요.',
        PLEASE_SELECT_APPLICATION_POLICY: '정책을 설정해주세요.',
        IMAGE_FILE_UPLOADED_SIZE_EXCEEDS_1MB: '1MB를 초과하는 파일은 업로드가 불가능합니다.',
        IMAGE_FILE_UPLOADED_INVALID_FILE_FORMAT: '올바른 이미지 형식이 아닙니다.',
        CALENDAR_PLEASE_SELECT_DATE_RANGE: '기간을 선택해주세요.',
        CALENDAR_MAXIMUM_RANGE_DATE_INVALID_MSG: '31일 이상은 설정할 수 없습니다.',
        PLEASE_INPUT_GROUP_NAME: '그룹명을 입력해주세요.',
        PLEASE_INPUT_ID: '아이디를 입력해주세요.',
        PLEASE_INPUT_FIRST_NAME: '성을 입력해주세요.',
        PLEASE_INPUT_LAST_NAME: '이름을 입력해주세요.',
        PLEASE_INPUT_EMAIL: '이메일을 입력해주세요.',
        PASSCODE_NEED_9_DIGIT_NUMBERS: '패스코드 지정 생성은 9자리 필수 입니다.',
        PASSCODE_NEED_MORE_THAN_1_MINUTES: '패스코드 만료 기간은 1분 이상 설정되어야 합니다.',
        PASSCODE_NEED_MORE_THAN_1_TIMES: '패스코드 사용 횟수는 1회 이상 설정되어야 합니다.',
        UPLOAD_NEED_ACCEPT_TYPE: '{param} 형식의 파일만 업로드 가능합니다.',
        UPLOAD_NEED_UNDER_10_MB_FILE: '10MB 미만의 파일만 업로드 가능합니다.',
        IP_ADDRESS_POLICY_INPUT: 'IP 주소 형식(aaa.bbb.ccc.ddd) 혹은 CIDR 형식(aaa.bbb.0.0/24)을 입력해야 합니다.'
    },
    'EN': {
        USERNAME_CHECK: 'Only lowercase letters and numbers are allowed, with a length of 4 to 16 characters',
        EMAIL_CHECK: 'Please enter valid email address',
        NAME_CHECK: 'Please enter in Korean or English or numbers',
        FIRST_NAME_CHECK: 'Please enter in Korean or English or numbers',
        LAST_NAME_CHECK: 'Please enter in Korean or English or numbers',
        PASSWORD_CHECK: 'Password must be 8 characters or more in 3 combinations or 10 characters or more in 2 combinations',
        PASSWORD_CONFIRM_CHECK: 'The passwords do not match',
        PASSWORD_NOT_MATCH: 'The passwords do not match',
        PHONE_NUMBER_CHECK: 'Please enter a 10-11 digit number only',
        PLEASE_INPUT_HASH: 'Please input hash for agent file',
        THE_FILE_SIZE_EXCEEDS_200MB: 'The file size exceeds 200 MB',
        ONLY_ZIP_FILES_CAN_BE_UPLOADED: 'Only zip files can be uploaded',
        PLEASE_ENTER_A_CODE: 'Please enter a code',
        PLEASE_ENTER_TIME: 'Please enter time',
        PLEASE_ENTER_THE_NUMBER_OF_REUSES: 'Please enter the number of reuses',
        PLEASE_ENTER_AT_LEAST_1_MIN: 'Please enter at least 1 minute',
        PLEASE_ENTER_MORE_THAN_1: 'Please enter more than 1',
        PLEASE_ENTER_A_6DIGIT_NUMBER: 'Please enter a 6-digit number',
        ID_CHECK: 'Checking ID duplicates is essential',
        PLEASE_ENTER_ALL_THE_ITEMS: 'Please enter all the items',
        PLEASE_UPLOAD_INPUT_FILE: 'Please upload your file',
        PLEASE_SELECT_APPLICATION_TYPE: 'Please select the application type',
        PLEASE_INPUT_APPLICATION_NAME: 'Please enter the application name',
        PLEASE_INPUT_APPLICATION_DOMAIN: 'Please enter your domain',
        PLEASE_INPUT_APPLICATION_REDIRECT_URI: 'Please enter the redirect URI',
        PLEASE_SELECT_APPLICATION_POLICY: 'Please set a policy',
        IMAGE_FILE_UPLOADED_SIZE_EXCEEDS_1MB: 'Files exceeding 1MB cannot be uploaded',
        IMAGE_FILE_UPLOADED_INVALID_FILE_FORMAT: 'This is not the correct image format',
        CALENDAR_PLEASE_SELECT_DATE_RANGE: 'Please select a period',
        CALENDAR_MAXIMUM_RANGE_DATE_INVALID_MSG: 'It cannot be set for more than 31 days',
        PLEASE_INPUT_GROUP_NAME: 'Please enter the group name',
        PLEASE_INPUT_ID: 'Please enter your ID',
        PLEASE_INPUT_FIRST_NAME: 'Please enter your last name',
        PLEASE_INPUT_LAST_NAME: 'Please enter your first name.',
        PLEASE_INPUT_EMAIL: 'Please enter your email',
        PASSCODE_NEED_9_DIGIT_NUMBERS: '9 digits are required to create a designated passcode',
        PASSCODE_NEED_MORE_THAN_1_MINUTES: 'The passcode expiration period must be set to at least 1 minute',
        PASSCODE_NEED_MORE_THAN_1_TIMES: 'The passcode must be used more than once',
        UPLOAD_NEED_ACCEPT_TYPE: 'Only files in {param} format can be uploaded',
        UPLOAD_NEED_UNDER_10_MB_FILE: 'Only files smaller than 10MB can be uploaded',
        IP_ADDRESS_POLICY_INPUT: 'You must enter the IP address format (aaa.bbb.ccc.ddd) or CIDR format (aaa.bbb.0.0/24)'
    }
}

export default ValidationText