import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import Header from "Components/Header/Header";
import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Pagination, PaginationProps, Popconfirm, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { GetAgentApiArrayType, GetAgentApiDataType, GetAgentApiType } from 'Types/ServerResponseDataTypes';
import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosGetFile, CustomAxiosPatch, CustomAxiosPost, CustomAxiosPut } from 'Components/CommonCustomComponents/CustomAxios';
import { DeleteAgentInstallerApi, GetAgentInstallerApi, GetAgentInstallerDownloadApi, PatchAgentInstallerApi, PostAgentInstallerUploadApi } from 'Constants/ApiRoute';

import delete_icon from '../../assets/delete_icon.png';
import list_download from '../../assets/list_download.png';
import download_installer_icon from '../../assets/download_installer_icon.png';
import { CopyRightText } from 'Constants/ConstantValues';
import { InformationProps } from 'Types/PropsTypes';
import { error1Fun } from 'Components/CommonCustomComponents/CommonFunction';

interface Checkbox {
  id: number;
  userId: number;
  checked: boolean;
}

const AgentManagement = ({ pageNum, setPageNum, tableCellSize, setTableCellSize }: InformationProps) => {
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [agentData, setAgentData] = useState<GetAgentApiArrayType>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [openFileDelete, setOpenFileDelete] = useState<boolean[]>(new Array(agentData.length).fill(false));
  const [openFilesDelete, setOpenFilesDelete] = useState<boolean>(false);
  const [isAgentDataLoading, setIsAgentDataLoading] = useState<boolean>(true);
  const [isAgentFileDisable, setIsAgentFileDisable] = useState<boolean[]>(new Array(agentData.length).fill(false));

  const { formatMessage } = useIntl();
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

  useEffect(() => {
    setIsAgentDataLoading(true);
    CustomAxiosGet(
      GetAgentInstallerApi,
      (data: GetAgentApiDataType) => {
        setAgentData(data.agentProgramHistories);
        setTotalCount(data.queryTotalCount);
        setOpenFileDelete(new Array(data.agentProgramHistories.length).fill(false));
        setIsAgentFileDisable(new Array(data.agentProgramHistories.length).fill(false));
      },
      {
        page_size: tableCellSize,
        page: pageNum -1
      },
      (err:any) => {
        console.log('agent data get 실패');
        error1Fun(err, navigate);
        // if(err.response.data.code === 'ERR_001') {
        //   navigate('/AutoLogout');
        // }
      },
      {},
      () => {
        setIsAgentDataLoading(false);
      }
    )
  },[tableCellSize, pageNum, rendering]);

  // agentData가 변경되면 checkboxes 초기화
  useEffect(() => {
    const updatedCheckboxes = agentData.map((data, index) => ({
      id: index,
      userId: data.fileId,
      checked: false,
    }));
    setCheckboxes(updatedCheckboxes);
  }, [agentData]);

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
            <div><FormattedMessage id='VERSION_MANAGEMENT' /></div>
            <div
              className='mb40'
              style={{display: 'flex'}}
            >
              <h1><FormattedMessage id='VERSION_LIST' /></h1>
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '1.8%'}}
          >
             <div
              style={{float: 'right'}}
              className='mb20'
            >
              <button className='admins_management_button'
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/AgentManagement/upload');
                }}
              >
                <span><FormattedMessage id='UPLOAD_VERSION' /></span>
              </button>

            </div>
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
                    <th style={{width: '46px'}}></th>
                    <th><FormattedMessage id='VERSION' /></th>
                    <th>OS</th>
                    <th><FormattedMessage id='FILE_NAME' /></th>
                    <th><FormattedMessage id='UPLOAD_DATE' /></th>
                    <th><FormattedMessage id='UPLOADER' /></th>
                    <th style={{width: '70px'}}><FormattedMessage id='DOWNLOAD' /></th>
                    <th style={{width: '120px'}}><FormattedMessage id='CURRENT_VERSION_SETTING' /></th>
                    <th>
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
                                }, {},
                                (err:any) => {
                                  error1Fun(err, navigate);
                                  // if(err.response.data.code === 'ERR_001') {
                                  //   navigate('/AutoLogout');
                                  // }
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
                      {/* <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                        onClick={() => {
                          const versionIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
                          const target = agentData.find((data) => data.downloadTarget === true);
                          const targetVersion = checkboxes.filter((checkbox) => checkbox.userId ===  target?.fileId);

                          if(targetVersion[0]?.checked) {
                            message.error('현재 버전은 삭제할 수 없습니다.');
                          } else {
                            if(versionIds) {
                              CustomAxiosDelete(
                                DeleteAgentInstallerApi(versionIds),
                                () => {
                                  message.success('선택한 버전 삭제 완료');
                                  const render = rendering;
                                  const renderTemp = render.concat(true);
                                  setRendering(renderTemp);
                                }
                              )
                            } else {
                              message.error('선택한 항목이 없습니다.');
                            }
                          }
                        }}
                      /> */}
                    </th>
                  </tr>
                </thead>

                {isAgentDataLoading ?
                  <tbody>
                    <tr>
                      <td colSpan={12}>
                        <FormattedMessage id='LOADING' />
                      </td>
                    </tr>
                  </tbody>
                :
                  <tbody>
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
                          {isAgentFileDisable[index] ?
                          <img 
                            src={download_installer_icon}
                            style={{cursor: 'default', pointerEvents: 'none'}}
                            width='20px'
                          />                          
                          :
                          <img 
                            src={list_download}
                            style={{cursor: 'pointer'}}
                            width='18px'
                            onClick={() => {
                              const updatedIsAgentFileDisable= [...isAgentFileDisable];
                              updatedIsAgentFileDisable[index] = true;
                              setIsAgentFileDisable(updatedIsAgentFileDisable);
                              const versionName = data.fileName;
                              CustomAxiosGetFile(
                                GetAgentInstallerDownloadApi,
                                (res:any) => {
                                  const fileDownlaoadUrl = URL.createObjectURL(res.data);
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
                                (err:any) => {
                                  message.error(formatMessage({ id: 'DOWNLOAD_FAILED' }));
                                }, {},
                                () => {
                                  const updatedIsAgentFileDisable= [...isAgentFileDisable];
                                  updatedIsAgentFileDisable[index] = false;
                                  setIsAgentFileDisable(updatedIsAgentFileDisable);
                                }
                              )
                            }}
                          />
                          }
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
                                },{},
                                (err:any) => {
                                  error1Fun(err, navigate);
                                  // if(err.response.data.code === 'ERR_001') {
                                  //   navigate('/AutoLogout');
                                  // }
                                }
                              )
                            }}
                          ><FormattedMessage id='APPLY' /></button>
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
                                  },{},
                                  (err:any) => {
                                    error1Fun(err, navigate);
                                    // if(err.response.data.code === 'ERR_001') {
                                    //   navigate('/AutoLogout');
                                    // }
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
                          {/* <img src={delete_icon} width='20px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
                            onClick={() => {
                              if(data.downloadTarget) {
                                message.error('현재 버전은 삭제할 수 없습니다.');
                              } else {
                                CustomAxiosDelete(
                                  DeleteAgentInstallerApi(data.fileId.toString()),
                                  () => {
                                    message.success('버전 삭제 완료');
                                    const render = rendering;
                                    const renderTemp = render.concat(true);
                                    setRendering(renderTemp);
                                  }
                                )
                              }
                            }}
                          />                           */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                }
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

export default AgentManagement;