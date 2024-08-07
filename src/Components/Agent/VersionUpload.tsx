import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import { message } from 'antd';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Contents from 'Components/Layout/Contents';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import { UploadAgentInstallerFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import Input from 'Components/CommonCustomComponents/Input';
import uploadIconHover from '../../assets/uploadIconHover.png'

const VersionUpload = () => {
  const [isVersionAlert, setIsVersionAlert] = useState<boolean>(false);
  const [fileName, setFileName] = useState('');
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [inputVersion, setInputVersion] = useState('')
  const [inputHash, setInputHash] = useState('')
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const name = fileInput.files[0].name;
      setFileName(name);
    }
  };

  return (
    <>
      <Contents>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle='VERSION_LIST'>
          <Button className='st3'
            type={!isUploadingFile ? "submit" : "button"}
            form={!isUploadingFile ? 'addVersionForm' : ''}
            aria-loading={isUploadingFile}
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
              const { uploadFile } = (e.currentTarget.elements as any);
              const multipartFile = uploadFile.files[0];
              const maxFileSize = 200 * 1024 * 1024;
              const fileExtension = multipartFile?.name.split('.').pop();
              if (!inputVersion) {
                return message.error(formatMessage({ id: "PLEASE_ENTER_A_VERSION" }))
              }
              if (!(/^v[0-9]+.[0-9]+.[0-9]+.[0-9]+/g.test(inputVersion))) {
                return message.error("버전명이 올바르지 않습니다.")
              }

              if (inputVersion && multipartFile && inputHash && !isVersionAlert && !isUploadingFile) {
                if (multipartFile.size > maxFileSize) {
                  message.error(formatMessage({ id: 'THE_FILE_SIZE_EXCEEDS_200MB' }));
                } else if (fileExtension !== 'zip') {
                  message.error(formatMessage({ id: 'ONLY_ZIP_FILES_CAN_BE_UPLOADED' }));
                } else {
                  setIsUploadingFile(true);
                  UploadAgentInstallerFunc({
                    "metaData.hash": inputHash,
                    "metaData.os": "Windows",
                    "metaData.version": inputVersion,
                    multipartFile: multipartFile,
                  }, () => {
                    navigate('/AgentManagement');
                  }).catch(err => {
                    setIsUploadingFile(false);
                  });
                }
              } else {
                message.error(formatMessage({ id: 'PLEASE_ENTER_ALL_THE_ITEMS' }))
              }
            }}
          >
            <div className='agent-input-row-container'>
              <label><FormattedMessage id='VERSION_NAME' /></label>
              <Input
                className={'st1 ' + (isVersionAlert ? 'red' : '')}
                maxLength={16}
                placeholder='ex) v1.x.x.x'
                value={inputVersion}
                valueChange={value => {
                  setInputVersion(value)
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
                {fileName}
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