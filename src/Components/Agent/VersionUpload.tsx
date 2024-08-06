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
              const { version, uploadFile, hash } = (e.currentTarget.elements as any);
              const metaDataVersion = version.value;
              const hashValue = hash.value;
              const multipartFile = uploadFile.files[0];
              const maxFileSize = 200 * 1024 * 1024;
              const fileExtension = multipartFile?.name.split('.').pop();
              if (!metaDataVersion) {
                return message.error(formatMessage({ id: "PLEASE_ENTER_A_VERSION" }))
              }
              if (!(/^v[0-9]+.[0-9]+.[0-9]+.[0-9]+/g.test(metaDataVersion))) {
                return message.error("버전명이 올바르지 않습니다.")
              }

              if (metaDataVersion && multipartFile && hashValue && !isVersionAlert && !isUploadingFile) {
                if (multipartFile.size > maxFileSize) {
                  message.error(formatMessage({ id: 'THE_FILE_SIZE_EXCEEDS_200MB' }));
                } else if (fileExtension !== 'zip') {
                  message.error(formatMessage({ id: 'ONLY_ZIP_FILES_CAN_BE_UPLOADED' }));
                } else {
                  setIsUploadingFile(true);
                  UploadAgentInstallerFunc({
                    "metaData.hash": hashValue,
                    "metaData.os": "Windows",
                    "metaData.version": metaDataVersion,
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
              <div>
                <label><FormattedMessage id='VERSION_NAME' /></label>
                <Input
                  id='version'
                  type='text'
                  className={'st1 ' + (isVersionAlert ? 'red' : '')}
                  maxLength={16}
                  placeholder='ex) v1.x.x.x'
                  autoComplete='off'
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    if (value) {
                      setIsVersionAlert(false);
                    } else {
                      setIsVersionAlert(true);
                    }
                  }}
                />
              </div>
            </div>
            <div className='agent-input-row-container'>
              <div>
                <label><FormattedMessage id='HASH' /></label>
                <Input
                  className="st1"
                  id='hash'
                  type='text'
                  autoComplete='off'
                />
              </div>
            </div>
            <div>
              <label><FormattedMessage id='FILE_UPLOAD' /></label>
              <div
                style={{ marginTop: '22px' }}
              >
                <div>
                  <Button className='st1' icon={uploadIconHover} onClick={() => {
                    document.getElementById("uploadFile")?.click()
                  }}>
                    <FormattedMessage id='SELECT_FILE' />
                  </Button>
                  <Input
                    id="uploadFile"
                    name="uploadFile"
                    type="file"
                    accept=".zip"
                    hidden
                    onChange={handleFileChange} />
                </div>
                <div style={{ marginTop: '22px', width: '620px', wordWrap: 'break-word' }}>
                  {fileName}
                </div>
              </div>
            </div>
          </form>
        </div>
      </Contents>
    </>
  )
}

export default VersionUpload