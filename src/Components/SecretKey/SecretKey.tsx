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

const SecretKey = () => {
  const height = useWindowHeightHeader();
  const [isAddSecretKey, setIsAddSecretKey] = useState<boolean>(false);
  const [secretKeyData, setSecretKeyData] = useState<string>('');

  const { formatMessage } = useIntl();

  useEffect(() => {
    CustomAxiosGet(
      GetPutSecretKeyApi,
      (data: GetPutSecretKeyApiType) => {
        setSecretKeyData(data.secretKey);
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
              <div><FormattedMessage id='SECRET_KEY_MANAGEMENT' /></div>
              <div
                className='mb40'
                style={{display: 'flex'}}
              >
                <h1><FormattedMessage id='SECRET_KEY_MANAGEMENT' /></h1>
              </div>
            </Col>
          </Row>

          {/* secret input */}
          <Row
            style={{marginTop: '2vh'}}
          >
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
                      () => {
                        console.log('비밀키 변경 에러')
                      }
                    )
                  }
                }}
              >
                <div
                  style={{position: 'relative', top: '26px', width: '50px'}}
                >
                  <FormattedMessage id='SECRET_KEY' />
                </div>
                
                <input 
                  id='secretKey'
                  type='text'
                  className={'input-st1 create_account_input mt8 mb5'}
                  style={{width: '100%', marginLeft: '2.5%'}}
                  autoComplete='off'
                  disabled={isAddSecretKey ? false : true}
                  value={secretKeyData}
                  onChange={(e) => {
                    setSecretKeyData(e.currentTarget.value);
                  }}
                />
                {/* <table>
                  <tbody>
                    <td>
                      <FormattedMessage id='SECRET_KEY' />
                    </td>
                    <td>
                      <input 
                        id='secretKey'
                        type='text'
                        className={'input-st1 create_account_input mt8 mb5'}
                        style={{width: '700px', marginLeft: '2.5%'}}
                        autoComplete='off'
                        disabled={isAddSecretKey ? false : true}
                        value={secretKeyData}
                        onChange={(e) => {
                          setSecretKeyData(e.currentTarget.value);
                        }}
                      />
                    </td>
                  </tbody>
                </table> */}
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
                  <span><FormattedMessage id='REGISTER_A_SECRET_KEY' /></span>
                </button>
                :
                <button className='tab_download_upload_button admins_management_button'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddSecretKey(true);
                  }}
                >
                  <span><FormattedMessage id='MODIFY_THE_SECRET_KEY' /></span>
                </button>
              }
            </Col>
          </Row>

          {/* <Row>
            <div 
            >
              <div
                style={{float: 'right'}}
                className='mb20'
              >
                {isAddSecretKey ?
                  <button className='tab_download_upload_button admins_management_button'
                    type='submit'
                    form='addSecretKeyForm'
                  >
                    <span><FormattedMessage id='REGISTER_A_SECRET_KEY' /></span>
                  </button>
                  :
                  <button className='tab_download_upload_button admins_management_button'
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAddSecretKey(true);
                    }}
                  >
                    <span><FormattedMessage id='MODIFY_THE_SECRET_KEY' /></span>
                  </button>
                }
              </div>

              <div>
                <form
                  id='addSecretKeyForm'
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
                        () => {
                          console.log('비밀키 변경 에러')
                        }
                      )
                    }
                  }}
                >
                  <table>
                    <tbody>
                      <td>
                        <FormattedMessage id='SECRET_KEY' />
                      </td>
                      <td>
                        <input 
                          id='secretKey'
                          type='text'
                          className={'input-st1 create_account_input mt8 mb5'}
                          style={{width: '700px', marginLeft: '2.5%'}}
                          autoComplete='off'
                          disabled={isAddSecretKey ? false : true}
                          value={secretKeyData}
                          onChange={(e) => {
                            setSecretKeyData(e.currentTarget.value);
                          }}
                        />
                      </td>
                    </tbody>
                  </table>

                </form>
              </div>
            </div>
          </Row> */}
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