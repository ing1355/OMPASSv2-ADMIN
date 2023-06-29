import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './AdminsManagement.css';
import Header from 'Components/Header/Header';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

import { message } from 'antd';
import { CustomAxiosGet, CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { GetUsernameCheckApi, PostSignUpApi } from 'Constants/ApiRoute';
import { autoHypenPhoneFun, CopyRightText } from 'Constants/ConstantValues';

import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { InformationProps } from 'Types/PropsTypes';

const CreateAdmins = ({ pageNum, setPageNum, tableCellSize, setTableCellSize }: InformationProps) => {
  const { userInfo } = useSelector((state: ReduxStateType) => ({
    userInfo: state.userInfo!
  }));
  const height = useWindowHeightHeader();
  const [isIdAlert, setIsIdAlert] = useState<boolean>(false);
  const [isNameAlert, setIsNameAlert] = useState<boolean>(false);
  const [isPhoneAlert, setIsPhoneAlert] = useState<boolean>(false);
  const [idExist, setIdExist] = useState<boolean>(true);

  const userIdRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const userPhoneRef = useRef<HTMLInputElement>(null);

  const {role} = userInfo
  const navigate = useNavigate();
  const { formatMessage } = useIntl();


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
            <div>
              <FormattedMessage id='ADMIN_MANAGEMENT' />
            </div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                <FormattedMessage id='ADMIN_LIST' />
              </h1>
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '1.8%'}}
          >
            {role === 'SUPER_ADMIN' && 
              <div
                style={{float: 'right'}}
                className='mb20'
              >
                <div>
                  <button className='admins_management_button'
                    type='submit'
                    form='addAdminForm'
                  >
                    <span><FormattedMessage id='ADMIN_REGISTRATION' /></span>
                  </button>
                  <button className='admins_management_button'
                    type='button'
                    onClick={() => {
                      navigate('/AdminsManagement');
                    }}
                  >
                    <span><FormattedMessage id='CANCEL' /></span>
                  </button>
                </div>
              </div>
            }

            <div
              className='create_account_content admins_management_add_admin'
            >
              <form
                id='addAdminForm'
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const { userId, userName, userPhoneNumber } = (e.currentTarget.elements as any);
                  const username = userId.value;
                  const name = userName.value;
                  const phoneNumber = userPhoneNumber.value;

                  if(username && name && phoneNumber && !isIdAlert && !isNameAlert && !isPhoneAlert) {
                    if(idExist) {
                      message.error(formatMessage({ id: 'PLEASE_CHECK_THE_ID' }));
                    } else {
                      CustomAxiosPost(
                        PostSignUpApi,
                        () => {
                          message.success(formatMessage({ id: 'SUCCESS_REGISTER_ADMINS' }));
                          setPageNum(1);
                          navigate('/AdminsManagement');
                        },
                        {
                          name: name,
                          password: '1234',
                          phoneNumber: phoneNumber,
                          role: 'ADMIN',
                          username: username
                        },
                        () => {
                        }
                      );
                    }
                  } else {
                    message.error(formatMessage({ id: 'PLEASE_ENTER_ALL_THE_ITEMS' }))
                  }
                }}
              >
                <div
                  className='mb20'
                >
                  <label><FormattedMessage id='ID' /></label>
                  <div
                    className='mt8 mb5'
                    style={{display: 'flex'}}
                  >
                    <input 
                      ref={userIdRef}
                      id='userId'
                      type='text'
                      className={'input-st1 create_account_input ' + (isIdAlert ? 'red' : '')}
                      maxLength={16}
                      autoComplete='off'
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        const idRegex = /^[a-z0-9]{4,16}$/;
                        if(idRegex.test(value)) {
                          setIsIdAlert(false);
                        } else {
                          setIsIdAlert(true);
                        }
                      }}
                    />
                    <button
                      type='button'
                      className={'button-st1 create_account_id_check ' + (!isIdAlert && userIdRef.current?.value ? 'active' : '')}
                      style={{fontSize: '1.15vh', fontWeight: '500'}}
                      onClick={() => {
                        const username = userIdRef.current?.value;

                        if(username && !isIdAlert) {
                          CustomAxiosGet(
                            GetUsernameCheckApi(username),
                            (data: any) => {
                              setIdExist(data.exist);
                              if(data.exist) {
                                message.error(formatMessage({ id: 'ID_IS_DUPLICATED' }))
                              } else {
                                message.success(formatMessage({ id: 'AVAILABLE_USERNAME' }));
                              }
                            },
                          )
                        }
                      }}
                    ><FormattedMessage id='ID_CHECK' /></button>
                  </div>
                  <div
                    className={'regex-alert ' + (isIdAlert ? 'visible' : '')}
                  >
                    <FormattedMessage id='USER_ID_CHECK' />
                  </div>
                </div>
                <div
                  className='mb20'
                >
                  <label><FormattedMessage id='NAME' /></label>
                  <input 
                    ref={userNameRef}
                    id='userName'
                    type='text'
                    className={'input-st1 create_account_input mt8 mb5 ' + (isNameAlert ? 'red' : '')}
                    maxLength={16}
                    autoComplete='off'
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,16}$/
                      if(nameRegex.test(value)) {
                        setIsNameAlert(false);
                      } else {
                        setIsNameAlert(true);
                      }
                    }}
                  />
                  <div
                    className={'regex-alert ' + (isNameAlert ? 'visible' : '')}
                  >
                    <FormattedMessage id='NAME_CHECK' />
                  </div>
                </div>
                
                <div>
                  <label><FormattedMessage id='PHONE_NUMBER' /></label>
                  <input 
                    ref={userPhoneRef}
                    id='userPhoneNumber'
                    type='text'
                    className={'input-st1 create_account_input mt8 ' + (isPhoneAlert ? 'red' : '')}
                    maxLength={13}
                    autoComplete='off'
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      e.currentTarget.value = autoHypenPhoneFun(value);
                      if(e.currentTarget.value.length < 12) {
                        setIsPhoneAlert(true);
                      } else {
                        setIsPhoneAlert(false);
                      }
                    }}
                  />
                  <div
                    className={'regex-alert mt5 ' + (isPhoneAlert ? 'visible' : '')}
                  >
                    <FormattedMessage id='PHONE_NUMBER_CHECK' />
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

export default CreateAdmins