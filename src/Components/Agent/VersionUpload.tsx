import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Contents from 'Components/Layout/Contents';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import { UploadAgentInstallerFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';
import uploadIconHover from '../../assets/uploadIconHover.png'

const VersionUpload = () => {
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  // const [inputVersion, setInputVersion] = useState('')
  const [inputMemo, setInputMemo] = useState('')
  const [inputHash, setInputHash] = useState('')
  const [inputFile, setInputFile] = useState<File>()
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      setInputFile(fileInput.files[0])
    }
  };

  return (
    <>
      <Contents>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle='VERSION_LIST'>
          <Button className='st3'
            type={!isUploadingFile ? "submit" : "button"}
            form={!isUploadingFile ? 'addVersionForm' : ''}
            loading={isUploadingFile}
          >
            <span><FormattedMessage id={isUploadingFile ? 'LOADING' : 'CONFIRM'} /></span>
          </Button>
          <Button className='st1'
            type='button'
            disabled={isUploadingFile}
            onClick={() => {
              if (!isUploadingFile) {
                navigate('/AgentManagement');
              }
            }}
          >
            <span><FormattedMessage id='GO_BACK' /></span>
          </Button>
        </ContentsHeader>
        <div className="contents-header-container">
          <form
            id='addVersionForm'
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const maxFileSize = 200 * 1024 * 1024;
              const fileExtension = inputFile?.name.split('.').pop();
              
              if (!inputHash) {
                return message.error(formatMessage({ id: 'PLEASE_INPUT_HASH' }));
              } else if (!inputFile) {
                return message.error(formatMessage({id: 'PLEASE_UPLOAD_INPUT_FILE'}))
              } else if (inputFile.size > maxFileSize) {
                return message.error(formatMessage({ id: 'THE_FILE_SIZE_EXCEEDS_200MB' }));
              } else if (fileExtension !== 'zip') {
                return message.error(formatMessage({ id: 'ONLY_ZIP_FILES_CAN_BE_UPLOADED' }));
              }
              setIsUploadingFile(true);
              UploadAgentInstallerFunc({
                "metaData.hash": inputHash,
                "metaData.os": "Windows",
                // "metaData.version": inputVersion,
                "metaData.note": inputMemo,
                multipartFile: inputFile,
              }, () => {
                navigate('/AgentManagement');
              }).finally(() => {
                setIsUploadingFile(false)
              })
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
    </>
  )
}

export default VersionUpload