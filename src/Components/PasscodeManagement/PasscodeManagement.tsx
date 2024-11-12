import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import Contents from "Components/Layout/Contents";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { GetPasscodeHistoriesFunc } from "Functions/ApiFunctions";
import { useNavigate } from "react-router";
import { convertUTCStringToKSTString } from "Functions/GlobalFunctions";
import { ViewPasscode } from "Components/Users/UserDetailComponents";
import ContentsHeader from "Components/Layout/ContentsHeader";

const PasscodeManagement = () => {
  const { userInfo } = useSelector((state: ReduxStateType) => ({
    userInfo: state.userInfo!,
  }));
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableData, setTableData] = useState<PasscodeHistoryDataType[]>([]);
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

  return (
    <>
      <Contents loading={dataLoading}>
        <ContentsHeader title="PASSCODE_MANAGEMENT_HISTORY" subTitle="PASSCODE_MANAGEMENT_HISTORY">
        </ContentsHeader>
        <CustomTable<PasscodeHistoryDataType, {}>
          theme='table-st1'
          datas={tableData}
          pagination
          totalCount={totalCount}
          searchOptions={[{
            key: 'applicationName',
            type: 'string'
          }, {
            key: 'issuerUsername',
            type: 'string'
          }, {
            key: 'portalUsername',
            type: 'string'
          }, {
            key: 'rpUsername',
            type: 'string'
          }]}
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
              render: (data, ind, row) => {
                const isSelf = row.portalUser.id === userInfo.userId
                const canModify = isSelf || (userInfo.role === 'ADMIN' && row.portalUser.role === 'USER') || (userInfo.role === 'ROOT' && row.portalUser.role !== 'ROOT')
                return <ViewPasscode code={row.passcode.number} noView={!canModify} />
              },
              width: 200
            },
            {
              key: 'recycleCount',
              title: <FormattedMessage id="USES_COUNT" />,
              render: (data, ind, row) => row.passcode.recycleCount === -1 ? "∞" : `${row.passcode.recycleCount} 회`
            },
            {
              key: 'createdAt',
              title: <FormattedMessage id="ACTION_DATE" />,
              render: (data) => convertUTCStringToKSTString(data)
            },
            {
              key: 'expirationTime',
              title: <FormattedMessage id="VALID_TIME" />,
              render: (_, ind, row) => {
                const data = row.passcode.expiredAt
                if (!data) return "∞"
                return convertUTCStringToKSTString(data)
              }
            },
          ]}
        />
      </Contents>
    </>
  );
}

export default PasscodeManagement;