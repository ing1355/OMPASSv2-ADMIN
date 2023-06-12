import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import Header from "Components/Header/Header";
import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import { Link } from 'react-router-dom';
import { Col, Pagination, PaginationProps, Popconfirm, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { GetAgentApiArrayType, GetAgentApiDataType, GetAgentApiType } from 'Types/ServerResponseDataTypes';
import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosGetFile, CustomAxiosPatch, CustomAxiosPost, CustomAxiosPut } from 'Components/CustomHook/CustomAxios';
import { DeleteAgentInstallerApi, GetAgentInstallerApi, GetAgentInstallerDownloadApi, PatchAgentInstallerApi, PostAgentInstallerUploadApi } from 'Constants/ApiRoute';

import delete_icon from '../../assets/delete_icon.png';
import list_download from '../../assets/list_download.png';
import { CopyRightText } from 'Constants/ConstantValues';

interface Checkbox {
  id: number;
  userId: number;
  checked: boolean;
}

const AgentManagement = () => {
  const height = useWindowHeightHeader();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [agentData, setAgentData] = useState<GetAgentApiArrayType>([]);
  const [isAddVersion, setIsAddVersion] = useState<boolean>(false);
  const [isVersionAlert, setIsVersionAlert] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [fileName, setFileName] = useState('');
  const [openFileDelete, setOpenFileDelete] = useState<boolean[]>(new Array(agentData.length).fill(false));
  const [openFilesDelete, setOpenFilesDelete] = useState<boolean>(false);

  const { formatMessage } = useIntl();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const name = fileInput.files[0].name;
      setFileName(name);
    }
  };

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
    CustomAxiosGet(
      GetAgentInstallerApi,
      (data: GetAgentApiDataType) => {
        setAgentData(data.agentProgramHistories);
        setTotalCount(data.queryTotalCount);
        setOpenFileDelete(new Array(data.agentProgramHistories.length).fill(false));
      },
      {
        page_size: tableCellSize,
        page: pageNum -1
      },
      () => {

      }
    )
  },[tableCellSize, pageNum, rendering, isAddVersion]);

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
              {/* <div
                className="App-view-manual-font"
              ><Link to='/Manual'><FormattedMessage id='VIEW_MANUAL' /></Link></div> */}
            </div>
          </div>

          <div 
            style={{width: '1200px', marginTop: '1.8%'}}
          >
            <div
              style={{float: 'right'}}
              className='mb20'
            >
              {isAddVersion ?
              <div>
                <button className='admins_management_button'
                  type='submit'
                  form='addVersionForm'
                >
                  <span><FormattedMessage id='REGISTER_VERSION' /></span>
                </button>
                <button className='admins_management_button'
                  type='button'
                  onClick={() => {
                    setIsAddVersion(false);
                    setFileName('');
                  }}
                >
                  <span><FormattedMessage id='CANCEL' /></span>
                </button>
              </div>
              :
              <button className='admins_management_button'
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  setIsAddVersion(true);
                }}
              >
                <span><FormattedMessage id='UPLOAD_VERSION' /></span>
              </button>
              }

            </div>

            {isAddVersion ?
              <div
                className='create_account_content'
              >
                <form 
                  id='addVersionForm'
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const { version, uploadFile, hash } = (e.currentTarget.elements as any);
                    const metaDataVersion = version.value;
                    const hashValue = hash.value;
                    const multipartFile = uploadFile.files[0];
                    const maxFileSize = 20 * 1024 * 1024;
                    const fileExtension = multipartFile.name.split('.').pop();
                    
                    console.log('fileExtension',fileExtension)
                    
                    if(metaDataVersion) {
                      setIsVersionAlert(false);
                    } else {
                      setIsVersionAlert(true);
                    }

                    if(metaDataVersion && multipartFile && hashValue && !isVersionAlert) {
                      if(multipartFile.size > maxFileSize) {
                        message.error(formatMessage({ id: 'THE_FILE_SIZE_EXCEEDS_20MB' }));
                      } else if(fileExtension !== 'zip') {
                        message.error(formatMessage({ id: 'ONLY_ZIP_FILES_CAN_BE_UPLOADED' }));
                      }  else {
                        CustomAxiosPost(
                          PostAgentInstallerUploadApi,
                          (data: any) => {
                            setIsAddVersion(false);
                            setFileName('');
                          },
                          {
                            'metaData.hash': hashValue,
                            'metaData.os': 'WINDOWS',
                            'metaData.version': metaDataVersion,                          
                            multipartFile: multipartFile,
                          },
                          () => {
                            message.error(formatMessage({ id: 'UPLOAD_FAILED' }));
                          },
                          {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                          }
                        );
                      }
                    } else {
                      console.log('에러');
                    }
                  }}
                >
                  <div
                    className='mt50'
                  >
                    <label><FormattedMessage id='VERSION_NAME' /></label>
                    <input 
                      id='version'
                      type='text'
                      className={'input-st1 create_account_input mt8 mb5 ' + (isVersionAlert ? 'red' : '')}
                      maxLength={16}
                      autoComplete='off'
                      style={{width: '600px'}}
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        if(value) {
                          setIsVersionAlert(false);
                        } else {
                          setIsVersionAlert(true);
                        }
                      }}
                    />
                    <div
                      className={'regex-alert ' + (isVersionAlert ? 'visible' : '')}
                    >
                      <FormattedMessage id='PLEASE_ENTER_A_VERSION' />
                    </div>
                  </div>
                  <div
                    className='mb20'
                  >
                    <label><FormattedMessage id='HASH' /></label>
                    <input 
                      id='hash'
                      type='text'
                      className={'input-st1 create_account_input mt8 mb5 '}
                      autoComplete='off'
                      style={{width: '600px'}}
                    />
                  </div>
                  <div>
                    <label><FormattedMessage id='FILE_UPLOAD' /></label>
                    <div
                      style={{marginTop: '22px'}}
                    >
                      <label htmlFor="uploadFile" className='button-st4 agent_management_file_btn'><FormattedMessage id='SELECT_FILE' /></label>
                      <input
                        id="uploadFile"
                        type="file"
                        accept=".zip"
                        hidden
                        onChange={handleFileChange}
                      />
                      <span style={{marginLeft: '15px'}}>{fileName}</span>
                    </div>
                  </div>
                </form>
              </div>
            :
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
                      <th></th>
                      <th><FormattedMessage id='VERSION' /></th>
                      <th>OS</th>
                      <th><FormattedMessage id='FILE_NAME' /></th>
                      <th><FormattedMessage id='UPLOAD_DATE' /></th>
                      <th><FormattedMessage id='UPLOADER' /></th>
                      <th><FormattedMessage id='DOWNLOAD' /></th>
                      <th><FormattedMessage id='CURRENT_VERSION_SETTING' /></th>
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
                </table> 
                <div
                  className="mt50 mb40"
                  style={{textAlign: 'center'}}
                >
                  <Pagination showQuickJumper showSizeChanger current={pageNum} total={totalCount} onChange={onChangePage}/>
                </div>
              </div>
            }

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