import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "./CustomDropdown"
import { saveLocaleToLocalStorage } from "Functions/GlobalFunctions";
import { langChange } from "Redux/actions/langChange";
import locale_image from '../../assets/locale_image.png';
import { message } from "antd";
import './LocaleChange.css'

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
                label: 'KO',
                value: 'KR'
            },
            {
                label: 'EN',
                value: 'EN'
            },
            {
                label: 'JP',
                value: 'JP'
            }
        ]}>
            <div className='header-locale-inner-container'>
                <img src={locale_image} />
                <span>
                    {lang === 'KR' ? 'KO' : lang}
                </span>
            </div>
        </CustomDropdown>
    </>
}

export default LocaleChange