import { CountryCode } from "libphonenumber-js"
import CountryFlag from "./CountryFlag"
import CountryDialCode from "./CountryDialCode"
import useCountry from "hooks/useCountry"

const PhoneWithDialCode = ({ data, countryCode }: { data: string, countryCode: CountryCode }) => {
    const { convertPhoneNumberToFormat } = useCountry()

    
    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
    }}>
        {/* {data && countryCode && <div><CountryFlag countryCode={countryCode as CountryCode} /></div>} */}
        {data && countryCode && <div><CountryDialCode countryCode={countryCode as CountryCode} /></div>}
        {data && !countryCode && <div>&#x2753;</div>}
        <div>{countryCode ? convertPhoneNumberToFormat(data, countryCode) : data || '-'}</div>
    </div>
}

export default PhoneWithDialCode