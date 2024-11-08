import { ompassDefaultLogoImage } from "Constants/ConstantValues";
import jwtDecode from "jwt-decode";

export const getStorageAuth = () => localStorage.getItem('Authorization')
export const setStorageAuth = (token: string) => localStorage.setItem('Authorization', token)
export const removeStorageAuth = () => localStorage.removeItem('Authorization')

export const saveLocaleToLocalStorage = (locale: ReduxStateType['lang'] = "KR") => {
    localStorage.setItem('locale', locale);
}

export const pad2Digit = (value: number) => {
    return value.toString().padStart(2, '0')
}

export const createRandom1Digit = () => {
    return Math.floor(Math.random() * 10).toString()
}

export const getDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const dateString = `${year}-${month}-${day}`

    return dateString;
}

export const getDateTimeString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    const datetimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`

    return datetimeString;
}

export const convertKSTToUTC = (date: Date) => {
    var temp = new Date(date);
    temp.setDate(date.getDate() - 1);
    temp.setHours(date.getHours() + 15);
    return temp;
}

export const convertUTCToKST = (date: Date) => {
    var temp = new Date(date);
    temp.setHours(date.getHours() + 9);
    return temp;
}

export const convertUTCStringToKSTString = (date: string) => {
    return getDateTimeString(convertUTCToKST(new Date(date)))
}

export const convertKSTStringToUTCString = (date: string) => {
    return getDateTimeString(convertKSTToUTC(new Date(date)))
}

export const slicePrice = (price: string | number) => {
    const _price = price + "";
    if (_price.length < 4) return _price;
    else {
        const result = [];
        for (var i = 0; i < _price.length / 3; i++) {
            if (_price.length % 3 === 0)
                result.push(_price.substring(i * 3, i * 3 + 3));
            else {
                if (i === 0) result.push(_price.substring(0, _price.length % 3));
                else
                    result.push(
                        _price.substring(
                            (i - 1) * 3 + (_price.length % 3),
                            (i - 1) * 3 + (_price.length % 3) + 3
                        )
                    );
            }
        }
        return result.join(",");
    }
};

export const parseJwtToken = (token: string) => {
    return (jwtDecode(token) as {
        exp: number,
        data: {
            tanantId: string
            user: UserDataType
        }
    }).data.user
}

export const autoHypenPhoneFun = (phone: string) => {
    let str = phone.replace(/[^0-9]/g, '');
    var tmp = '';
    if (str.length < 4) {
        return str;
    } else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    } else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }
};

export const convertBase64FromClientToServerFormat = (b64str: string) => {
    return b64str.startsWith('data:image') ? b64str.split(',')[1] : b64str
}

export const createOSInfo = (os?: OSInfoType) => {
    return os ? `${os.name} ${os.version}` : 'Unknown'
}

export const logoImageWithDefaultImage = (img: logoImageType) => {
    if (img.isDefaultImage) return ompassDefaultLogoImage
    else return img.url
}

export const convertTimeFormat = (time: number) => {
    let minute = 0;
    let second = 0;
    let hours = 0;
    if (time >= 3600) {
        hours = Math.floor(time / 3600);
        minute = Math.floor((time % 3600) / 60);
        second = parseInt((time % 60).toString().padStart(2, "0"));
    } else if (time >= 60) {
        minute = Math.floor(time / 60);
        second = parseInt((time % 60).toString().padStart(2, "0"));
    } else {
        second = time;
    }
    if (hours) {
        return {hours, minute, second}
    } else if (minute) {
        return { minute, second };
    } else {
        return { second };
    }
};