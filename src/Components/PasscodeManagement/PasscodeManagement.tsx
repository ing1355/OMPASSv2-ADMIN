import { Pagination, PaginationProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import view_password from '../../assets/passwordVisibleIcon.png';
import dont_look_password from '../../assets/passwordHiddenIcon.png';
import { useSelector } from "react-redux";
import Contents from "Components/Layout/Contents";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { GetPasscodeHistoriesFunc } from "Functions/ApiFunctions";
import { useNavigate } from "react-router";

const PasscodeManagement = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [tableData, setTableData] = useState<PasscodeHistoryDataType[]>([]);
  const [viewPasscodes, setViewPasscodes] = useState<PasscodeHistoryDataType['id'][]>([]);
  
  const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber);
    setTableCellSize(pageSizeOptions);
  };

  useEffect(() => {
    GetPasscodeHistoriesFunc({
      page_size: tableCellSize,
      page: pageNum
    }, data => {
      setTotalCount(data.totalCount);
      setTableData(data.results)
    })
  }, [tableCellSize, pageNum])

  return (
    <>
      <Contents>
        <div
          className='agent_management_header'
        >
          <div><FormattedMessage id="PASSCODE_MANAGEMENT" /></div>
          <div
            className='mb40'
            style={{ display: 'flex' }}
          >
            <h1><FormattedMessage id="PASSCODE_MANAGEMENT_HISTORY" /></h1>
          </div>
        </div>

        <div
          style={{ width: '1200px', marginTop: '1.8%' }}
        >
          <CustomTable<PasscodeHistoryDataType, {}>
            theme='table-st1'
            datas={tableData}
            onBodyRowClick={(data) => {
              navigate(`/UserManagement/detail/${data.portalUser.id}`)
            }}
            hover
            columns={[
              {
                key: 'applicationName',
                title: "어플리케이션명"
              },
              {
                key: 'issuerUsername',
                title: <FormattedMessage id="ADMIN_ID" />,
                render: (data, index, row) => row.passcode.issuerUsername
              },
              {
                key: 'portalUsername',
                title: "포탈 아이디",
                render: (data, ind, row) => row.portalUser.username
              },
              {
                key: 'rpUsername',
                title: <FormattedMessage id="USER_ID" />,
                render: (data, ind, row) => row.rpUser.username
              },
              {
                key: 'action',
                title: <FormattedMessage id="ACTION" />,
                render: (data, index, row) => row.createdAt >= row.passcode.expirationTime || row.passcode.recycleCount === 0 ?
                  <FormattedMessage id='EXPIRED' />
                  :
                  <FormattedMessage id={data} />
              },
              {
                key: 'number',
                title: 'PASSCODE',
                render: (data, index, row) => viewPasscodes.includes(row.id) ?
                <span>{row.passcode.number}</span>
                  :
                  <span>⦁⦁⦁⦁⦁⦁</span>
              },
              {
                key: 'viewPsscodes',
                title: '',
                render: (_, index, row) => <img
                  src={viewPasscodes.includes(row.id) ? view_password : dont_look_password}
                  width='20px'
                  style={{ opacity: 0.5, position: 'relative', top: '4px' }}
                  onMouseEnter={() => {
                    setViewPasscodes(viewPasscodes.concat(row.id))
                  }}
                  onMouseLeave={() => {
                    setViewPasscodes(viewPasscodes.filter(p => p !== row.id))
                  }}
                />
              },
              {
                key: 'expirationTime',
                title: <FormattedMessage id="VALID_TIME" />,
                render: (data, ind, row) => row.passcode.expirationTime
                // render: (data, ind, row) => row.passcode.expirationTime === -1 ? <FormattedMessage id='UNLIMITED' /> : row.passcode.expirationTime
              },
              {
                key: 'recycleCount',
                title: <FormattedMessage id="REMAINING_USES" />,
                render: (data, ind, row) => row.passcode.recycleCount === -1 ? <FormattedMessage id='UNLIMITED' /> : `${row.passcode.recycleCount} 회`
              },
              {
                key: 'createdAt',
                title: <FormattedMessage id="ACTION_DATE" />
              }
            ]}
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
  );
}

export default PasscodeManagement;