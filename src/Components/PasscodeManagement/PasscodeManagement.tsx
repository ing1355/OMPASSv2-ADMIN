import { CustomAxiosGet } from "Components/CommonCustomComponents/CustomAxios";
import { useWindowHeightHeader } from "Components/CommonCustomComponents/useWindowHeight";
import Header from "Components/Header/Header";
import { GetPasscodeHistoriesApi } from "Constants/ApiRoute";
import { CopyRightText } from "Constants/ConstantValues";
import { GetPasscodeHistoriesApiType, passcodeHistoriesType } from "Types/ServerResponseDataTypes";
import { Pagination, PaginationProps, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import view_password from '../../assets/view_password.png';
import dont_look_password from '../../assets/dont_look_password.png';
import { useSelector } from "react-redux";
import { ReduxStateType } from "Types/ReduxStateTypes";
import { useNavigate } from "react-router";

const PasscodeManagement = () => {
  const { lang } = useSelector((state: ReduxStateType) => ({
    lang: state.lang,
  }));
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [passcodeHistoryData, setPasscodeHistoryData] = useState<passcodeHistoriesType[]>([]);
  const [viewPasscodes, setViewPasscodes] = useState<boolean[]>(new Array(passcodeHistoryData.length).fill(false));

  const navigate = useNavigate();

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
      }, (err:any) => {
        if(err.response.data.code === 'ERR_001') {
          navigate('/AutoLogout');
        }
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
            <div><FormattedMessage id="PASSCODE_MANAGEMENT" /></div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1><FormattedMessage id="PASSCODE_MANAGEMENT_HISTORY" /></h1>
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
                      <th><FormattedMessage id="ADMIN_ID" /></th>
                      <th><FormattedMessage id="ACTION" /></th>
                      <th>PASSCODE</th>
                      <th style={{width: '20px'}}></th>
                      <th><FormattedMessage id="USER_ID" /></th>
                      <th style={(lang === 'en' ? {width: '60px'} : {})}><FormattedMessage id="RANK" /></th>
                      <th><FormattedMessage id="ENV" /></th>
                      <th style={{width: '110px'}}><FormattedMessage id="ACTION_DATE" /></th>
                      <th style={{width: '110px'}}><FormattedMessage id="VALID_TIME" /></th>
                      <th><FormattedMessage id="REMAINING_USES" /></th>
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
                          {/* {data.passcode.issuerUsername} */}
                          {data.passcode.createdAt >= data.passcode.expirationTime || data.passcode.recycleCount === 0 ? 
                          '-'
                          :
                          data.passcode.issuerUsername
                          }
                        </td>
                        <td>
                          {data.passcode.createdAt >= data.passcode.expirationTime || data.passcode.recycleCount === 0 ? 
                          <FormattedMessage id='EXPIRED' />
                          :
                          <FormattedMessage id={data.action} />
                          }
                        </td>
                        <td
                          style={{width: '50px'}}
                        >
                          {viewPasscodes[index] ?
                            <span>{data.passcode.number}</span>
                          :
                            <span>⦁⦁⦁⦁⦁⦁</span>
                          }
                        </td>
                        <td>
                          <img
                            src={viewPasscodes[index] ? view_password : dont_look_password}
                            width='20px'
                            style={{ opacity: 0.5, position: 'relative', top: '4px' }}
                            onClick={() => {
                              const updatedViewPasscodes = [...viewPasscodes];
                              updatedViewPasscodes[index] = !updatedViewPasscodes[index];
                              setViewPasscodes(updatedViewPasscodes);
                            }}
                          />
                        </td>
                        <td>{data.user.username}</td>
                        <td>
                          {data.user.role === 'USER' && <FormattedMessage id='USER' />}
                          {data.user.role === 'ADMIN' && <FormattedMessage id='ADMIN' />}
                          {data.user.role === 'SUPER_ADMIN' && <FormattedMessage id='SUPER_ADMIN' />}
                        </td>
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