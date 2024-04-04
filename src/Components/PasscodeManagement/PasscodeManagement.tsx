import { useWindowHeightHeader } from "Components/CommonCustomComponents/useWindowHeight";
import { Pagination, PaginationProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import view_password from '../../assets/view_password.png';
import dont_look_password from '../../assets/dont_look_password.png';
import { useSelector } from "react-redux";
import { ReduxStateType } from "Types/ReduxStateTypes";
import Contents from "Components/Layout/Contents";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { GetPasscodeHistoriesFunc, PasscodeHistoryDataType } from "Functions/ApiFunctions";

type PasscodeManagementTableDataType = PasscodeHistoryDataType['passcode'] & PasscodeHistoryDataType['rpUser'] & {
  action: string
  createdAt: string
  viewPsscodes: boolean
}

const PasscodeManagement = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [passcodeHistoryData, setPasscodeHistoryData] = useState<PasscodeHistoryDataType[]>([]);
  const [viewPasscodes, setViewPasscodes] = useState<boolean[]>(new Array(passcodeHistoryData.length).fill(false));
  const tableDatas = useMemo(() => passcodeHistoryData.map(_ => ({
    ..._.passcode,
    ..._.rpUser,
    action: _.action,
    createdAt: _.createdAt
  }) as PasscodeManagementTableDataType), [passcodeHistoryData])

  const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber);
    setTableCellSize(pageSizeOptions);
  };

  useEffect(() => {
    GetPasscodeHistoriesFunc({
      page_size: tableCellSize,
      page: pageNum - 1
    }, data => {
      setTotalCount(data.totalCount);
      setPasscodeHistoryData(data.results);
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
          <CustomTable<PasscodeManagementTableDataType>
            theme='table-st1'
            datas={tableDatas}
            columns={[
              {
                key: 'issuerUsername',
                title: <FormattedMessage id="ADMIN_ID" />,
                render: (data, index, row) => row.createdAt >= row.expirationTime || row.recycleCount === 0 ?
                  '-'
                  :
                  data
              },
              {
                key: 'action',
                title: <FormattedMessage id="ACTION" />,
                render: (data, index, row) => row.createdAt >= row.expirationTime || row.recycleCount === 0 ?
                  <FormattedMessage id='EXPIRED' />
                  :
                  <FormattedMessage id={data} />
              },
              {
                key: 'number',
                title: 'PASSCODE',
                render: (data, index) => viewPasscodes[index] ?
                  <span>{data}</span>
                  :
                  <span>⦁⦁⦁⦁⦁⦁</span>
              },
              {
                key: 'viewPsscodes',
                title: '',
                render: (_, index) => <img
                  src={viewPasscodes[index] ? view_password : dont_look_password}
                  width='20px'
                  style={{ opacity: 0.5, position: 'relative', top: '4px' }}
                  onClick={() => {
                    const updatedViewPasscodes = [...viewPasscodes];
                    updatedViewPasscodes[index] = !updatedViewPasscodes[index];
                    setViewPasscodes(updatedViewPasscodes);
                  }}
                />
              },
              {
                key: 'username',
                title: <FormattedMessage id="USER_ID" />
              },
              // {
              //   key: 'role',
              //   title: <FormattedMessage id="RANK" />,
              //   render: (data) => <>
              //     {data === 'USER' && <FormattedMessage id='USER' />}
              //     {data === 'ADMIN' && <FormattedMessage id='ADMIN' />}
              //     {data === 'ROOT' && <FormattedMessage id='ROOT' />}
              //   </>
              // },
              // {
              //   key: 'deviceType',
              //   title: <FormattedMessage id="ENV" />
              // },
              {
                key: 'createdAt',
                title: <FormattedMessage id="ACTION_DATE" />
              },
              {
                key: 'expirationTime',
                title: <FormattedMessage id="VALID_TIME" />,
                render: (data) => data ? data : <FormattedMessage id='UNLIMITED' />
              },
              {
                key: 'recycleCount',
                title: <FormattedMessage id="REMAINING_USES" />,
                render: (data) => data === -1 ? <FormattedMessage id='UNLIMITED' /> : data
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