import { message } from "antd";
import SecurityQuestionLayout from "Components/SignUp/SecurityQuestionLayout"
import { CopyRightText, ompassDefaultLogoImage } from "Constants/ConstantValues"
import { UpdateSecurityQuestionsFunc } from "Functions/ApiFunctions";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

const SecurityQuestionPage = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const { token, questions } = useLocation().state
    const { formatMessage } = useIntl()
    const navigate = useNavigate()

    return <>
        <div className="signup-container">
            <div className="signup-header">
                <img
                    src={ompassDefaultLogoImage}
                />
                <span>OMPASS</span>
            </div>
            <SecurityQuestionLayout questions={questions} onComplete={(a, b, c) => {
                UpdateSecurityQuestionsFunc([
                    {
                        question: questions[0],
                        answer: a
                    },
                    {
                        question: questions[1],
                        answer: b
                    },
                    {
                        question: questions[2],
                        answer: c
                    }
                ], token, () => {
                    message.success(formatMessage({ id: 'SECURITY_QUESTION_UPDATE_SUCCESS_MSG' }))
                    navigate('/', {
                        replace: true
                    })
                })
            }} />
            <div
                className='copyRight-style sign-up'
            >
                {CopyRightText(subdomainInfo)}
            </div>
        </div>
    </>
}

export default SecurityQuestionPage