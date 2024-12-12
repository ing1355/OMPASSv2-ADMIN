import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";


const pathByApplicationType: {
    [key in ApplicationDataType['type']]: string
} = {
    'DEFAULT': '',
    'ADMIN': '',
    'ALL': '',
    'LINUX_LOGIN': 'linux_ssh',
    'MAC_LOGIN': '',
    'RADIUS': 'radius',
    'REDMINE': '',
    'WINDOWS_LOGIN': 'windows_logon',
    '': ''
}

const Document = () => {
    const [data, setData] = useState('')
    const params = useParams()
    const applicationType = params.type

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
            console.log(response.data); // 파일 내용을 텍스트로 출력
            setData((response.data as string).replace(/<img [^>]*src="(\.\/[^"]*)"[^>]*>/g, (match, p1) => {
                // './'로 시작하는 상대 경로를 '/docsImage/동적경로/파일명' 형식으로 변경
                // const fileName = path.basename(p1); // 파일명
                // const dirName = path.dirname(p1).split('/').pop(); // 디렉토리 이름 추출
                // const newSrc = `/docsImage/${dirName}/${fileName}`; // 변경된 경로
                // return `![${fileName}](${newSrc})`; // 새 경로로 교체
                const regex = /[^/]+$/;  // 마지막 슬래시 이후의 문자열을 추출
                const filename = p1.match(regex)[0];
                const newSrc = `/docs/${pathByApplicationType[applicationType as ApplicationDataType['type']]}/${filename}`;
                return match.replace(p1, newSrc);
            }))
        } catch (error) {
            console.error('Error fetching the markdown file:', error);
        }
    }

    useEffect(() => {
        fetchMarkdownFile('/docs/windows_logon/windows_logon.md')
    }, [])
    return <>
        {/* <img src={"/docsImage/windows_logon/setup-welcome.png"}/> */}
        {data && <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                img({ ...props }) {
                    console.log(props)
                    return (
                        <img
                            src={props.src}
                        />
                    );
                }
            }}
        >
            {data}
        </ReactMarkdown>}
        {/* {data && <MarkdownEditor.Markdown
            source={data}
            style={{
                padding: '0 40px'
            }}
        />} */}
    </>
}

export default Document