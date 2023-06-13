import { useWindowHeightHeader } from "Components/CustomHook/useWindowHeight";
import Header from "Components/Header/Header";
import { CopyRightText } from "Constants/ConstantValues";
import { Pagination, PaginationProps, Popconfirm } from "antd";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

const PasscodeManagement = () => {
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);

    const onChangePage: PaginationProps['onChange'] = (pageNumber, pageSizeOptions) => {
    setPageNum(pageNumber);
    setTableCellSize(pageSizeOptions);
  };

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
                      <th>패스코드</th>
                      <th>발급 관리자 아이디</th>
                      <th>발급 일시</th>
                      <th>유효 시간</th>
                      <th>남은 사용 횟수</th>
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
                  {/* <tbody>
                    {agentData.map((data: GetAgentApiType, index: number) => (
                      <tr
                        key={'agent_data_' + index}
                        onMouseEnter={() => handleRowHover(index)}
                        onMouseLeave={() => handleRowHover(-1)}
                        style={{ background: hoveredRow === index ? '#D6EAF5' : 'transparent', cursor: 'default' }}
                      >
                        <td>
                          <input 
                            type='checkbox' 
                            value={data.fileId}
                            id={index.toString()}
                            checked={checkboxes[index]?.checked || false}
                            onChange={handleCheckboxChange}
                          />
                        </td>
                        <td>{data.downloadTarget && <span className='manager-mark ml10'><FormattedMessage id='CURRENT' /></span>}</td>
                        <td>{data.version}</td>
                        <td>{data.os}</td>
                        <td>{data.fileName}</td>
                        <td>{data.uploadDate}</td>
                        <td>{data.uploader}</td>
                        <td>
                          <img 
                            src={list_download}
                            style={{cursor: 'pointer'}}
                            width='18px'
                            onClick={() => {
                              const versionName = 'ompass_installer_v' + data.version + '.zip';
                              CustomAxiosGetFile(
                                GetAgentInstallerDownloadApi,
                                (data:any) => {
                                  const fileDownlaoadUrl = URL.createObjectURL(data);
                                  console.log(fileDownlaoadUrl)
                                  const downloadLink = document.createElement('a');
                                  downloadLink.href = fileDownlaoadUrl;
                                  downloadLink.download = versionName;
                                  document.body.appendChild(downloadLink);
                                  downloadLink.click();
                                  document.body.removeChild(downloadLink);
                                  URL.revokeObjectURL(fileDownlaoadUrl);
                                },
                                {
                                  file_id: data.fileId
                                },
                                (error: any) => {
                                  message.error(formatMessage({ id: 'DOWNLOAD_FAILED' }));
                                }
                              )
                            }}
                          />
                        </td>
                        <td>
                          <button
                            className={'button-st4 agent_management_target_version_btn ' + (data.downloadTarget ? 'disable' : '' )}
                            disabled={data.downloadTarget ? true : false}
                            onClick={() => {
                              CustomAxiosPatch(
                                PatchAgentInstallerApi(data.fileId),
                                () => {
                                  message.success(formatMessage({ id: 'CURRENT_VERSION_CHANGE_COMPLETE' }));
                                  const render = rendering;
                                  const renderTemp = render.concat(true);
                                  setRendering(renderTemp);
                                }
                              )
                            }}
                          ><FormattedMessage id='MODIFY_' /></button>
                        </td>
                        <td>
                          <Popconfirm
                            title={formatMessage({ id: 'DELETE_A_FILE' })}
                            description={formatMessage({ id: 'CONFIRM_DELETE_FILE' })}
                            okText={formatMessage({ id: 'DELETE' })}
                            cancelText={formatMessage({ id: 'CANCEL' })}
                            open={openFileDelete[index]}
                            onConfirm={() => {
                              if(data.downloadTarget) {
                                message.error(formatMessage({ id: 'CURRENT_VERSION_CANNOT_BE_DELETED' }));
                              } else {
                                CustomAxiosDelete(
                                  DeleteAgentInstallerApi(data.fileId.toString()),
                                  () => {
                                    const updatedOpenFileDelete = [...openFileDelete];
                                    updatedOpenFileDelete[index] = false;
                                    setOpenFileDelete(updatedOpenFileDelete);

                                    message.success(formatMessage({ id: 'VERSION_DELETE' }));
                                    const render = rendering;
                                    const renderTemp = render.concat(true);
                                    setRendering(renderTemp);
                                  }
                                )
                              }
                            }}
                            onCancel={() => {
                              const updatedOpenFileDelete = [...openFileDelete];
                              updatedOpenFileDelete[index] = false;
                              setOpenFileDelete(updatedOpenFileDelete);
                            }}
                          >
                            <img src={delete_icon} width='20px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                              onClick={() => {
                              const updatedOpenFileDelete = [...openFileDelete];
                              updatedOpenFileDelete[index] = true;
                              setOpenFileDelete(updatedOpenFileDelete);
                              }}
                            />              
                          </Popconfirm>
                        </td>
                      </tr>
                    ))}
                  </tbody> */}
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