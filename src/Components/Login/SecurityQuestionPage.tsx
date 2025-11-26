import { message } from "antd";
import LocaleChange from "Components/CommonCustomComponents/Input/LocaleChange";
import SecurityQuestionLayout from "Components/SignUp/SecurityQuestionLayout"
import { CopyRightText, ompassDefaultLogoImage } from "Constants/ConstantValues"
import { UpdateSecurityQuestionsFunc } from "Functions/ApiFunctions";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

const SecurityQuestionPage = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const { token, isLogin } = useLocation().state || {}
    const { formatMessage } = useIntl()
    const navigate = useNavigate()

    useEffect(() => {
        // if (!token) {
        //     navigate('/', {
        //         replace: true
        //     })
        // }
    }, [])

    return <>
        <div className="signup-container">
            <div className="signup-header">
                <img
                    src={ompassDefaultLogoImage}
                />
                <span>OMPASS</span>
            </div>
            <SecurityQuestionLayout isLogin={isLogin} onComplete={(a, b, c) => {
                UpdateSecurityQuestionsFunc([
                    {
                        question: subdomainInfo.securityQuestion.questions[0],
                        answer: a
                    },
                    {
                        question: subdomainInfo.securityQuestion.questions[1],
                        answer: b
                    },
                    {
                        question: subdomainInfo.securityQuestion.questions[2],
                        answer: c
                    }
                ], token, () => {
                    message.success(formatMessage({ id: 'SECURITY_QUESTION_UPDATE_SUCCESS_MSG' }))
                    navigate('/', {
                        replace: true
                    })
                }).catch((e) => {
                    navigate('/', {
                        replace: true
                    })
                })
            }} />
            <div style={{
                marginTop: '20px'
            }}>
                <LocaleChange />
            </div>
            <div
                className='copyRight-style sign-up'
            >
                {CopyRightText(subdomainInfo)}
            </div>
        </div>
    </>
}

export default SecurityQuestionPage