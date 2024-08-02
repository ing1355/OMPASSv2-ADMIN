import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import viewPasscodeIcon from '../../assets/passwordVisibleIcon.png';
import dont_look_password from '../../assets/passwordHiddenIcon.png';
import { useSelector } from "react-redux";
import Contents from "Components/Layout/Contents";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { GetPasscodeHistoriesFunc } from "Functions/ApiFunctions";
import { useNavigate } from "react-router";
import { convertUTCToKST, getDateTimeString } from "Functions/GlobalFunctions";
import { ViewPasscode } from "Components/Users/UserDetailComponents";

const PasscodeManagement = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableData, setTableData] = useState<PasscodeHistoryDataType[]>([]);
  const [viewPasscodes, setViewPasscodes] = useState<PasscodeHistoryDataType['id'][]>([]);
  const [dataLoading, setDataLoading] = useState(false)

  const GetDatas = async (params: CustomTableSearchParams) => {
    setDataLoading(true)
    const _params: GeneralParamsType = {
      page_size: params.size,
      page: params.page
    }
    if (params.type) {
      _params[params.type] = params.value
    }
    GetPasscodeHistoriesFunc(_params, ({ results, totalCount }) => {
      setTableData(results)
      setTotalCount(totalCount)
    }).finally(() => {
      setDataLoading(false)
    })
  }

  useEffect(() => {
    GetDatas({
      page: 1,
      size: 10
    })
  }, [])

  return (
    <>
      <Contents loading={dataLoading}>
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

        <div>
          <CustomTable<PasscodeHistoryDataType, {}>
            theme='table-st1'
            datas={tableData}
            pagination
            totalCount={totalCount}
            searchOptions={["applicationName"]}
            onSearchChange={(data) => {
              GetDatas(data)
            }}
            onBodyRowClick={(data) => {
              navigate(`/UserManagement/detail/${data.portalUser.id}`, {
                state: {
                  targetId: data.authenticationInfoId
                }
              })
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
                render: (data, index, row) => row.createdAt >= row.passcode.expiredAt || row.passcode.recycleCount === 0 ?
                  <FormattedMessage id='EXPIRED' />
                  :
                  <FormattedMessage id={data} />
              },
              {
                key: 'number',
                title: 'PASSCODE',
                render: (data, ind, row) => <ViewPasscode code={row.passcode.number} />,
                width: 200
              },
              {
                key: 'recycleCount',
                title: <FormattedMessage id="REMAINING_USES" />,
                render: (data, ind, row) => row.passcode.recycleCount === -1 ? "∞" : `${row.passcode.recycleCount} 회`
              },
              {
                key: 'createdAt',
                title: <FormattedMessage id="ACTION_DATE" />,
                render: (data) => getDateTimeString(convertUTCToKST(new Date(data)))
              },
              {
                key: 'expirationTime',
                title: <FormattedMessage id="VALID_TIME" />,
                render: (_, ind, row) => {
                  const data = row.passcode.expiredAt
                  if (!data) return "∞"
                  return getDateTimeString(convertUTCToKST(new Date(data)))
                }
              },
            ]}
          />
        </div>
      </Contents>
    </>
  );
}

export default PasscodeManagement;