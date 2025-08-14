import { useSelector } from "react-redux";
import { applicationTypes } from "Constants/ConstantValues";

const usePlans = () => {
    const { plan } = useSelector((state: ReduxStateType) => state.subdomainInfo!);

    const isValidateHigherThanFreePlan = () => {
        return !plan?.isExpired || plan?.type !== 'TRIAL_PLAN'
    }

    const isValidateHigherThanBasicPlan = () => {
        return !plan?.isExpired || (plan?.type !== 'TRIAL_PLAN' && plan?.type !== 'LICENSE_PLAN_L1')
    }

    const getApplicationTypesByPlanType = () => {
        if(!isValidateHigherThanBasicPlan()) {
            return applicationTypes.filter(_ => _ === 'PORTAL' || _ === 'WEB')
        } else {
            return applicationTypes
        }
    }

    return {
        isValidateHigherThanFreePlan,
        isValidateHigherThanBasicPlan,
        getApplicationTypesByPlanType
    }
};

export default usePlans