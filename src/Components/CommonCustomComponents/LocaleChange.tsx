import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "./CustomDropdown"
import { saveLocaleToLocalStorage } from "Functions/GlobalFunctions";
import { langChange } from "Redux/actions/langChange";
import locale_image from '../../assets/locale_image.png';
import { message } from "antd";
import './LocaleChange.css'

const localeLabel = (locale: LocaleType) => {
    if(locale === 'EN') return 'English'
    else if(locale === 'JP') return '日本語'
    else return '한국어'
}

const LocaleChange = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const dispatch = useDispatch()
    const languageCallback = (language: LanguageType) => {
        dispatch(langChange(language));
        saveLocaleToLocalStorage(language)
    }

    return <>
        <CustomDropdown onChange={val => {
            if(val === 'JP') return message.info("일본어는 아직 준비중입니다.")
            languageCallback(val)
        }} items={[
            {
                label: localeLabel('KR'),
                value: 'KR'
            },
            {
                label: localeLabel('EN'),
                value: 'EN'
            },
            {
                label: localeLabel('JP'),
                value: 'JP',
                style: {
                    fontFamily: 'Noto Sans JP'
                }
            }
        ]}>
            <div className='header-locale-inner-container'>
                <img src={locale_image} />
                <span>
                    {localeLabel(lang)}
                </span>
            </div>
        </CustomDropdown>
    </>
}

export default LocaleChange