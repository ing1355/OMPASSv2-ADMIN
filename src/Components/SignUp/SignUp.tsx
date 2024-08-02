import { useState } from "react";
import logoImg from '../../assets/ompassLogoIcon.png'

import { CopyRightText } from "Constants/ConstantValues";
import './SignUp.css'
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

const SignUp = () => {
    const [stepOneComplete, setStepOneComplete] = useState<boolean>(false);

    return (
        <div className="signup-container">
            <div className="signup-header">
                <img
                    src={logoImg}
                />
                <span>OMPASS</span>
            </div>
            {!stepOneComplete ? <FirstStep checkedChange={complete => {
                setStepOneComplete(complete)
            }} /> : <SecondStep />}
            <div
                className='copyRight-style mt30'
            >
                {CopyRightText}
            </div>
        </div>
    )
}

export default SignUp;