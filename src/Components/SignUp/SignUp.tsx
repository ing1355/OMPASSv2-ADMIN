import { useState } from "react";

import { CopyRightText, ompassDefaultLogoImage } from "Constants/ConstantValues";
import './SignUp.css'
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import { useSelector } from "react-redux";
import Button from "Components/CommonCustomComponents/Button";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";

const SignUp = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [stepOneComplete, setStepOneComplete] = useState(false);
    const [signUpComplete, setSignUpComplete] = useState(false)
    const navigate = useNavigate()

    return (
        <div className="signup-container">
            <div className="signup-header">
                <img
                    src={ompassDefaultLogoImage}
                />
                <span>OMPASS</span>
            </div>
            {
                signUpComplete ? <div className="signup-content signup-complete">
                    <div>
                        <FormattedMessage id="SIGN_UP_COMPLETE_LABEL_1"/><br />
                        <FormattedMessage id="SIGN_UP_COMPLETE_LABEL_2"/>
                    </div>
                    <Button
                        className={'st6 agree-button signup-complete'}
                        onClick={() => {
                            navigate('/', {
                                replace: true
                            })
                        }}
                    ><FormattedMessage id='GO_TO_LOGIN_PAGE_LABEL' />
                    </Button>
                </div> :
                    (!stepOneComplete ? <FirstStep checkedChange={complete => {
                        setStepOneComplete(complete)
                    }} /> : <SecondStep completeCallback={() => {
                        setSignUpComplete(true)
                    }} />)}
            <div
                className='copyRight-style sign-up'
            >
                {CopyRightText(subdomainInfo)}
            </div>
        </div>
    )
}

export default SignUp;