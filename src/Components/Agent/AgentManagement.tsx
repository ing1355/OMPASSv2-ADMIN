import './AgentManagement.css';
import { FormattedMessage } from "react-intl";
import Header from "Components/Header/Header";
import { useWindowHeightHeader } from 'Components/CustomHook/useWindowHeight';
import { Link } from 'react-router-dom';
import { Pagination, PaginationProps, message } from 'antd';
import { useEffect, useState } from 'react';
import { GetAgentApiArrayType, GetAgentApiDataType, GetAgentApiType } from 'Types/ServerResponseDataTypes';
import { CustomAxiosDelete, CustomAxiosGet, CustomAxiosGetFile, CustomAxiosPatch, CustomAxiosPost, CustomAxiosPut } from 'Components/CustomHook/CustomAxios';
import { DeleteAgentInstallerApi, GetAgentInstallerApi, GetAgentInstallerDownloadApi, PatchAgentInstallerApi, PostAgentInstallerUploadApi } from 'Constants/ApiRoute';

import delete_icon from '../../assets/delete_icon.png';
import list_download from '../../assets/list_download.png';

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
      },
      {
        page_size: tableCellSize,
        page: pageNum -1
      },
      () => {

      }
    )
  },[tableCellSize, pageNum, rendering, isAddVersion]);

  // adminData가 변경되면 checkboxes 초기화
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
          style={{flexDirection: 'column', marginTop: '70px'}}
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
              <button className='tab_download_upload_button admins_management_button'
                type='submit'
                form='addVersionForm'
              >
                <span>버전 등록</span>
              </button>
              :
              <button className='tab_download_upload_button admins_management_button'
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  setIsAddVersion(true);
                }}
              >
                <span>버전 업로드</span>
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
                    console.log('버전관리')
                    e.preventDefault();
                    // const { version } = (e.currentTarget.elements as any);
                    const { version, uploadFile } = (e.currentTarget.elements as any);
                    const metaDataVersion = version.value;
                    const multipartFile = uploadFile.files[0];
                    
                    console.log('multipartFile',multipartFile)
                    
                    if(metaDataVersion) {
                      setIsVersionAlert(false);
                    } else {
                      setIsVersionAlert(true);
                    }

                    if(metaDataVersion && multipartFile && !isVersionAlert) {
                      console.log('os 업로드 api');
                      CustomAxiosPost(
                        PostAgentInstallerUploadApi,
                        (data: any) => {
                          setIsAddVersion(false);
                        },
                        {
                          // metaData: {version: metaDataVersion}, 
                          'metaData.version': metaDataVersion,                          
                          multipartFile: multipartFile,
                        },
                        () => {
                          message.error('업로드 실패');
                        },
                        {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                        }
                      );
                    } else {
                      console.log('에러');
                    }
                  }}
                >
                  <div>
                    <label>버전명</label>
                    <input 
                      id='version'
                      type='text'
                      className={'input-st1 create_account_input mt8 mb5 ' + (isVersionAlert ? 'red' : '')}
                      maxLength={16}
                      autoComplete='off'
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
                      버전을 입력해주세요
                    </div>
                  </div>
                  <div>
                    <label>파일 업로드</label>
                    <div
                      style={{marginTop: '20px'}}
                    >
                      <label htmlFor="uploadFile" className='button-st4 agent_management_file_btn'>파일 선택</label>
                      <input id="uploadFile" type="file" hidden/>
                    </div>

                    {/* <div
                      className={'regex-alert ' + (isVersionAlert ? 'visible' : '')}
                    >
                      파일을 등록해주세요
                    </div> */}
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
                      <th>버전</th>
                      <th>OS</th>
                      <th>업로드 일시</th>
                      <th>업로드 관리자 아이디</th>
                      <th>다운로드</th>
                      <th>현재 버전 설정</th>
                      <th>
                        <img src={delete_icon} width='25px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
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
                        />
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
                        <td>{data.downloadTarget && <span className='manager-mark ml10'>현재</span>}{data.version}</td>
                        <td>{data.os}</td>
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
                                  message.error('다운로드 실패', error);
                                  console.log(error)
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
                                  message.success('현재 버전 변경 완료');
                                  const render = rendering;
                                  const renderTemp = render.concat(true);
                                  setRendering(renderTemp);
                                }
                              )
                            }}
                          >변경</button>
                        </td>
                        <td>
                          <img src={delete_icon} width='20px' style={{opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer'}}
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
                          />                          
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
      </div>
    </>
  )
}

export default AgentManagement;