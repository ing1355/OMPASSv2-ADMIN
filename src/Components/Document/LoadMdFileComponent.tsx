import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router"
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useSelector } from "react-redux";
import { langConverter } from "Constants/ConstantValues";

type DocumentCategoryType = 'application' | 'start'

type DocumentSubType = ApplicationDataType['type'] | 'app' | 'ompass' | 'signup' | 'login' | 'user' | 'group' | 'passcode' | 'authLog' | 'userLog' | 'application' | 'policy' | 'package' | 'setting' | 'ompass_proxy' | 'web_api'

const pathByApplicationType: {
    [key in string]: string
} = {
    'WEB': 'web',
    'LINUX_LOGIN': 'linux_ssh',
    'RADIUS': 'radius',
    'REDMINE': 'redmine',
    'WINDOWS_LOGIN': 'windows_logon',
    'MICROSOFT_ENTRA_ID': 'ms_entra_id',
    'KEYCLOAK': 'keycloak',
    'LDAP': 'ldap',
    'PORTAL': '',
    'ALL': '',
    'MAC_LOGIN': 'mac_logon',
}

const LoadMdFileComponent = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo!);
    const lang = useSelector((state: ReduxStateType) => state.lang!)
    const [isReady, setIsReady] = useState(false)
    const [data, setData] = useState('')
    const [mTime, setMTime] = useState('')
    const type = useParams().type as DocumentSubType
    const category = useParams().category as DocumentCategoryType
    const startedUrl = useLocation().pathname.startsWith('/docs/user') ? `/docs/${langConverter(lang)}/user` : `/docs/${langConverter(lang)}`
    const navigate = useNavigate()
    
    async function fetchMarkdownFile(url: string) {
        try {
            // GET 요청으로 원격 파일 읽기
            const response = await axios.get(url, {
                responseType: 'text', // 텍스트 형식으로 응답 처리,
                headers: {
                    'Cache-Control': 'no-cache', // 최신 데이터 요청
                    Pragma: 'no-cache',          // 일부 브라우저에서 추가 필요
                    Expires: '0',                // 즉시 만료 처리
                },
            })
            const result = (response.data as string).replace(/<img [^>]*src="(\.\/[^"]*)"[^>]*>/g, (match, p1) => {
                const regex = /[^/]+$/;  // 마지막 슬래시 이후의 문자열을 추출
                const filename = p1.match(regex)[0];
                const newSrc = `${startedUrl}/${category}/${(!startedUrl.includes('/user') && category === 'application') ? pathByApplicationType[type] : type}/${filename}`;
                return match.replace(p1, newSrc);
            })
            if (result.startsWith('<!doctype html>')) {
                navigate((userInfo && userInfo.role !== 'USER') ? "/docs/start/signup" : "/docs/user/start/signup", {
                    replace: true
                })
            } else {
                setData(result)
            }
        } catch (error) {
            console.error('Error fetching the markdown file:', error);
            setIsReady(true)
        }
    }

    async function fetchMTime(url: string) {
        try {
            // GET 요청으로 원격 파일 읽기
            const response = await axios.get(url, {
                responseType: 'text', // 텍스트 형식으로 응답 처리
            });
            if (response.data.startsWith('<!doctype')) {
                // setIsReady(true)
            } else {
                setMTime(response.data)
            }
        } catch (error) {
            console.error('Error fetching the markdown file:', error);
        }
    }

    useEffect(() => {
        // if ((category === 'start' && type === 'ompass') || (category === 'start' && type === 'signup')) {
        //     fetchMarkdownFile(`/docs/user/${category}/${pathByApplicationType[type]}/${pathByApplicationType[type]}.md`)
        //     fetchMTime(`/docs/user/${category}/${pathByApplicationType[type]}/modifyTime`)
        // } else 
        if (category === 'application' && !startedUrl.includes('/user')) {
            if (type) {
                fetchMarkdownFile(`${startedUrl}/${category}/${pathByApplicationType[type]}/${pathByApplicationType[type]}.md`)
                fetchMTime(`${startedUrl}/${category}/${pathByApplicationType[type]}/modifyTime`)
            }
        } else {
            fetchMarkdownFile(`${startedUrl}/${category}/${type}/${type}.md`)
            fetchMTime(`${startedUrl}/${category}/${type}/modifyTime`)
        }
    }, [type, lang])
    
    return <>
        {
            isReady && <div>
                준비중입니다.
            </div>
        }
        {data && <div className="application-docs-modify-time-container">
            <div className="wmde-markdown wmde-markdown-color">
                <h6>
                    Last Modified: {mTime}
                </h6>
            </div>
        </div>}
        {data && <MarkdownPreview source={data} style={{
            padding: '16px 32px 128px 32px',
            overflowY: 'auto',
        }}/>}
    </>
}

export default LoadMdFileComponent