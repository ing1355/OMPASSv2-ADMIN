import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Contents from 'Components/Layout/Contents';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import { PatchSessionTokenFunc, UploadAgentInstallerFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';
import uploadIconHover from '@assets/uploadIconHover.png'
import { useDispatch, useSelector } from 'react-redux';
import CustomModal from 'Components/Modal/CustomModal';
import { userInfoChange } from 'Redux/actions/userChange';
import { setStorageAuth } from 'Functions/GlobalFunctions';
import { sessionCheckChange } from 'Redux/actions/sessionInfoChange';
import { subdomainInfoChange } from 'Redux/actions/subdomainInfoChange';
import AgentTitleByType from './AgentTitleByType';
import { maxLengthByType } from 'Constants/ConstantValues';
import useCustomRoute from 'hooks/useCustomRoute';

const VersionUpload = () => {
  const sessionInfo = useSelector((state: ReduxStateType) => state.sessionInfo!);
  const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [showSession, setShowSession] = useState(false)
  const [inputMemo, setInputMemo] = useState('')
  const [inputHash, setInputHash] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [inputFile, setInputFile] = useState<File>()
  const inputMemoRef = useRef<HTMLInputElement>(null)
  const inputHashRef = useRef<HTMLInputElement>(null)
  const { formatMessage } = useIntl();
  const dispatch = useDispatch()
  const type: AgentType = useParams().type as AgentType
  const { goBack } = useCustomRoute()
  
  const fileExtensionByType = () => {
    if (type === 'WINDOWS_LOGIN') {
      return ".zip"
    } else if (type === 'OMPASS_PROXY') {
      return ".zip"
    } else if (type === 'LINUX_PAM') {
      return ".deb"
    } else if (type === 'KEYCLOAK_PLUGIN') {
      return ".jar"
    } else if (type === 'REDMINE_PLUGIN') {
      return ".zip"
    } else if (type === 'WINDOWS_FRAMEWORK') {
      return ".nupkg"
    } else if (type === 'MAC_LOGIN') {
      return ".zip"
    } else return ''
  }

  const fileExtensionErrorMsgByType = () => {
    if (type === 'WINDOWS_LOGIN') {
      return "ONLY_ZIP_FILES_CAN_BE_UPLOADED"
    } else if (type === 'OMPASS_PROXY') {
      return "ONLY_ZIP_FILES_CAN_BE_UPLOADED"
    } else if (type === 'LINUX_PAM') {
      return "ONLY_DEB_FILES_CAN_BE_UPLOADED"
    } else if (type === 'WINDOWS_FRAMEWORK') {
      return "ONLY_NUPKG_FILES_CAN_BE_UPLOADED"
    } else if (type === 'MAC_LOGIN') {
      return "ONLY_ZIP_FILES_CAN_BE_UPLOADED"
    } else return ''
  }

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
      message.error(formatMessage({ id: 'PLEASE_INPUT_HASH' }));
      inputHashRef.current?.focus()
      return
    } else if (!inputFile) {
      return message.error(formatMessage({ id: 'PLEASE_UPLOAD_INPUT_FILE' }))
    } else if (inputFile.size > maxFileSize) {
      return message.error(formatMessage({ id: 'THE_FILE_SIZE_EXCEEDS_200MB' }));
    } else if (fileExtension !== fileExtensionByType().slice(1,)) {
      return message.error(formatMessage({ id: fileExtensionErrorMsgByType() }));
    }

    if (sessionInfo.time < 30) {
      return setShowSession(true)
    }

    setIsUploadingFile(true);
    UploadAgentInstallerFunc({
      type,
      "metaData.hash": inputHash,
      // "metaData.version": inputVersion,
      "metaData.description": inputMemo,
      multipartFile: inputFile,
    }, (newData) => {
      if(!subdomainInfo.windowsAgentUrl && type === 'WINDOWS_LOGIN') {
        dispatch(subdomainInfoChange({
          ...subdomainInfo,
          windowsAgentUrl: newData.downloadUrl
        }))
      } else if(!subdomainInfo.linuxPamDownloadUrl && type === 'LINUX_PAM') {
        dispatch(subdomainInfoChange({
          ...subdomainInfo,
          linuxPamDownloadUrl: newData.downloadUrl
        }))
      } else if(!subdomainInfo.ompassProxyDownloadUrl && type === 'OMPASS_PROXY') {
        dispatch(subdomainInfoChange({
          ...subdomainInfo,
          ompassProxyDownloadUrl: newData.downloadUrl
        }))
      } else if(!subdomainInfo.macOsAgentUrl && type === 'MAC_LOGIN') {
        dispatch(subdomainInfoChange({
          ...subdomainInfo,
          macOsAgentUrl: newData.downloadUrl
        }))
      }
      goBack()
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

      message.success(formatMessage({ id: 'SESSION_RENEWAL_SUCCESS_MSG' }))
    })
  }

  useEffect(() => {
    if (refresh) {
      completeCallback()
      setRefresh(false)
    }
  }, [refresh])

  return (
    <>
      <Contents>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle={<AgentTitleByType type={type}/>}>
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
                ref={inputMemoRef}
                className={'st1'}
                maxLength={maxLengthByType('description')}
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
                ref={inputHashRef}
                className="st1"
                autoComplete='off'
                value={inputHash}
                maxLength={64}
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
                  accept={fileExtensionByType()}
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
        typeTitle={<FormattedMessage id="SESSION_EXPIRE_MODAL_TITLE"/>}
        typeContent={<>
          <FormattedMessage id="SESSION_EXPIRE_MODAL_SUBSCRIPTION_1"/><br />
          <FormattedMessage id="SESSION_EXPIRE_MODAL_SUBSCRIPTION_2"/><br />
          <FormattedMessage id="SESSION_EXPIRE_MODAL_SUBSCRIPTION_3"/>
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