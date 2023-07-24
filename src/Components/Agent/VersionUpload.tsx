import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import Header from "Components/Header/Header";
import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { PostAgentInstallerUploadApi } from 'Constants/ApiRoute';
import { CopyRightText } from 'Constants/ConstantValues';
import { useNavigate } from 'react-router';
import { InformationProps } from 'Types/PropsTypes';

const VersionUpload = ({ pageNum, setPageNum, tableCellSize, setTableCellSize }: InformationProps) => {
  const height = useWindowHeightHeader();
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
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          className='content-center'
          style={{flexDirection: 'column', paddingTop: '70px', minHeight: `${height - 130}px`, justifyContent: 'start'}}
        >
          <div
            className='agent_management_header'
          >
            <div><FormattedMessage id='VERSION_MANAGEMENT' /></div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1><FormattedMessage id='VERSION_LIST' /></h1>
              {/* <div
                className="App-view-manual-font"
              ><Link to='/Manual'><FormattedMessage id='VIEW_MANUAL' /></Link></div> */}
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '1.8%'}}
          >
            <div
              style={{float: 'right'}}
              className='mb20'
            >
              {isUploadingFile ? 
                <div>
                  <button className='admins_management_button'
                    type='button'
                    disabled
                    style={{cursor: 'default'}}
                  >
                    <span><FormattedMessage id='LOADING' /></span>
                  </button> 
                  <button className='admins_management_button'
                    type='button'
                    disabled
                    style={{cursor: 'default'}}
                  >
                    <span><FormattedMessage id='CANCEL' /></span>
                  </button>
                </div>
              :
                <div>
                  <button className='admins_management_button'
                    type='submit'
                    form='addVersionForm'
                  >
                    <span><FormattedMessage id='CONFIRM' /></span>
                  </button>
                  <button className='admins_management_button'
                    type='button'
                    onClick={() => {
                      navigate('/AgentManagement');
                    }}
                  >
                    <span><FormattedMessage id='CANCEL' /></span>
                  </button>
                </div>
              }
            </div>
            <div
              className='create_account_content'
            >
              <form 
                id='addVersionForm'
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { version, uploadFile, hash } = (e.currentTarget.elements as any);
                  const metaDataVersion = version.value;
                  const hashValue = hash.value;
                  const multipartFile = uploadFile.files[0];
                  const maxFileSize = 100 * 1024 * 1024;
                  const fileExtension = multipartFile?.name.split('.').pop();
                  
                  if(metaDataVersion) {
                    setIsVersionAlert(false);
                  } else {
                    setIsVersionAlert(true);
                  }

                  if(metaDataVersion && multipartFile && hashValue && !isVersionAlert && !isUploadingFile) {
                    if(multipartFile.size > maxFileSize) {
                      message.error(formatMessage({ id: 'THE_FILE_SIZE_EXCEEDS_100MB' }));
                    } else if(fileExtension !== 'zip') {
                      message.error(formatMessage({ id: 'ONLY_ZIP_FILES_CAN_BE_UPLOADED' }));
                    }  else {
                      setIsUploadingFile(true);
                      CustomAxiosPost(
                        PostAgentInstallerUploadApi,
                        (data: any) => {
                          setPageNum(1);
                          navigate('/AgentManagement');
                        },
                        {
                          'metaData.hash': hashValue,
                          'metaData.os': 'WINDOWS',
                          'metaData.version': metaDataVersion,                          
                          multipartFile: multipartFile,
                        },
                        (err:any) => {
                          message.error(formatMessage({ id: 'UPLOAD_FAILED' }));
                          if(err.response.data.code === 'ERR_001') {
                            navigate('/AutoLogout');
                          }
                        },
                        {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                        },
                      );
                    }
                  } else {
                    message.error(formatMessage({ id: 'PLEASE_ENTER_ALL_THE_ITEMS' }))
                  }
                }}
              >
                <div
                  className='mt50'
                >
                  <label><FormattedMessage id='VERSION_NAME' /></label>
                  <input 
                    id='version'
                    type='text'
                    className={'input-st1 create_account_input mt8 mb5 ' + (isVersionAlert ? 'red' : '')}
                    maxLength={16}
                    autoComplete='off'
                    style={{width: '600px'}}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      if(value) {
                        setIsVersionAlert(false);
                      } else {
                        setIsVersionAlert(true);
                      }
                    }}
                  />
                  <div
                    className={'regex-alert ' + (isVersionAlert ? 'visible' : '')}
                  >
                    <FormattedMessage id='PLEASE_ENTER_A_VERSION' />
                  </div>
                </div>
                <div
                  className='mb20'
                >
                  <label><FormattedMessage id='HASH' /></label>
                  <input 
                    id='hash'
                    type='text'
                    className={'input-st1 create_account_input mt8 mb5 '}
                    autoComplete='off'
                    style={{width: '600px'}}
                  />
                </div>
                <div>
                  <label><FormattedMessage id='FILE_UPLOAD' /></label>
                  <div
                    style={{marginTop: '22px'}}
                  >
                    <label htmlFor="uploadFile" className='button-st4 agent_management_file_btn'><FormattedMessage id='SELECT_FILE' /></label>
                    <input
                      id="uploadFile"
                      type="file"
                      accept=".zip"
                      hidden
                      onChange={handleFileChange}
                    />
                    <span style={{marginLeft: '15px'}}>{fileName}</span>
                  </div>
                </div>
              </form>
            </div>

          </div>           
        </div>
        <div
          className='copyRight-style mb30'
        >
          {CopyRightText}
        </div> 
      </div>
    </>
  )
}

export default VersionUpload