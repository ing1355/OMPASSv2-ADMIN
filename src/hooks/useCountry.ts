import { CountryCode, getCountryCallingCode, getExampleNumber } from "libphonenumber-js"
import examples from "libphonenumber-js/mobile/examples"
import { CountryData } from "react-phone-input-2"
import countries from "i18n-iso-countries";
// 언어 데이터 등록 (필수)
import en from "i18n-iso-countries/langs/en.json";
import ko from "i18n-iso-countries/langs/ko.json";
import ja from "i18n-iso-countries/langs/ja.json";
import { useSelector } from "react-redux";
import { isEmptyObject } from "Functions/GlobalFunctions";
countries.registerLocale(en);
countries.registerLocale(ko);
countries.registerLocale(ja);



export default function useCountry() {
    const lang = useSelector((state: ReduxStateType) => state.lang!)
    const localeForGetName = lang === 'KR' ? 'ko' : lang === 'JP' ? 'ja' : 'en'

    const getCountryDataByCountryCode = (countryCode: CountryCode): CountryData => {
        const dialCode = getCountryCallingCode(countryCode.toUpperCase() as CountryCode)
        return {
            name: countries.getName(countryCode.toUpperCase() as CountryCode, localeForGetName) as string,
            dialCode,
            countryCode: countryCode.toUpperCase() as CountryCode,
            format: `+${dialCode.replace(/[0-9]/g, '.')} ${getExampleNumber(countryCode.toUpperCase() as CountryCode, examples)?.format('NATIONAL').replace(/[0-9]/g, '.')}`,
        }
    }

    const getPlaceholder = (countryData: CountryData) => {
        if(!countryData || isEmptyObject(countryData)) return ''
        const formatWithoutPlus = countryData.format.split(' ').filter((item, ind) => ind !== 0).join(' ')
        // react-phone-input-2의 format을 기반으로 예시 번호 생성
        const format = formatWithoutPlus
        
        // 점(.)의 개수에 따라 동적으로 예시 번호 생성
        const dotCount = (formatWithoutPlus.match(/\./g) || []).length

        // 기본 숫자 패턴 생성 (1부터 시작하는 연속된 숫자)
        let exampleDigits = ''
        for (let i = 1; i <= dotCount; i++) {
            exampleDigits += (i % 10).toString()
        }

        // 포맷에 맞춰 숫자 배치
        let result = ''
        let digitIndex = 0

        for (let i = 0; i < format.length; i++) {
            if (format[i] === '.') {
                result += exampleDigits[digitIndex] || ''
                digitIndex++
            } else {
                result += format[i]
            }
        }

        return result
    }

    const convertPhoneNumberToFormat = (phoneNumber: string, countryCode: CountryCode) => {
        if(!phoneNumber || phoneNumber.includes('-')) return phoneNumber
        const formatWithoutPlus = getCountryDataByCountryCode(countryCode).format.split(' ').filter((item, ind) => ind !== 0).join(' ')
        // react-phone-input-2의 format을 기반으로 예시 번호 생성
        const format = formatWithoutPlus

        // 포맷에 맞춰 숫자 배치
        let result = ''
        let digitIndex = 0

        for (let i = 0; i < format.length; i++) {
            if (format[i] === '.') {
                result += phoneNumber[digitIndex] || ''
                digitIndex++
            } else {
                result += format[i]
            }
        }

        return result
    }

    return {
        getPlaceholder,
        getCountryDataByCountryCode,
        convertPhoneNumberToFormat
    }
}