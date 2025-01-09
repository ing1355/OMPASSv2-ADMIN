import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import MarkdownPreview from '@uiw/react-markdown-preview'

const pathByApplicationType: {
    [key in ApplicationDataType['type']]: string
} = {
    'DEFAULT': 'web',
    'LINUX_LOGIN': 'linux_ssh',
    'RADIUS': 'radius',
    'REDMINE': 'redmine',
    'WINDOWS_LOGIN': 'windows_logon',
    'ADMIN': '',
    'ALL': '',
    'MAC_LOGIN': '',
    '': ''
}

const LoadMdFileComponent = () => {
    const [data, setData] = useState('')
    const [mTime, setMTime] = useState('')
    const type = useParams().type as ApplicationDataType['type']
    const transformImgSrc = (imgSrc: string | undefined) => {
        // 상대 경로에서 'test.png'를 '/docsImage/.../test.png' 형식으로 변환
        if (imgSrc?.startsWith('./')) {
            console.log(imgSrc)
            //   return `/docsImage//${fileName}`;
        }
        return imgSrc;
    };

    async function fetchMarkdownFile(url: string) {
        try {
            // GET 요청으로 원격 파일 읽기
            const response = await axios.get(url, {
                responseType: 'text', // 텍스트 형식으로 응답 처리
            });
            console.log(response.data)
            // console.log(response.data); // 파일 내용을 텍스트로 출력
            const result = (response.data as string).replace(/<img [^>]*src="(\.\/[^"]*)"[^>]*>/g, (match, p1) => {
                const regex = /[^/]+$/;  // 마지막 슬래시 이후의 문자열을 추출
                const filename = p1.match(regex)[0];
                const newSrc = `/docs/${pathByApplicationType[type]}/${filename}`;
                return match.replace(p1, newSrc);
            })

            setData(result)
        } catch (error) {
            console.error('Error fetching the markdown file:', error);
        }
    }

    async function fetchMTime(url: string) {
        try {
            // GET 요청으로 원격 파일 읽기
            const response = await axios.get(url, {
                responseType: 'text', // 텍스트 형식으로 응답 처리
            });
            setMTime(response.data)
        } catch (error) {
            console.error('Error fetching the markdown file:', error);
        }
    }

    useEffect(() => {
        if (type) {
            fetchMarkdownFile(`/docs/${pathByApplicationType[type]}/${pathByApplicationType[type]}.md`)
            fetchMTime(`/docs/${pathByApplicationType[type]}/modifyTime`)
        }
    }, [type])

    return <>
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
        }} />}
    </>
}

export default LoadMdFileComponent