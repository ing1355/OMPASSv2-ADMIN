import { CustomAxiosGet } from "Components/CustomHook/CustomAxios";
import { useWindowHeightHeader } from "Components/CustomHook/useWindowHeight";
import Header from "Components/Header/Header";
import { GetPasscodeHistoriesApi } from "Constants/ApiRoute";
import { CopyRightText } from "Constants/ConstantValues";
import { GetPasscodeHistoriesApiType, passcodeHistoriesType } from "Types/ServerResponseDataTypes";
import { Pagination, PaginationProps, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

const PasscodeManagement = () => {
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [passcodeHistoryData, setPasscodeHistoryData] = useState<passcodeHistoriesType[]>([]);

  const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber);
    setTableCellSize(pageSizeOptions);
  };

  useEffect(() => {
    CustomAxiosGet(
      GetPasscodeHistoriesApi,
      (data: GetPasscodeHistoriesApiType) => {
        setTotalCount(data.queryTotalCount);
        setPasscodeHistoryData(data.passcodeHistories);
      }, {
        page_size: tableCellSize,
        page: pageNum -1,
      }
    )
  },[tableCellSize, pageNum])

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
            <div>패스코드 관리</div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1>패스코드 관리 이력</h1>
              {/* <div
                className="App-view-manual-font"
              ><Link to='/Manual'><FormattedMessage id='VIEW_MANUAL' /></Link></div> */}
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '1.8%'}}
          >
            <div className='table-st1'>
                <table>
                  <thead>
                    <tr>
                      {/* <th>
                        <input 
                          type='checkbox'
                          checked={checkAll}
                          onChange={handleCheckAll}
                        />
                      </th>
                      <th></th> */}
                      <th><FormattedMessage id="RANK" /></th>
                      <th><FormattedMessage id="ADMIN_ID" /></th>
                      <th><FormattedMessage id="ACTION" /></th>
                      <th>PASSCODE</th>
                      <th><FormattedMessage id="USER_ID" /></th>
                      <th><FormattedMessage id="ENV" /></th>
                      <th><FormattedMessage id="ACTION_DATE" /></th>
                      <th><FormattedMessage id="VALID_TIME" /></th>
                      <th><FormattedMessage id="NUMBER_OF_REMAINING_USES" /></th>
                      {/* <th>
                        <Popconfirm
                          title={formatMessage({ id: 'DELETE_A_FILE' })}
                          description={formatMessage({ id: 'CONFIRM_DELETE_FILE' })}
                          okText={formatMessage({ id: 'DELETE' })}
                          cancelText={formatMessage({ id: 'CANCEL' })}
                          open={openFilesDelete}
                          onConfirm={() => {
                            const versionIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
                            const target = agentData.find((data) => data.downloadTarget === true);
                            const targetVersion = checkboxes.filter((checkbox) => checkbox.userId ===  target?.fileId);

                            if(targetVersion[0]?.checked) {
                              message.error(formatMessage({ id: 'CURRENT_VERSION_CANNOT_BE_DELETED' }));
                            } else {
                              if(versionIds) {
                                CustomAxiosDelete(
                                  DeleteAgentInstallerApi(versionIds),
                                  () => {
                                    setOpenFilesDelete(false);

                                    message.success(formatMessage({ id: 'VERSION_DELETE' }));
                                    
                                    const render = rendering;
                                    const renderTemp = render.concat(true);
                                    setRendering(renderTemp);
                                  }
                                )
                              } else {
                                message.error(formatMessage({ id: 'NO_ITEM_SELECTED' }));
                              }
                            }
                          }}
                          onCancel={() => {
                            setOpenFilesDelete(false);
                          }}
                        >
                          <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                            onClick={() => {
                              setOpenFilesDelete(true);
                            }}
                          />
                        </Popconfirm>
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {passcodeHistoryData.map((data:passcodeHistoriesType, index: number) => (
                      <tr
                        key={'passcode_history_data_'+index}
                      >
                        <td>
                          {data.user.role === 'USER' && <FormattedMessage id='USER' />}
                          {data.user.role === 'ADMIN' && <FormattedMessage id='ADMIN' />}
                          {data.user.role === 'SUPER_ADMIN' && <FormattedMessage id='SUPER_ADMIN' />}
                        </td>
                        <td>{data.passcode.issuerUsername}</td>
                        <td><FormattedMessage id={data.action} /></td>
                        <td>{data.passcode.number}</td>
                        <td>{data.user.username}</td>
                        <td>{data.device.deviceType}</td>
                        <td>{data.passcode.createdAt}</td>
                        <td>{data.passcode.expirationTime ? data.passcode.expirationTime : <FormattedMessage id='UNLIMITED' />}</td>
                        <td>{data.passcode.recycleCount === -1 ? <FormattedMessage id='UNLIMITED' /> :  data.passcode.recycleCount}</td>
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
          </div>    
        </div>
        <div
          className='copyRight-style mb30'
        >
          {CopyRightText}
        </div> 
      </div>
    </>
  );
}

export default PasscodeManagement;