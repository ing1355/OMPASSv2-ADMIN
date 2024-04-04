import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';
import './UserManagement.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

import { message } from 'antd';
import { CustomAxiosGet, CustomAxiosPost } from 'Components/CommonCustomComponents/CustomAxios';
import { GetUsernameCheckApi, PostSignUpApi } from 'Constants/ApiRoute';

import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { InformationProps } from 'Types/PropsTypes';
import { idRegex, nameRegex } from 'Components/CommonCustomComponents/CommonRegex';
import Contents from 'Components/Layout/Contents';
import { autoHypenPhoneFun } from 'Functions/GlobalFunctions';

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

  const { role } = userInfo
  const navigate = useNavigate();
  const { formatMessage } = useIntl();


  return (
    <>
      <Contents>
        <div
          className='agent_management_header'
        >
          <div>
            <FormattedMessage id='USER_MANAGEMENT' />
          </div>
          <div
            className='mb40'
            style={{ display: 'flex' }}
          >
            <h1>
              <FormattedMessage id='USER_REGISTRATION' />
            </h1>
          </div>
        </div>

        <div
          style={{ width: '1200px', marginTop: '1.8%' }}
        >
          {role === 'ROOT' &&
            <div
              style={{ float: 'right' }}
              className='mb20'
            >
              <div>
                <button className='admins_management_button'
                  type='submit'
                  form='addAdminForm'
                >
                  <span><FormattedMessage id='USER_REGISTRATION' /></span>
                </button>
                <button className='admins_management_button'
                  type='button'
                  onClick={() => {
                    navigate('/UserManagement');
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

                if (username && name && phoneNumber && !isIdAlert && !isNameAlert && !isPhoneAlert) {
                  if (idExist) {
                    message.error(formatMessage({ id: 'PLEASE_CHECK_THE_ID' }));
                  } else {
                    CustomAxiosPost(
                      PostSignUpApi,
                      () => {
                        message.success(formatMessage({ id: 'SUCCESS_REGISTER_USER' }));
                        setPageNum(1);
                        navigate('/UserManagement');
                      },
                      {
                        name: name,
                        password: '1234',
                        phoneNumber: phoneNumber,
                        role: 'ADMIN',
                        username: username
                      },
                      (err: any) => {
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
                  style={{ display: 'flex' }}
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
                      const idRgx: RegExp = idRegex;
                      if (idRgx.test(value)) {
                        setIsIdAlert(false);
                      } else {
                        setIsIdAlert(true);
                      }
                    }}
                  />
                  <button
                    type='button'
                    className={'button-st1 create_account_id_check ' + (!isIdAlert && userIdRef.current?.value ? 'active' : '')}
                    onClick={() => {
                      const username = userIdRef.current?.value;

                      if (username && !isIdAlert) {
                        CustomAxiosGet(
                          GetUsernameCheckApi(username),
                          (data: any) => {
                            setIdExist(data.exist);
                            if (data.exist) {
                              message.error(formatMessage({ id: 'ID_IS_DUPLICATED' }))
                            } else {
                              message.success(formatMessage({ id: 'AVAILABLE_USERNAME' }));
                            }
                          }, {},
                          (err: any) => {

                          }
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
                    const nameRgx: RegExp = nameRegex;
                    if (nameRgx.test(value)) {
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
                    if (e.currentTarget.value.length < 12) {
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
      </Contents>
    </>
  )
}

export default CreateAdmins