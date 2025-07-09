import { VerificationEmailChangeFunc } from "Functions/ApiFunctions";
import queryString from "query-string";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const EmailChangeVerification = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const query = queryString.parse(location.search);
    const { token } = query;

    useEffect(() => {
        if (token) {
            VerificationEmailChangeFunc({
                token: token as string
            }, () => {
                window.alert('이메일 변경 성공!')
                navigate('/', {
                    replace: true
                })
            })
        }
    }, [token])
    return <>
    </>
}

export default EmailChangeVerification