import useCountry from "hooks/useCountry";
import { CountryCode } from "libphonenumber-js";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import PhoneInput2, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import './PhoneInput.css'
import ko from 'react-phone-input-2/lang/ko.json'
import jp from 'react-phone-input-2/lang/jp.json'
import { isEmptyObject } from "Functions/GlobalFunctions";

interface PhoneInputProps {
    value?: string
    countryCode?: UserDataType['countryCode']
    onChange: (value: string, countryCode: CountryCode) => void
    setIsValid: (isValid: boolean) => void
    examplePosition: 'top' | 'bottom'
}

const countryCodeByLang: { [key in LanguageType]: CountryCode } = {
    KR: 'KR',
    EN: 'US',
    JP: 'JP'
}

const phoneLocales = {
    KR: ko,
    EN: {},
    JP: jp,
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ countryCode, onChange, setIsValid, examplePosition, value }, ref) => {
    const [internalValue, setInternalValue] = useState('')
    const { getPlaceholder } = useCountry()
    const lang = useSelector((state: ReduxStateType) => state.lang!)
    
    // react-phone-input-2의 내장 국가 데이터 사용
    const [country, setCountry] = useState<CountryData>(() => {
        const defaultCountryCode = countryCodeByLang[lang].toLowerCase()
        // react-phone-input-2의 기본 국가 데이터 사용
        return {
            name: defaultCountryCode === 'kr' ? 'South Korea' : defaultCountryCode === 'us' ? 'United States' : 'Japan',
            dialCode: defaultCountryCode === 'kr' ? '82' : defaultCountryCode === 'us' ? '1' : '81',
            countryCode: defaultCountryCode,
            format: defaultCountryCode === 'kr' ? '+.. ... .... ....' : defaultCountryCode === 'us' ? '+. (...) ...-....' : '+.. .. .... ....'
        }
    })
    const [countryCodeState, setCountryCodeState] = useState<CountryCode | undefined>(!value ? undefined : (countryCode ? (countryCode ?? country.countryCode) as CountryCode : undefined))
    const isFirstMount = useRef(true)
    
    const localization = useMemo(
        () => phoneLocales[lang] || phoneLocales.EN,
        [lang]
    );

    useEffect(() => {
        if(countryCode) {
            setCountryCodeState(countryCode as CountryCode)
        }
    },[countryCode])

    // value prop이 변경될 때 internalValue 업데이트
    useEffect(() => {
        setTimeout(() => {
            setInternalValue(value || '')
        }, 10);
    }, [value])
    
    // react-phone-input-2의 내장 format을 활용한 검증
    const validatePhoneFormat = (phoneValue: string, countryData: CountryData) => {
        if (!phoneValue || isEmptyObject(countryData)) return true // 빈 값은 유효
        if (phoneValue === countryData.dialCode) return true

        // react-phone-input-2의 format 패턴을 활용
        // format 예시: "+.. ... .... ...." (한국), "+. (...) ...-...." (미국)
        const format = countryData.format
        const withoutPlusFormat = format.split(' ').filter((item, ind) => ind !== 0).join(' ')
        
        // format에서 숫자 자리수 계산 (점의 개수)
        const digitCount = (withoutPlusFormat.match(/\./g) || []).length
        
        // 입력된 전화번호에서 숫자만 추출
        const phoneDigits = phoneValue.replace(/\D/g, '')
        // 전체 자리수가 format에 맞는지 확인
        return phoneDigits.length === digitCount
    }

    const handleChange = (value: string, countryData: CountryData) => {
        // format 검증
        const isValidFormat = validatePhoneFormat(value, countryData)
        setIsValid(isValidFormat)
        setCountry(countryData)
        setCountryCodeState(countryData.countryCode as CountryCode)
        onChange(value, countryData.countryCode as CountryCode)
    }

    const Example = () => {
        return <div style={{
            fontSize: '.8rem',
            margin: examplePosition === 'top' ? '0 0 .3rem 0' : '.3rem 0 0 0',
            paddingLeft: examplePosition === 'top' ? '.7rem' : 0
        }}>
            <FormattedMessage id="PHONE_NUMBER_EXAMPLE_LABEL" />: {getPlaceholder(country)}
        </div>
    }

    return (
        <div>
            {examplePosition === 'top' && <Example />}
            <PhoneInput2
                key={`${lang}-${country}`}
                country={countryCodeState}
                onChange={handleChange}
                onMount={(_, countryData) => {
                    if(isFirstMount.current) {
                        isFirstMount.current = false
                        setCountry(countryData as CountryData)
                    }
                }}
                inputProps={{
                    ref,
                    name: 'phone'
                }}
                value={internalValue}
                buttonStyle={{ background: 'none', border: 'none' }}
                placeholder={getPlaceholder(country)}
                localization={localization}
                disableCountryGuess
                disableCountryCode
                enableSearch
                inputStyle={{
                    width: examplePosition === 'top' ? '100%' : '406px',
                    textAlign: 'start',
                    height: examplePosition === 'top' ? '40px' : '36px'
                }}
            />
            {examplePosition === 'bottom' && <Example />}
        </div>
    )
})

export default PhoneInput;