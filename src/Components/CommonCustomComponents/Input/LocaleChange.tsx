import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "./CustomDropdown"
import { saveLocaleToLocalStorage } from "Functions/GlobalFunctions";
import { langChange } from "Redux/actions/langChange";
import locale_image from '@assets/locale_image.png';
import './LocaleChange.css'
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const localeLabel = (locale: LanguageType) => {
    if(locale === 'EN') return 'English'
    else if(locale === 'JP') return '日本語'
    else return '한국어'
}

const homepageLocaleMap = {
    'ko': 'KR',
    'en': 'EN',
    'ja': 'JP'
} as { [key: string]: LanguageType }

const LocaleChange = () => {
    const [searchParams] = useSearchParams()
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const dispatch = useDispatch()
    const languageCallback = (language: LanguageType) => {
        dispatch(langChange(language));
        saveLocaleToLocalStorage(language)
    }

    useEffect(() => {
        const locale = searchParams.get('locale')
        if(locale && homepageLocaleMap[locale as keyof typeof homepageLocaleMap]) {
            languageCallback(homepageLocaleMap[locale as keyof typeof homepageLocaleMap] as LanguageType)
        }
    },[])

    return <>
        <CustomDropdown onChange={val => {
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