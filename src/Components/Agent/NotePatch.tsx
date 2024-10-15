import { message } from 'antd';
import './AgentManagement.css';
import Button from "Components/CommonCustomComponents/Button";
import Input from "Components/CommonCustomComponents/Input";
import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader";
import { UpdateAgentInstallerNoteFunc } from 'Functions/ApiFunctions';
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation, useNavigate } from "react-router";

const NotePatch = () => {
    const [inputMemo, setInputMemo] = useState('')
    const navigate = useNavigate();
    const location = useLocation()
    const { fileId, note }: {
        fileId: AgentInstallerDataType['fileId']
        note: AgentInstallerDataType['note']
    } = location.state || {}

    useEffect(() => {
        if (note) {
            setInputMemo(note)
        }
    }, [])

    return <>
        <Contents>
            <ContentsHeader title="VERSION_MANAGEMENT" subTitle={'NOTE_PATCH'}>
                <Button className='st3' onClick={() => {
                    UpdateAgentInstallerNoteFunc(fileId, inputMemo, () => {
                        message.success('메모 수정 성공!')
                        navigate('/AgentManagement', {
                            replace: true
                        });
                    })
                }}>
                    <span><FormattedMessage id='SAVE' /></span>
                </Button>
                <Button className='st1'
                    type='button'
                    onClick={() => {
                        navigate('/AgentManagement', {
                            replace: true
                        });
                    }}
                >
                    <span><FormattedMessage id='GO_BACK' /></span>
                </Button>
            </ContentsHeader>
            <div className="contents-header-container">
                <div className='agent-input-row-container'>
                    <label><FormattedMessage id='MEMO' /></label>
                    <Input
                        className={'st1'}
                        maxLength={96}
                        value={inputMemo}
                        valueChange={value => {
                            setInputMemo(value)
                        }}
                        autoComplete='off'
                    />
                </div>
            </div>
        </Contents>
    </>
}

export default NotePatch