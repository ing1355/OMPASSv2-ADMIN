import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Contents from 'Components/Layout/Contents';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import { PatchSessionTokenFunc, UploadAgentInstallerFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';
import uploadIconHover from '../../assets/uploadIconHover.png'
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from 'Components/Modal/CustomModal';
import { userInfoChange } from 'Redux/actions/userChange';
import { setStorageAuth } from 'Functions/GlobalFunctions';
import { sessionCheckChange } from 'Redux/actions/sessionInfoChange';

const VersionUpload = () => {
  const { sessionInfo } = useSelector((state: ReduxStateType) => ({
    sessionInfo: state.sessionInfo!
  }))
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [showSession, setShowSession] = useState(false)
  const [inputMemo, setInputMemo] = useState('')
  const [inputHash, setInputHash] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [inputFile, setInputFile] = useState<File>()
  const { formatMessage } = useIntl();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      setInputFile(fileInput.files[0])
    }
  };
  
  const completeCallback = () => {
    setShowSession(false)
    const maxFileSize = 200 * 1024 * 1024;
    const fileExtension = inputFile?.name.split('.').pop();
    
    if (!inputHash) {
      return message.error(formatMessage({ id: 'PLEASE_INPUT_HASH' }));
    } else if (!inputFile) {
      return message.error(formatMessage({ id: 'PLEASE_UPLOAD_INPUT_FILE' }))
    } else if (inputFile.size > maxFileSize) {
      return message.error(formatMessage({ id: 'THE_FILE_SIZE_EXCEEDS_200MB' }));
    } else if (fileExtension !== 'zip') {
      return message.error(formatMessage({ id: 'ONLY_ZIP_FILES_CAN_BE_UPLOADED' }));
    }
    
    if(sessionInfo.time < 30) {
      return setShowSession(true) 
    }

    setIsUploadingFile(true);
    UploadAgentInstallerFunc({
      "metaData.hash": inputHash,
      "metaData.os": "Windows",
      // "metaData.version": inputVersion,
      "metaData.note": inputMemo,
      multipartFile: inputFile,
    }, () => {
      navigate(-1);
    }).finally(() => {
      setIsUploadingFile(false)
      setShowSession(false)
    })
  }

  const refreshCallback = () => {
    return PatchSessionTokenFunc((res, token) => {
      setStorageAuth(token)
      dispatch(userInfoChange(token))
      dispatch(sessionCheckChange(false))
      setShowSession(false)
      setRefresh(true)
      message.success("세션 갱신에 성공하였습니다.")
    })
  }

  useEffect(() => {
    if(refresh) {
      completeCallback()
      setRefresh(false)
    }
  },[refresh])

  return (
    <>
      <Contents>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle='VERSION_LIST'>
          <Button className='st3'
            type={!isUploadingFile ? "submit" : "button"}
            form={!isUploadingFile ? 'addVersionForm' : ''}
            loading={isUploadingFile}
          >
            <span><FormattedMessage id={isUploadingFile ? 'LOADING' : 'SAVE'} /></span>
          </Button>
          {/* <Button className='st1'
            type='button'
            disabled={isUploadingFile}
            onClick={() => {
              if (!isUploadingFile) {
                navigate(-1);
              }
            }}
          >
            <span><FormattedMessage id='GO_BACK' /></span>
          </Button> */}
        </ContentsHeader>
        <div className="contents-header-container">
          <form
            id='addVersionForm'
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              completeCallback()
            }}
          >
            <div className='agent-input-row-container'>
              <label><FormattedMessage id='MEMO' /></label>
              <Input
                className={'st1'}
                maxLength={192}
                value={inputMemo}
                valueChange={value => {
                  setInputMemo(value)
                }}
                autoComplete='off'
              />
            </div>
            <div className='agent-input-row-container'>
              <label><FormattedMessage id='HASH' /></label>
              <Input
                className="st1"
                autoComplete='off'
                value={inputHash}
                valueChange={value => {
                  setInputHash(value)
                }}
              />
            </div>
            <div>
              <label><FormattedMessage id='FILE_UPLOAD' /></label>
              <div className='agent-input-row-container'>
                <Button className='st1' icon={uploadIconHover} onClick={() => {
                  document.getElementById("uploadFile")?.click()
                }}>
                  <FormattedMessage id='SELECT_FILE' />
                </Button>
                {inputFile ? inputFile.name : ''}
                <Input
                  id="uploadFile"
                  name="uploadFile"
                  type="file"
                  accept=".zip"
                  hidden
                  onChange={handleFileChange} />
              </div>
            </div>
          </form>
        </div>
      </Contents>
      <CustomModal
        open={showSession}
        onCancel={() => {
          setShowSession(false);
        }}
        type="warning"
        typeTitle='세션 만료'
        typeContent={<>
          로그인 세션 시간이 얼마 남지 않았습니다.<br />
          업로드 시간에 따라 요청이 올바르게 종료되지 않을 수 있습니다.<br />
          로그인 세션을 연장하고 계속하시겠습니까?
        </>}
        noClose
        yesOrNo
        okCallback={async () => {
          return refreshCallback()
        }} buttonLoading />
    </>
  )
}

export default VersionUpload