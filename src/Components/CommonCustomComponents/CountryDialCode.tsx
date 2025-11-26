import { CountryCode, getCountryCallingCode } from "libphonenumber-js";
import { useSelector } from "react-redux";

const CountryDialCode = ({ countryCode }: { countryCode: CountryCode }) => {
    const lang = useSelector((state: ReduxStateType) => state.lang!)
    if (countryCode === 'KR' && lang === 'KR') {
        return <></>
    } else if (countryCode === 'JP' && lang === 'JP') {
        return <></>
    } else if (countryCode === 'US' && lang === 'EN') {
        return <></>
    } else {
        const dialCode = getCountryCallingCode(countryCode.toUpperCase() as CountryCode)
        return <>+{dialCode}</>
    }

}

export default CountryDialCode