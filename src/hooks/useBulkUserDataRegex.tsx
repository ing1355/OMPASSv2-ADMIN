import { emailRegex, idRegex, nameRegex, phoneRegex } from "Constants/CommonRegex"
import parsePhoneNumberFromString from "libphonenumber-js"
import { useIntl } from "react-intl"

const makeErrorData = (row: number, key: string, msg: string, value?: string) => {
    return {
        row,
        key,
        msg,
        value
    } as UserRegexErrorDataType
}

const useBulkUserDataRegex = () => {
    const { formatMessage } = useIntl()
    const regexTestBulkUserData = async (datas: DefaultUserDataType[]) => {
        let errorTemp: UserRegexErrorDataType[] = []
        const usernameSet = new Map<string, number>()
        const duplicatedUsernames: string[] = []

        const resultData = datas.map((_, ind) => {
            if (!_.username) {
                errorTemp.push(makeErrorData(ind + 1, 'username', formatMessage({ id: 'PLEASE_INPUT_ID' }), ''))
            } else if (_.username.includes('@')) {
                if (!emailRegex.test(_.username)) {
                    errorTemp.push(makeErrorData(ind + 1, 'username', formatMessage({ id: 'EMAIL_CHECK' }), _.username))
                }
            } else if (!idRegex.test(_.username)) {
                errorTemp.push(makeErrorData(ind + 1, 'username', formatMessage({ id: 'USERNAME_CHECK' }), _.username))
            }
            if (usernameSet.get(_.username)) {
                if (duplicatedUsernames.includes(_.username)) {
                    errorTemp.push(makeErrorData(ind + 1, 'username', formatMessage({ id: 'DUPLICATED_DATA_EXISTS' }), _.username))
                } else {
                    errorTemp.push(makeErrorData(usernameSet.get(_.username)!, 'username', formatMessage({ id: 'DUPLICATED_DATA_EXISTS' }), _.username))
                    errorTemp.push(makeErrorData(ind + 1, 'username', formatMessage({ id: 'DUPLICATED_DATA_EXISTS' }), _.username))
                    duplicatedUsernames.push(_.username)
                }
            } else {
                usernameSet.set(_.username, ind + 1)
            }
            if (_.name.firstName && _.name.firstName.length > 0 && !nameRegex.test(_.name.firstName)) {
                errorTemp.push(makeErrorData(ind + 1, 'firstName', formatMessage({ id: 'FIRST_NAME_CHECK' }), _.name.firstName))
            }
            if (_.name.lastName && _.name.lastName.length > 0 && !nameRegex.test(_.name.lastName)) {
                errorTemp.push(makeErrorData(ind + 1, 'lastName', formatMessage({ id: 'LAST_NAME_CHECK' }), _.name.lastName))
            }
            if (_.email && !emailRegex.test(_.email)) { // 이메일 유효성 검사
                errorTemp.push(makeErrorData(ind + 1, 'email', formatMessage({ id: 'EMAIL_CHECK' }), _.email))
            }
            let phoneTemp: string = ''
            let countryCode: string | undefined = undefined
            if (_.phone) {
                phoneTemp = _.phone.replace(/\s/g, '')

                if (phoneTemp.length > 0 && !phoneRegex.test(phoneTemp)) { // 길이 검사
                    errorTemp.push(makeErrorData(ind + 1, 'phone', formatMessage({ id: 'PHONE_NUMBER_LENGTH_CHECK' }), _.phone))
                } else {
                    if (phoneTemp.includes('+')) { // + 포함 시 국가 코드 추출
                        const phoneNumber = parsePhoneNumberFromString(phoneTemp)
                        if (phoneNumber?.isValid()) { // 유효성 검사
                            phoneTemp = phoneNumber?.formatNational() // 전화번호 저장
                            countryCode = phoneNumber?.country?.toLowerCase() // 국가 코드 저장
                        } else {
                            errorTemp.push(makeErrorData(ind + 1, 'phone', formatMessage({ id: 'PHONE_NUMBER_INVALID' }), _.phone)) // 유효성 검사 실패 시 에러 저장
                        }
                    }
                }
            }
            return {
                username: _.username,
                name: _.name,
                email: _.email,
                phone: phoneTemp?.replace(/\-/g, ''),
                countryCode: countryCode,
                role: _.role
            }
        }); // 데이터 저장

        if (errorTemp.length > 0) {
            return Promise.reject(errorTemp)
        }
        return Promise.resolve(resultData)
    }

    return {
        regexTestBulkUserData
    }
}

export default useBulkUserDataRegex