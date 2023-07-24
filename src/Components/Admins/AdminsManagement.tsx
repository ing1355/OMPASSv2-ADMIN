import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import './AdminsManagement.css';
import Header from 'Components/Header/Header';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { GetPutUsersApiArrayType, GetPutUsersApiDataType, GetPutUsersApiType } from 'Types/ServerResponseDataTypes';
import { useEffect, useState} from 'react';

import { message, Pagination, PaginationProps, Popconfirm } from 'antd';
import { CustomAxiosDelete, CustomAxiosGet } from 'Components/CustomHook/CustomAxios';
import { DeleteUsersApi, GetPutUsersApi, } from 'Constants/ApiRoute';
import { CopyRightText } from 'Constants/ConstantValues';

import delete_icon from '../../assets/delete_icon.png';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { InformationProps } from 'Types/PropsTypes';

interface Checkbox {
  id: number;
  userId: string;
  checked: boolean;
}

const AdminsManagement = ({ pageNum, setPageNum, tableCellSize, setTableCellSize }: InformationProps) => {
  const { userInfo } = useSelector((state: ReduxStateType) => ({
    userInfo: state.userInfo!
  }));
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [adminData, setAdminData] = useState<GetPutUsersApiArrayType>([]);
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);
  const [openAdminsDelete, setOpenAdminsDelete] = useState<boolean>(false);
  const [openAdminDelete, setOpenAdminDelete] = useState<boolean[]>(new Array(adminData.length).fill(false));


  const {role} = userInfo
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

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
        setOpenAdminDelete(new Array(data.users.length).fill(false));
      },
      {
        page_size: tableCellSize,
        role: "SUPER_ADMIN,ADMIN",
        page: pageNum -1,
      },
      (err:any) => {
        console.log('admin 유저 가져오기 실패');
        if(err.response.data.code === 'ERR_001') {
          navigate('/AutoLogout');
        }
      }
    )
  },[tableCellSize, pageNum, rendering]);

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
                <button className='admins_management_button'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/AdminsManagement/CreateAdmins');
                  }}
                >
                  <span><FormattedMessage id='ADD_ADMIN' /></span>
                </button>
              </div>
            }

            <div className='table-st1'>
              <table>
                <thead>
                  <tr>
                    {role === 'SUPER_ADMIN' &&
                      <th>
                        <input 
                          type='checkbox'
                          checked={checkAll}
                          onChange={handleCheckAll}
                        />
                      </th>
                    }
                    <th><FormattedMessage id='ADMIN_ID' /></th>
                    <th><FormattedMessage id='NAME' /></th>
                    <th><FormattedMessage id='PHONE_NUMBER' /></th>
                    {role === 'SUPER_ADMIN' &&
                      <th>
                        <Popconfirm
                          title={formatMessage({ id: 'DELETE_A_ADMIN_ACCOUNT' })}
                          description={formatMessage({ id: 'CONFIRM_DELETE_ADMIN_ACCOUNT' })}
                          okText={formatMessage({ id: 'DELETE' })}
                          cancelText={formatMessage({ id: 'CANCEL' })}
                          open={openAdminsDelete}
                          onConfirm={() => {
                            const userIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
                            CustomAxiosDelete(
                              DeleteUsersApi(userIds),
                              () => {
                                setOpenAdminsDelete(false);

                                message.success(formatMessage({ id: 'SELECTED_ADMIN_DELETE_SUCCESS' }));
                                const render = rendering;
                                const renderTemp = render.concat(true);
                                setRendering(renderTemp);
                              }
                            )
                          }}
                          onCancel={() => {
                            setOpenAdminsDelete(false);
                          }}
                        >
                          <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                            onClick={() => {
                              setOpenAdminsDelete(true);
                            }}
                          />
                        </Popconfirm>
                        {/* <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                          onClick={() => {
                            const userIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
                            CustomAxiosDelete(
                              DeleteUsersApi(userIds),
                              () => {
                                message.success(formatMessage({ id: 'SELECTED_ADMIN_DELETE_SUCCESS' }));
                                const render = rendering;
                                const renderTemp = render.concat(true);
                                setRendering(renderTemp);
                              }
                            )
                          }}
                        /> */}
                      </th>
                    }
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
                          navigate(`/AdminsManagement/detail/Admin/${data.id}`);
                          // sessionStorage.setItem('userUuid', data.id);
                        }                       
                      }}
                      style={{ background: hoveredRow === index ? '#D6EAF5' : 'transparent', cursor: 'pointer' }}
                    >
                      {role === 'SUPER_ADMIN' &&
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
                      }
                      <td>{data.username}</td>
                      <td>{data.name}</td>
                      <td>{data.phoneNumber}</td>
                      {role === 'SUPER_ADMIN' &&
                        <td>
                          <Popconfirm
                            title={formatMessage({ id: 'DELETE_A_ADMIN_ACCOUNT' })}
                            description={formatMessage({ id: 'CONFIRM_DELETE_ADMIN_ACCOUNT' })}
                            okText={formatMessage({ id: 'DELETE' })}
                            cancelText={formatMessage({ id: 'CANCEL' })}
                            open={openAdminDelete[index]}
                            onConfirm={(e : any) => {
                              e.stopPropagation();
                              CustomAxiosDelete(
                                DeleteUsersApi(data.id),
                                () => {
                                  const updatedOpenAdminDelete = [...openAdminDelete];
                                  updatedOpenAdminDelete[index] = false;
                                  setOpenAdminDelete(updatedOpenAdminDelete);

                                  message.success(formatMessage({ id: 'ADMIN_DELETION_COMPLETE' }));
                                  const render = rendering;
                                  const renderTemp = render.concat(true);
                                  setRendering(renderTemp);
                                }
                              )
                            }}
                            onCancel={() => {
                              const updatedOpenAdminDelete = [...openAdminDelete];
                              updatedOpenAdminDelete[index] = false;
                              setOpenAdminDelete(updatedOpenAdminDelete);
                            }}
                          >
                            <img src={delete_icon} width='20px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedOpenAdminDelete = [...openAdminDelete];
                                updatedOpenAdminDelete[index] = true;
                                setOpenAdminDelete(updatedOpenAdminDelete);

                              }}
                            />             
                          </Popconfirm>
                          {/* <img src={delete_icon} width='20px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                            onClick={(e) => {
                              e.stopPropagation();
                              CustomAxiosDelete(
                                DeleteUsersApi(data.id),
                                () => {
                                  message.success(formatMessage({ id: 'ADMIN_DELETION_COMPLETE' }));
                                  const render = rendering;
                                  const renderTemp = render.concat(true);
                                  setRendering(renderTemp);
                                }
                              )
                            }}
                          /> */}
                        </td>
                      }
                    </tr>
                  ))}
                </tbody>
              </table> 
              <div
                className="mt50 mb40"
                style={{textAlign: 'center'}}
              >
                <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage}/>
              </div>
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

export default AdminsManagement;