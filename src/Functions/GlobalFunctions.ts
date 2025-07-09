import { ompassDefaultLogoImage } from "Constants/ConstantValues";
import jwtDecode from "jwt-decode";

export const getStorageAuth = () => localStorage.getItem('Authorization')
export const setStorageAuth = (token: string) => localStorage.setItem('Authorization', token)
export const removeStorageAuth = () => localStorage.removeItem('Authorization')

export const getCircledNumber = (index: number) => {
    // ①(U+2460) ~ ⑳(U+2473)까지 1~20
    if (index >= 0 && index < 20) {
        return String.fromCharCode(0x2460 + index);
    }
    return index + 1; // 범위 밖이면 일반 숫자
}

export const saveLocaleToLocalStorage = (locale: ReduxStateType['lang'] = "KR") => {
    localStorage.setItem('locale', locale);
}

export const pad2Digit = (value: number) => {
    return value.toString().padStart(2, '0')
}

export const createRandom1Digit = () => {
    return Math.floor(Math.random() * 10).toString()
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
    try {
        return (jwtDecode(token) as {
            exp: number,
            data: {
                tanantId: string
                user: UserDataType
            }
        }).data.user
    } catch (e) {
        console.log('parse jwt error ', e)
        return null
    }
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

function convertImageToBase64Sync(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imagePath;

        image.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            context!.drawImage(image, 0, 0);

            const base64String = canvas.toDataURL("image/png");
            resolve(base64String); // 동기적으로 결과 반환
        };

        image.onerror = function (error) {
            reject("이미지 로딩 실패");
        };
    });
}

export const convertBase64FromClientToServerFormat = async (b64str: string): Promise<string> => {
    if (b64str.startsWith('/static')) {
        let temp = await convertImageToBase64Sync(b64str)
        return temp.startsWith('data:image') ? temp.split(',')[1] : temp
    } else {
        return b64str.startsWith('data:image') ? b64str.split(',')[1] : b64str
    }
}

export const convertBase64FromServerFormatToClient = (str: string) => {
    return str.startsWith('data:image') ? str : ('data:image/png;base64,' + str)
}

export const createOSInfo = (os?: OSInfoType) => {
    return os ? `${os.name} ${os.version}` : '-'
}

export const logoImageWithDefaultImage = (img: logoImageType) => {
    if (!img || img.isDefaultImage) return ompassDefaultLogoImage
    else return img.url
}

// export const convertTimeFormat = (time: number) => {
//     let minute = 0;
//     let second = 0;
//     let hours = 0;
//     if (time >= 3600) {
//         hours = Math.floor(time / 3600);
//         minute = Math.floor((time % 3600) / 60);
//         second = time % 60;
//     } else if (time >= 60) {
//         minute = Math.floor(time / 60);
//         second = time % 60;
//     } else {
//         second = time;
//     }
//     if (hours) {
//         return {hours, minute, second}
//     } else if (minute) {
//         return { minute, second };
//     } else {
//         return { second };
//     }
// };

export const convertTimeFormat = (time: number) => {
    let minute = 0;
    let second = 0;
    if (time >= 60) {
        minute = Math.floor(time / 60);
        second = parseInt((time % 60).toString().padStart(2, "0"));
    } else {
        second = time;
    }
    if (minute) {
        return { minute, second };
    } else {
        return { second };
    }
};

export const downloadFileByLink = (link?: string, fileName?: string) => {
    if (link) {
        const downloadLink = document.createElement('a');
        downloadLink.href = link
        if (fileName) downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}

function getIpBytes(ip: string) {
    return ip.split('.').map(Number);
}

export function isValidIpRange(range: string) {
    const parts = range.split('-');
    if (parts.length === 2) {
        const start = getIpBytes(parts[0]);
        const end = getIpBytes(parts[1]);
        if (start.length !== 4 || start.length !== end.length) {
            return false;
        }

        for (let i = 0; i < 4; i++) {
            if (start[i] < end[i]) return true;
            if (start[i] > end[i]) return false;
        }

        return true;
    }
    return false;
}

export function arraysHaveSameElements(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) return false;

    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();

    return sorted1.every((value, index) => value === sorted2[index]);
}