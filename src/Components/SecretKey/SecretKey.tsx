import './SecretKey.css';
import { useWindowHeightHeader } from "Components/CustomHook/useWindowHeight";
import Header from "Components/Header/Header";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState } from 'react';
import { CustomAxiosGet, CustomAxiosPut } from "Components/CustomHook/CustomAxios";
import { GetPutSecretKeyApi } from "Constants/ApiRoute";
import { GetPutSecretKeyApiType } from "Types/ServerResponseDataTypes";
import { Col, Row, message } from "antd";
import { CopyRightText } from "Constants/ConstantValues";
import { useNavigate } from 'react-router';

const SecretKey = () => {
  const height = useWindowHeightHeader();
  const [isAddSecretKey, setIsAddSecretKey] = useState<boolean>(false);
  const [isAddApiServer, setIsAddApiServer] = useState<boolean>(false);
  const [isAddSocketServer, setIsAddSocketServer] = useState<boolean>(false);
  const [secretKeyData, setSecretKeyData] = useState<string>('');
  const [apiServerData, setApiServerData] = useState<string>('');
  const [socketServerData, setSocketServerData] = useState<string>('');

  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  useEffect(() => {
    CustomAxiosGet(
      GetPutSecretKeyApi,
      (data: GetPutSecretKeyApiType) => {
        setSecretKeyData(data.secretKey);
        setApiServerData(data.interfaceApiServer);
        setSocketServerData(data.interfaceSocketServer);
      }, {},
      (err:any) => {
        if(err.response.data.code === 'ERR_001') {
          navigate('/AutoLogout');
        }
      }
    )
  },[])

  return (
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          // className='content-center'
          style={{flexDirection: 'column', paddingTop: '70px', minHeight: `${height - 130}px`, justifyContent: 'start'}}
        >

          {/* title */}
          <Row>
            <Col
              className='secret_key_header'
              xs={{ span: 22, offset: 1 }} 
              sm={{ span: 6, offset: 2 }} 
              md={{ span: 6, offset: 2 }} 
              lg={{ span: 6, offset: 2 }}
              xl={{ span: 6, offset: 4 }}
            >
              {/* <div><FormattedMessage id='SECRET_KEY_MANAGEMENT' /></div> */}
              <div><FormattedMessage id='OMPASS_SETTINGS' /></div>
              <div
                className='mb40'
                style={{display: 'flex'}}
              >
                {/* <h1><FormattedMessage id='SECRET_KEY_MANAGEMENT' /></h1> */}
                <h1><FormattedMessage id='OMPASS_SERVER_SETTINGS' /></h1>
              </div>
            </Col>
          </Row>

          {/* secret input */}
          <Row>
            <Col
              xs={{ span: 22, offset: 1 }} 
              sm={{ span: 6, offset: 2 }} 
              md={{ span: 6, offset: 2 }} 
              lg={{ span: 6, offset: 2 }}
              xl={{ span: 6, offset: 4 }}
            >
              <h2><FormattedMessage id='SECRET_KEY' /></h2>
            </Col>
          </Row>

          <Row>
            <Col 
              xs={{ span: 20, offset: 1 }} 
              sm={{ span: 20, offset: 2 }} 
              md={{ span: 13, offset: 2 }} 
              lg={{ span: 12, offset: 2 }}
              xl={{ span: 10, offset: 4 }}
            >
              <form
                id='addSecretKeyForm'
                style={{display: 'flex', flexDirection: 'row'}}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { secretKey } = (e.currentTarget.elements as any);
                  if(isAddSecretKey) {
                    CustomAxiosPut(
                      GetPutSecretKeyApi,
                      () => {
                        setIsAddSecretKey(false);
                        message.success(formatMessage({ id: 'SECRET_KEY_MODIFY_SUCCESS' }));
                      },
                      {
                        secretKey: secretKey.value
                      },
                      (err:any) => {
                        message.error(formatMessage({ id: 'SECRET_KEY_MODIFY_Fail' }));
                        if(err.response.data.code === 'ERR_001') {
                          navigate('/AutoLogout');
                        }
                      }
                    )
                  }
                }}
              >                
                <input 
                  id='secretKey'
                  type='text'
                  className={'input-st1 create_account_input mt8 mb5 ' + (isAddSecretKey ? '' : 'disable')}
                  style={{width: '100%', marginLeft: '2.5%'}}
                  autoComplete='off'
                  disabled={isAddSecretKey ? false : true}
                  value={secretKeyData}
                  onChange={(e) => {
                    setSecretKeyData(e.currentTarget.value);
                  }}
                />
              </form>
            </Col>
            <Col
              xs={{ span: 9, offset: 1 }} 
              sm={{ span: 9, offset: 2 }} 
              md={{ span: 5 }} 
              lg={{ span: 2 }}
              xl={{ span: 7 }}
            >
              {isAddSecretKey ?
                <button className='tab_download_upload_button admins_management_button'
                  type='submit'
                  form='addSecretKeyForm'
                >
                  <span><FormattedMessage id='REGISTER' /></span>
                </button>
                :
                <button className='tab_download_upload_button admins_management_button'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddSecretKey(true);
                  }}
                >
                  <span><FormattedMessage id='EDIT' /></span>
                </button>
              }
            </Col>
          </Row>

          {/* interface api server input */}
          <Row
            style={{marginTop: '3vh'}}
          >
            <Col
              xs={{ span: 22, offset: 1 }} 
              sm={{ span: 6, offset: 2 }} 
              md={{ span: 6, offset: 2 }} 
              lg={{ span: 6, offset: 2 }}
              xl={{ span: 6, offset: 4 }}
            >
              <h2><FormattedMessage id='API_SERVER_URL' /></h2>
            </Col>
          </Row>

          <Row>
            <Col 
              xs={{ span: 20, offset: 1 }} 
              sm={{ span: 20, offset: 2 }} 
              md={{ span: 13, offset: 2 }} 
              lg={{ span: 12, offset: 2 }}
              xl={{ span: 10, offset: 4 }}
            >
              <form
                id='addApiServerForm'
                style={{display: 'flex', flexDirection: 'row'}}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { apiServer } = (e.currentTarget.elements as any);
                  if(isAddApiServer) {
                    CustomAxiosPut(
                      GetPutSecretKeyApi,
                      () => {
                        setIsAddApiServer(false);
                        message.success(formatMessage({ id: 'API_SERVER_URL_MODIFY_SUCCESS' }));
                      },
                      {
                        interfaceApiServer: apiServer.value
                      },
                      (err:any) => {
                        message.error(formatMessage({ id: 'API_SERVER_URL_MODIFY_Fail' }));
                        if(err.response.data.code === 'ERR_001') {
                          navigate('/AutoLogout');
                        }
                      }
                    )
                  }
                }}
              >                
                <input 
                  id='apiServer'
                  type='text'
                  className={'input-st1 create_account_input mt8 mb5 ' + (isAddApiServer ? '' : 'disable')}
                  style={{width: '100%', marginLeft: '2.5%'}}
                  autoComplete='off'
                  disabled={isAddApiServer ? false : true}
                  value={apiServerData}
                  onChange={(e) => {
                    setApiServerData(e.currentTarget.value);
                  }}
                />
              </form>
            </Col>
            <Col
              xs={{ span: 9, offset: 1 }} 
              sm={{ span: 9, offset: 2 }} 
              md={{ span: 5 }} 
              lg={{ span: 2 }}
              xl={{ span: 7 }}
            >
              {isAddApiServer ?
                <button className='tab_download_upload_button admins_management_button'
                  type='submit'
                  form='addApiServerForm'
                >
                  <span><FormattedMessage id='REGISTER' /></span>
                </button>
                :
                <button className='tab_download_upload_button admins_management_button'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddApiServer(true);
                  }}
                >
                  <span><FormattedMessage id='EDIT' /></span>
                </button>
              }
            </Col>
          </Row>
          
          {/* interface socket server input */}
          <Row
            style={{marginTop: '3vh'}}
          >
            <Col
              xs={{ span: 22, offset: 1 }} 
              sm={{ span: 6, offset: 2 }} 
              md={{ span: 6, offset: 2 }} 
              lg={{ span: 6, offset: 2 }}
              xl={{ span: 6, offset: 4 }}
            >
              <h2><FormattedMessage id='SOCKET_SERVER_URL' /></h2>
            </Col>
          </Row>

          <Row>
            <Col 
              xs={{ span: 20, offset: 1 }} 
              sm={{ span: 20, offset: 2 }} 
              md={{ span: 13, offset: 2 }} 
              lg={{ span: 12, offset: 2 }}
              xl={{ span: 10, offset: 4 }}
            >
              <form
                id='addSocketServerForm'
                style={{display: 'flex', flexDirection: 'row'}}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { socketServer } = (e.currentTarget.elements as any);
                  if(isAddSocketServer) {
                    CustomAxiosPut(
                      GetPutSecretKeyApi,
                      () => {
                        setIsAddSocketServer(false);
                        message.success(formatMessage({ id: 'SOCKET_SERVER_URL_MODIFY_SUCCESS' }));
                      },
                      {
                        interfaceSocketServer: socketServer.value
                      },
                      (err:any) => {
                        message.error(formatMessage({ id: 'SOCKET_SERVER_URL_MODIFY_Fail' }));
                        if(err.response.data.code === 'ERR_001') {
                          navigate('/AutoLogout');
                        }
                      }
                    )
                  }
                }}
              >                
                <input 
                  id='socketServer'
                  type='text'
                  className={'input-st1 create_account_input mt8 mb5 ' + (isAddSocketServer ? '' : 'disable')}
                  style={{width: '100%', marginLeft: '2.5%'}}
                  autoComplete='off'
                  disabled={isAddSocketServer ? false : true}
                  value={socketServerData}
                  onChange={(e) => {
                    setSocketServerData(e.currentTarget.value);
                  }}
                />
              </form>
            </Col>
            <Col
              xs={{ span: 9, offset: 1 }} 
              sm={{ span: 9, offset: 2 }} 
              md={{ span: 5 }} 
              lg={{ span: 2 }}
              xl={{ span: 7 }}
            >
              {isAddSocketServer ?
                <button className='tab_download_upload_button admins_management_button'
                  type='submit'
                  form='addSocketServerForm'
                >
                  <span><FormattedMessage id='REGISTER' /></span>
                </button>
                :
                <button className='tab_download_upload_button admins_management_button'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddSocketServer(true);
                  }}
                >
                  <span><FormattedMessage id='EDIT' /></span>
                </button>
              }
            </Col>
          </Row>

        </div>

        {/* footer */}
        <div
          className='copyRight-style mb30'
        >
          {CopyRightText}
        </div>
      </div>
    </>
  )
}

export default SecretKey;