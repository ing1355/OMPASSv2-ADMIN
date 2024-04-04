import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';
import './UserManagement.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { message, Pagination, PaginationProps, Popconfirm } from 'antd';
import { CustomAxiosDelete } from 'Components/CommonCustomComponents/CustomAxios';
import { DeleteUsersApi, } from 'Constants/ApiRoute';

import delete_icon from '../../assets/delete_icon.png';
import { useSelector } from 'react-redux';
import { ReduxStateType } from 'Types/ReduxStateTypes';
import { InformationProps } from 'Types/PropsTypes';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import CustomTable, { CustomTableColumnType } from 'Components/CommonCustomComponents/CustomTable';
import { GetUserDataListFunc, UserDataType } from 'Functions/ApiFunctions';

interface Checkbox {
  id: number;
  userId: string;
  checked: boolean;
}

type UserTableDataType = UserDataType & {
  check: boolean
}

const UserManagement = ({ pageNum, setPageNum, tableCellSize, setTableCellSize }: InformationProps) => {
  const { userInfo } = useSelector((state: ReduxStateType) => ({
    userInfo: state.userInfo!
  }));
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userData, setUserdata] = useState<UserTableDataType[]>([]);
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);
  const [openUsersDelete, setOpenUsersDelete] = useState<boolean>(false);
  const [openUserDelete, setOpenUserDelete] = useState<boolean[]>(new Array(userData.length).fill(false));

  const { role } = userInfo

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
    const updatedCheckboxes = userData.map((data, index) => ({
      id: index,
      userId: data.userId,
      checked: false,
    }));
    setCheckboxes(updatedCheckboxes);
  }, [userData]);


  useEffect(() => {
    GetUserDataListFunc({
      page_size: tableCellSize,
      page: pageNum - 1,
    }, ({results, totalCount}) => {
      setUserdata(results.map(_ => ({
        ..._,
        check: false
      })));
      setTotalCount(totalCount);
      setOpenUserDelete(new Array(results.length).fill(false));
    }).catch(err => {
      console.log('admin 유저 가져오기 실패');
      console.log(err)
    })
  }, [tableCellSize, pageNum, rendering]);

  const tableColumns: CustomTableColumnType<UserTableDataType>[] = [
    {
      key: 'check',
      title: <input
        type='checkbox'
        checked={checkAll}
        onChange={handleCheckAll}
      />,
      render: (_, index, data) => <input
        type='checkbox'
        value={data.userId}
        id={index.toString()}
        checked={checkboxes[index]?.checked || false}
      />
    },
    {
      key: 'username',
      title: <FormattedMessage id='ADMIN_ID' />
    },
    {
      key: 'name',
      title: <FormattedMessage id='NAME' />,
      render: (data) => data.firstName + data.lastName
    },
    // {
    //   key: 'role',
    //   title: <FormattedMessage id="RANK"/>,
    //   render: (data) => <FormattedMessage id={data} />
    // },
    {
      key: 'phone',
      title: <FormattedMessage id='PHONE_NUMBER' />
    },
    {
      key: 'delete',
      title: <Popconfirm
        title={<FormattedMessage id="DELETE_A_ADMIN_ACCOUNT" />}
        description={<FormattedMessage id='CONFIRM_DELETE_ADMIN_ACCOUNT' />}
        okText={<FormattedMessage id='DELETE' />}
        cancelText={<FormattedMessage id='CANCEL' />}
        open={openUsersDelete}
        onConfirm={() => {
          const userIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
          CustomAxiosDelete(
            DeleteUsersApi(userIds),
            () => {
              setOpenUsersDelete(false);

              message.success(formatMessage({ id: 'SELECTED_ADMIN_DELETE_SUCCESS' }));
              const render = rendering;
              const renderTemp = render.concat(true);
              setRendering(renderTemp);
            }
          )
        }}
        onCancel={(e) => {
          e?.stopPropagation()
          setOpenUsersDelete(false);
        }}
      >
        <img src={delete_icon} width='25px' style={{ opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer' }}
          onClick={() => {
            setOpenUsersDelete(true);
          }}
        />
      </Popconfirm>,
      render: (_, index, data) => <Popconfirm
        title={formatMessage({ id: 'DELETE_A_ADMIN_ACCOUNT' })}
        description={formatMessage({ id: 'CONFIRM_DELETE_ADMIN_ACCOUNT' })}
        okText={formatMessage({ id: 'DELETE' })}
        cancelText={formatMessage({ id: 'CANCEL' })}
        open={openUserDelete[index]}
        onConfirm={(e: any) => {
          e.stopPropagation();
          CustomAxiosDelete(
            DeleteUsersApi(data.userId),
            () => {
              const updatedOpenAdminDelete = [...openUserDelete];
              updatedOpenAdminDelete[index] = false;
              setOpenUserDelete(updatedOpenAdminDelete);

              message.success(formatMessage({ id: 'ADMIN_DELETION_COMPLETE' }));
              const render = rendering;
              const renderTemp = render.concat(true);
              setRendering(renderTemp);
            }
          )
        }}
        onCancel={() => {
          const updatedOpenAdminDelete = [...openUserDelete];
          updatedOpenAdminDelete[index] = false;
          setOpenUserDelete(updatedOpenAdminDelete);
        }}
      >
        <img src={delete_icon} width='20px' style={{ opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            const updatedOpenAdminDelete = [...openUserDelete];
            updatedOpenAdminDelete[index] = true;
            setOpenUserDelete(updatedOpenAdminDelete);

          }}
        />
      </Popconfirm>
    }
  ]

  return (
    <>
      <Contents>
        <ContentsHeader title="USER_MANAGEMENT" subTitle='USER_LIST' />

        <div
          style={{ width: '1200px', marginTop: '1.8%' }}
        >
          {role === 'ROOT' &&
            <div
              style={{ float: 'right' }}
              className='mb20'
            >
              <button className='admins_management_button'
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/UserManagement/CreateAdmins');
                }}
              >
                <span><FormattedMessage id='ADD_USER' /></span>
              </button>
            </div>
          }
          <CustomTable<UserTableDataType>
            theme='table-st1'
            columns={tableColumns}
            onBodyRowHover={(row, ind, arr) => {
              handleRowHover(ind)
            }}
            onBodyRowMouseLeave={() => {
              handleRowHover(-1)
            }}
            onBodyRowClick={(row, ind, arr) => {
              navigate(`/UserManagement/detail/Admin/${row.userId}`);
            }}
            bodyRowClassName={'pointer'}
            bodyRowStyle={(row, ind, arr) => ({
              background: hoveredRow === ind ? '#D6EAF5' : 'transparent', cursor: 'pointer'
            })}
            datas={userData}
          />
          <div
            className="mt50 mb40"
            style={{ textAlign: 'center' }}
          >
            <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage} />
          </div>
        </div>
      </Contents>
    </>
  )
}

export default UserManagement;