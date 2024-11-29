const ServerErrorCodes = {
    'KR': {
        ERR_B002: "아이디와 이메일을 확인해 주세요.",
        ERR_B003: "사용자 아이디가 이미 존재합니다.",
        ERR_B004: "아이디와 비밀번호를 확인해 주세요.",
        ERR_B005: "OMPASS에 등록되지 않은 사용자는 비밀번호로 먼저 로그인해야 합니다.",
        ERR_B006: "잘못된 API 요청입니다.",
        ERR_B007: "계정이 잠겼습니다.",
        ERR_B008: "잘못된 값을 전달하고 있습니다.",
        ERR_B009: "유효하지 않은 인증 정보 입니다. 다시 로그인해주세요.",
        ERR_B010: "사용 중인 정책은 삭제할 수 없습니다.",
        ERR_B011: "유효하지 않은 코드입니다.",
        ERR_B012: "Portal 계정에 OMPASS를 먼저 등록해야 합니다.",
        
        ERR_B016: "다운로드 할 파일이 존재하지 않습니다.",
        ERR_B017: "해시값 검증에 실패하였습니다.",
        ERR_B018: "이메일 인증이 필요한 계정입니다.",
        ERR_B019: "해당 Windows agent 버전이 존재하지 않습니다.",
        ERR_B020: "관리자 승인이 필요한 계정입니다.",
        ERR_B021: "이메일 확인이 필요한 계정입니다.",
        ERR_B022: "잘못된 인증 정보입니다.",
        ERR_B023: "Windows 어플리케이션에 OMPASS가 등록되어 있지 않습니다.",
        ERR_B024: "OMPASS 포탈에서 삭제된 사용자입니다. 복구 코드를 확인하세요.",
        ERR_B026: "패스워드 5회 오류로 잠긴 계정입니다.",
        ERR_B027: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
        ERR_B029: "관리자 승인이 필요한 계정입니다.",

        ERR_B030: "이미 존재하는 버전입니다.",
        ERR_B032: "종료된 요청입니다.",

        ERR_B033: "사용자(본인)의 OMPASS 등록이 되어 있지 않습니다.",
        ERR_B034: "사용자(본인)의 계정이 잠겨있습니다.",
        ERR_B035: "사용자(본인)의 계정이 탈퇴되었습니다.",

        ERR_B036: "사용자(대상)의 OMPASS 등록이 되어 있지 않습니다.",
        ERR_B037: "사용자(대상)의 계정이 잠겨있습니다.",
        ERR_B038: "사용자(대상)의 계정이 탈퇴되었습니다.",
    },
    'EN': {
        ERR_B002: "Please check your ID and email",
        ERR_B003: "User ID already exists",
        ERR_B004: "Please check your ID and password",
        ERR_B005: "Users not registered with OMPASS must first log in with a password",
        ERR_B006: "Invalid API request",
        ERR_B007: "The account is locked",
        ERR_B008: "IllegalArgumentException",
        ERR_B009: "Invalid authentication information. Please log in again.",
        ERR_B010: "The policy that is already in use cannot be deleted",
        ERR_B011: "Invalid code",
        ERR_B012: "It can be used after registering with portal OMPASS",
        
        ERR_B016: "The AGENT file to download does not exist",
        ERR_B017: "File integrity check failed",
        ERR_B018: "This account requires email verification.",
        ERR_B019: "Not exist window agent version",
        ERR_B020: "This account requires admin approval",
        ERR_B021: "This account requires email verification",
        ERR_B022: "Invalid proxy login token",
        ERR_B023: "The rp user is not registered with OMPASS on the Windows application",
        ERR_B024: "This user has been deleted from the OMPASS portal. Please check recovery code",
        ERR_B026: "The account is locked due to more than 5 failed password attempts",
        ERR_B027: "Too many requests. Please try again in a moment",
        ERR_B029: "This account requires admin approval",

        ERR_B030: "The file version already exists",
        ERR_B032: "This request has been closed",

        ERR_B033: "The user (yourself) is not registered with OMPASS",
        ERR_B034: "Your (your) account is locked",
        ERR_B035: "Your (your) account has been canceled",

        ERR_B036: "The user (target) is not registered with OMPASS",
        ERR_B037: "The user's (target) account is locked",
        ERR_B038: "The user's (target) account has been canceled",
    }
}

export default ServerErrorCodes