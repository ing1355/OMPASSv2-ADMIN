import { useSelector } from 'react-redux';
import { subdomainInfoChange } from 'Redux/actions/subdomainInfoChange';
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs';
import { DateTimeFormat } from 'Constants/ConstantValues';

dayjs.extend(timezone)
dayjs.extend(utc)

const useDateTime = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo)!;

    const getTimezone = () => {
        return subdomainInfo.timeZone
    }

    const setTimezone = (timezone: string) => {
        subdomainInfoChange({
            ...subdomainInfo,
            timeZone: timezone
        })
    }

    const getDateTimeString = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        const datetimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`

        return datetimeString;
    }

    /** 설정 타임존 기준 현재 시각 (브라우저 로컬 TZ와 무관) */
    const getNowInTimezone = (timezone?: string) => {
        return dayjs().tz(timezone || subdomainInfo.timeZone)
    }

    const convertUTCStringToTimezoneDateString = (date: string, timezone?: string) => {
        return dayjs.utc(date).tz(timezone || subdomainInfo.timeZone).format(DateTimeFormat)
    }

    const convertTimezoneDateStringToUTCString = (date: string, timezone?: string) => {
        return dayjs.tz(date, timezone || subdomainInfo.timeZone).utc().format(DateTimeFormat)
    }

    const isDateTimeString = (value: string) => {
        // YYYY-MM-DD hh:mm:ss
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
    };

    return {
        getTimezone,
        setTimezone,
        getDateTimeString,
        getNowInTimezone,
        convertUTCStringToTimezoneDateString,
        convertTimezoneDateStringToUTCString,
        isDateTimeString
    }
};

export default useDateTime
