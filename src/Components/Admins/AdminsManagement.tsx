import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './AdminsManagement.css';
import Header from 'Components/Header/Header';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { GetPutUsersApiArrayType, GetPutUsersApiDataType, GetPutUsersApiType, UserInfoType } from 'Types/ServerResponseDataTypes';
import { useEffect, useState, useRef } from 'react';

import { message, Pagination, PaginationProps } from 'antd';
import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosPost } from 'Components/CustomHook/CustomAxios';
import { DeleteUsersApi, GetPutUsersApi, GetUsernameCheckApi, PostSignUpApi } from 'Constants/ApiRoute';
import { autoHypenPhoneFun } from 'Constants/ConstantValues';

import delete_icon from '../../assets/delete_icon.png';

interface Checkbox {
  id: number;
  userId: string;
  checked: boolean;
}

const AdminsManagement = () => {
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [adminData, setAdminData] = useState<GetPutUsersApiArrayType>([]);
  const [isAddAdmin, setIsAddAdmin] = useState<boolean>(false);
  const [isIdAlert, setIsIdAlert] = useState<boolean>(false);
  const [isNameAlert, setIsNameAlert] = useState<boolean>(false);
  const [isPhoneAlert, setIsPhoneAlert] = useState<boolean>(false);
  const [idExist, setIdExist] = useState<boolean>(true);
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);

  const userIdRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const userPhoneRef = useRef<HTMLInputElement>(null);

  const userInfoString = sessionStorage.getItem('userInfo');
  const userInfo:UserInfoType | null = userInfoString ? JSON.parse(userInfoString) : null;

  const userId = userInfo?.userId;
  const userRole = userInfo?.userRole;
  const uuid = userInfo?.uuid;


  const navigate = useNavigate();

  const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber);
    setTableCellSize(pageSizeOptions);
  };

  // 전체 선택/해제 핸들러
  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setCheckAll(checked);
    const updatedCheckboxes = checkboxes.map((checkbox) => ({
      ...checkbox,
      checked,
    }));
    setCheckboxes(updatedCheckboxes);
  };

  // 개별 체크박스 선택 핸들러
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const checkboxId = parseInt(event.target.id);
    const checked = event.target.checked;
    const updatedCheckboxes = checkboxes.map((checkbox) => {
      if (checkbox.id === checkboxId) {
        return { ...checkbox, checked };
      }
      return checkbox;
    });
    setCheckboxes(updatedCheckboxes);
    setCheckAll(updatedCheckboxes.every((checkbox) => checkbox.checked));
  };

  // 행 호버 이벤트 핸들러
  const handleRowHover = (index: number) => {
    setHoveredRow(index);
  };

  // adminData가 변경되면 checkboxes 초기화
  useEffect(() => {
    const updatedCheckboxes = adminData.map((data, index) => ({
      id: index,
      userId: data.id,
      checked: false,
    }));
    setCheckboxes(updatedCheckboxes);
  }, [adminData]);
  

  useEffect(() => {
    CustomAxiosGet(
      GetPutUsersApi,
      (data:GetPutUsersApiDataType) => {
        setAdminData(data.users);
        setTotalCount(data.queryTotalCount);
      },
      {
        page_size: tableCellSize,
        role: "ADMIN",
        page: pageNum -1,
      },
      () => {
        console.log('admin 유저 가져오기 실패')
      }
    )
  },[tableCellSize, pageNum, rendering]);

  return (
    <>
      <Header />
      <div style={{overflowY: 'auto', height: height}}>
        <div
          className='content-center'
          style={{flexDirection: 'column', marginTop: '70px'}}
        >
          <div
            className='agent_management_header'
          >
            <div>
              {/* <FormattedMessage id='AGENT_MANAGEMENT' /> */}
              관리자 관리
            </div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>
                {/* <FormattedMessage id='AGENT_MANAGEMENT_LIST' /> */}
                관리자 목록
              </h1>
              {/* <div
                className="App-view-manual-font"
              ><Link to='/Manual'><FormattedMessage id='VIEW_MANUAL' /></Link></div> */}
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '1.8%'}}
          >
            {userRole === 'SUPER_ADMIN' && 
              <div
                style={{float: 'right'}}
                className='mb20'
              >
                {isAddAdmin ?
                <button className='tab_download_upload_button admins_management_button'
                  type='submit'
                  form='addAdminForm'
                >
                  <span>관리자 등록</span>
                </button>
                :
                <button className='tab_download_upload_button admins_management_button'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddAdmin(true);
                  }}
                >
                  <span>관리자 추가</span>
                </button>
                }
              </div>
            }


            {isAddAdmin ?
            <div
              className='create_account_content admins_management_add_admin'
            >
              <form
                id='addAdminForm'
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  console.log('관리자 등록')
                  e.preventDefault();
                  const { userId, userName, userPhoneNumber } = (e.currentTarget.elements as any);
                  const username = userId.value;
                  const name = userName.value;
                  const phoneNumber = userPhoneNumber.value;

                  if(username && name && phoneNumber && !isIdAlert && !isNameAlert && !isPhoneAlert) {
                    console.log('관리자 등록api');
                    CustomAxiosPost(
                      PostSignUpApi,
                      (data: any) => {
                        setIsAddAdmin(false);
                        const render = rendering;
                        const renderTemp = render.concat(true);
                        setRendering(renderTemp);
                      },
                      {
                        name: name,
                        password: '1234',
                        phoneNumber: phoneNumber,
                        role: 'ADMIN',
                        username: username
                      },
                      () => {
                        console.log('관리자 등록 실패');
                        message.error('관리자 등록 실패');
                      }
                    );
                  } else {
                    console.log('에러');
                  }
                }}
              >
                <div
                  style={{marginBottom: '13px'}}
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
                      onClick={() => {
                        const username = userIdRef.current?.value;

                        if(username && !isIdAlert) {
                          CustomAxiosGet(
                            GetUsernameCheckApi(username),
                            (data: any) => {
                              setIdExist(data.exist);
                              message.success('사용 가능한 아이디입니다.');
                            },
                            {

                            },
                            () => {console.log('아이디 중복 확인 에러')}
                          )
                        }
                      }}
                    ><FormattedMessage id='ID_CHECK' /></button>
                  </div>
                  <div
                    className={'regex-alert ' + (isIdAlert ? 'visible' : '')}
                  >
                    4~16자의 영소문자 및 숫자만 사용 가능합니다.
                  </div>
                </div>
                <div>
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
                      const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]{1,16}$/
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
                    한글, 영문으로 입력해주세요.
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
                    10~11자리 숫자만 입력해주세요.
                  </div>
                </div>
              </form>
            </div>
            :
            <div className='table-st1'>
              <table>
                <thead>
                  <tr>
                    <th>
                      <input 
                        type='checkbox'
                        checked={checkAll}
                        onChange={handleCheckAll}
                      />
                    </th>
                    <th>관리자 아이디</th>
                    <th>이름</th>
                    <th>전화번호</th>
                    <th>
                      <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                        onClick={() => {
                          const userIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
                          CustomAxiosDelete(
                            DeleteUsersApi(userIds),
                            () => {
                              message.success('선택한 관리자 삭제 완료');
                              const render = rendering;
                              const renderTemp = render.concat(true);
                              setRendering(renderTemp);
                            }
                          )
                        }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.map((data:GetPutUsersApiType, index: number) => (
                    <tr
                      key={'admin_data_' + index}
                      onMouseEnter={() => handleRowHover(index)}
                      onMouseLeave={() => handleRowHover(-1)}
                      onClick={(e) => { 
                        if (e.currentTarget.tagName !== 'INPUT') {
                          e.stopPropagation();
                          navigate('/InformationDetail/Admin');
                          sessionStorage.setItem('userUuid', data.id);
                        }                       
                      }}
                      style={{ background: hoveredRow === index ? '#D6EAF5' : 'transparent', cursor: 'pointer' }}
                    >
                      <td>
                        <input 
                          type='checkbox' 
                          value={data.id}
                          id={index.toString()}
                          checked={checkboxes[index]?.checked || false}
                          onChange={handleCheckboxChange}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td>{data.username}</td>
                      <td>{data.name}</td>
                      <td>{data.phoneNumber}</td>
                      <td>
                        <img src={delete_icon} width='20px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                          onClick={() => {
                            CustomAxiosDelete(
                              DeleteUsersApi(data.id),
                              () => {
                                message.success('관리자 삭제 완료');
                                const render = rendering;
                                const renderTemp = render.concat(true);
                                setRendering(renderTemp);
                              }
                            )
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> 
              <div
                className="mt50 mb40"
                style={{textAlign: 'center'}}
              >
                <Pagination showQuickJumper showSizeChanger current={pageNum} total={totalCount} onChange={onChangePage}/>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminsManagement;