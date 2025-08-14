import { browser_json, os_json } from "Constants/ClientInfoValue";

let _navigator: Navigator & {
    userAgentData?: {
        brands: {
            brand: string
            version: string
        }[]
        mobile: boolean
        platform: string
        getHighEntropyValues: any
    };
} = navigator

export async function DeviceInfo() {
    const ua = _navigator.userAgent;
    const info: ClientInfoType = {
        os: {
            name: '',
            version: ''
        },
        gpu: '',
        browser: '',
        ip: ''
    }

    const getVideoCardInfo = () => {
        const canvas = document.createElement('canvas');
        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext
        if (!gl) {
            info.gpu = "no webgl";
        }
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            info.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        } else {
            info.gpu = "no WEBGL_debug_renderer_info";
        }
    }

    const getOsInfo = () => {
        for (const operatingSystem of os_json) {
            const match = uaParser(operatingSystem.regex, ua);
            if (!match) continue;
            info.os.name = variable_replacement(operatingSystem.name, match);
            if (info.os.name === 'Windows' && _navigator.userAgentData) {
                _navigator.userAgentData.getHighEntropyValues(["platformVersion"]).then((_ua: any) => {
                    const majorPlatformVersion = parseInt(_ua.platformVersion.split('.')[0])
                    if (majorPlatformVersion >= 13) {
                        info.os.version = (11).toString();
                    } else {
                        info.os.version = formatVersion(variable_replacement(operatingSystem.version, match), 1);
                    }
                })
            } else {
                info.os.version = formatVersion(variable_replacement(operatingSystem.version, match), 1);
            }
            if (info.os.name === "lubuntu") {
                info.os.name = "Lubuntu";
            }
            if (info.os.name === "debian") {
                info.os.name = "Debian";
            }
            if (info.os.name === "YunOS") {
                info.os.name = "YunOs";
            }
            return;
        }
    }

    const getBrowserInfo = () => {
        for (const browser of browser_json) {
            const match = uaParser(browser.regex, ua);
            if (!match) continue;
            const isMobile = uaParser('(?:Mobile)', ua);
            const result = variable_replacement(browser.name, match);
            info.browser = result + (isMobile && !result.includes('Mobile') ? ' Mobile' : '');
            info.browser = info.browser.replace("Samsung Browser Mobile", "Samsung Browser")
            info.browser = info.browser.replace(/\s/g, '_').toUpperCase()
            return;
        }
    }

    const getRegexInstance = (rawRegex: string) => {
        // 잘못된 수량자 패턴을 감지하고 수정
        const fixedRegex = rawRegex.replace(/(\+\+|\*\*|\?\?)/g, ""); // ++, **, ?? 제거
        const regexInstance = RegExp(`(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(?:${fixedRegex})`, "i");
        return regexInstance;
    };
    // const getRegexInstance = (rawRegex: string) => {
    //     const regexInstance = RegExp(`(?:^|[^A-Z0-9-_]|[^A-Z0-9-]_|sprd-)(?:${rawRegex})`, "i");
    //     return regexInstance;
    // };

    // const variable_replacement = (template: string, variables: string[]) => {
    //     const regex = new RegExp(`\\$\\d`, "g");
    //     if (template === null)
    //         return "";
    //     return template.replace(regex, (match) => {
    //         const index = parseInt(match.substr(1), 10);
    //         const variable = variables[index - 1];
    //         return variable || "";
    //     });
    // }
    const variable_replacement = (template: string, variables: string[]) => {
        if (!template) return "";
        return template.replace(/\$\d/g, (match) => {
            const index = parseInt(match.substr(1), 10);
            return variables[index - 1] || "";
        }).replace(/\+\+/g, "").replace(/\?\?/g, ""); // 추가된 방어 로직
    };

    const fixLookbehind = (regexStr: string) => {
        return regexStr.replace(/\(\?<=.+?\)/g, "").replace(/\(\?<!.+?\)/g, "");
    };

    const uaParser = (_rawRegex: string, userAgent: string): string[] | null => {
        const rawRegex = fixLookbehind(_rawRegex)
        try {
            const regexInstance = getRegexInstance(rawRegex);
            const match = regexInstance.exec(userAgent);
            return match ? match.slice(1) : null;
        }
        catch (_a) {
            return null;
        }
    }

    const formatVersion = (version: string, versionTruncation: number) => {
        if (version === undefined)
            return "";
        const versionString = _trim(version, ". ").replace(new RegExp("_", "g"), ".");
        const versionParts = versionString.split(".");
        // Return if the string is not only digits once we removed the dots
        if (!/^\d+$/.test(versionParts.join(""))) {
            return versionString;
        }
        if (versionTruncation !== 0) {
            if (Number.isInteger(parseFloat(versionString))) {
                return parseInt(versionString, 10).toFixed(1);
            }
        }
        if (versionParts.length > 1) {
            if (versionTruncation !== null) {
                return versionParts.slice(0, versionTruncation + 1).join(".");
            }
        }
        return versionString;
    };

    const _trim = (str: string, char: string) => {
        return str.replace(new RegExp("^[" + char + "]+|[" + char + "]+$", "g"), "");
    };

    getOsInfo();
    getVideoCardInfo();
    getBrowserInfo();
    const conn = new RTCPeerConnection()
    conn.createDataChannel('')
    conn.setLocalDescription(await conn.createOffer())
    info.ip = await new Promise((resolve, reject) => {
        conn.onicecandidate = ice => {
            if (ice && ice.candidate && ice.candidate.candidate) {
                resolve(ice.candidate.candidate.split(' ')[4])
                conn.close()
            } else {
                resolve('')
                conn.close()
                console.log('ip 획득 실패')
            }
        }
    })
    return info;
}