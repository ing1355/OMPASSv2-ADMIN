const ErrorTexts = {
  'en': {
    ERR_000: 'Please check the ID and password.',
    ERR_001: 'The token has expired.',
    ERR_002: 'Unsupported token format.',
    ERR_003: 'Invalid token configuration.',
    ERR_004: 'Failed to verify the existing signature.',
    ERR_005: 'The token does not exist.',
    ERR_006: 'The token must be transmitted in Bearer format.',
    ERR_007: 'Unhandled error.',
    ERR_008: 'You do not have permission.',

    ERR_011: 'Policies currently in use cannot be deleted.',
    ERR_018: 'Invalid user id',
    ERR_019: 'Invalid application id',

    ERR_020: 'Invalid policy id',
    ERR_021: 'Invalid log id',
    ERR_022: 'Invalid authenticator id',
    ERR_023: 'Invalid rp user id',
    ERR_024: 'Invalid user group id',

    ERR_101: 'The token has expired.',
    ERR_102: 'User ID already exists.',
    ERR_103: 'Invalid token configuration.',
    ERR_104: 'Invalid facility type.',
    ERR_105: 'Invalid API request.',
    ERR_106: 'The account is locked.',
    ERR_107: 'The registered device does not exist. Please use the PASSCODE after registering the device.',
    ERR_108: 'The registered device does not exist.',
    ERR_109: 'Failed to verify OMPASS secret key.',
    ERR_110: 'The AGENT file to download does not exist.',
    ERR_111: 'Please check the PASSCODE.',
    ERR_112: 'The super administrator cannot be deleted.',
    ERR_113: 'No registered device exists.',
    ERR_114: 'File integrity check failed.',
    ERR_115: 'File size exceeds 20MB.',
    ERR_116: 'The passcode to be deleted does not exist.',
  },
  'ko': {
    ERR_000: '아이디와 패스워드를 확인해주세요.',
    ERR_001: '토큰이 만료되었습니다.',
    ERR_002: '지원하지 않는 형식의 토큰입니다.',
    ERR_003: '토큰의 구성이 올바르지 않습니다.',
    ERR_004: '기존 서명을 확인하지 못했습니다.',
    ERR_005: '토큰이 존재하지 않습니다.',
    ERR_006: '토큰은 Bearer 형식으로 전송되어야 합니다.',
    ERR_007: '핸들링되지 않은 에러',
    ERR_008: '권한이 없습니다.',

    ERR_011: '현재 사용중인 정책은 삭제할 수 없습니다.',
    ERR_018: '잘못된 사용자 정보 입니다.',
    ERR_019: '잘못된 어플리케이션 정보 입니다.',

    ERR_020: '잘못된 정책 정보 입니다.',
    ERR_021: '잘못된 로그 정보 입니다.',
    ERR_022: '잘못된 인증장치 정보 입니다.',
    ERR_023: '잘못된 사용자 정보 입니다.',
    ERR_024: '잘못된 그룹 정보 입니다.',

    ERR_101: '토큰이 만료되었습니다.',
    ERR_102: '이미 존재하는 사용자 아이디입니다.',
    ERR_103: '토큰의 구성이 올바르지 않습니다.',
    ERR_104: '존재하지 않는 시설물 타입입니다.',
    ERR_105: '잘못된 API 요청입니다.',
    ERR_106: '계정이 잠겼습니다.',
    ERR_107: '등록된 Device 가 존재하지 않습니다. 패스코드 사용은 장치 등록 후 사용해주세요.',
    ERR_108: '등록된 Device 가 존재하지 않습니다.',
    ERR_109: 'OMPASS 비밀키 검증에 실패하였습니다.',
    ERR_110: '다운로드할 AGENT 파일이 존재하지 않습니다.',
    ERR_111: 'PASSCODE를 확인해주세요.',
    ERR_112: '최고관리자는 삭제할 수 없습니다.',
    ERR_113: '등록된 Device 가 존재하지 않습니다.',
    ERR_114: '파일 무결성검사에 실패하였습니다.',
    ERR_115: '파일 크기가 20MB 를 초과하였습니다.',
    ERR_116: '삭제할 패스코드가 존재하지 않습니다.',
  }
}

export default ErrorTexts