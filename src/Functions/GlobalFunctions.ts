import { ReduxStateType } from "Types/ReduxStateTypes";
import jwtDecode from "jwt-decode";
import { UserDataType } from "./ApiFunctions";

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

export const saveLocaleToLocalStorage = (locale: ReduxStateType['lang'] = "KR") => {
    localStorage.setItem('locale',locale);
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