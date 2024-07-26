import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import { useWindowHeightHeader } from 'Components/CommonCustomComponents/useWindowHeight';
import { useNavigate } from 'react-router-dom';
import { Pagination, PaginationProps, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';

import delete_icon from '../../assets/delete_icon.png';
import list_download from '../../assets/list_download.png';
import download_installer_icon from '../../assets/download_installer_icon.png';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import CustomTable from 'Components/CommonCustomComponents/CustomTable';
import { CurrentAgentVersionChangeFunc, DeleteAgentInstallerFunc, DownloadAgentInstallerFunc, GetAgentInstallerListFunc } from 'Functions/ApiFunctions';

interface Checkbox {
  id: number;
  userId: number;
  checked: boolean;
}

const AgentManagement = () => {
  const height = useWindowHeightHeader();
  const [tableCellSize, setTableCellSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [agentData, setAgentData] = useState<AgentInstallerListDataType>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number>(-1);
  const [rendering, setRendering] = useState<boolean[]>([]);
  const [openFileDelete, setOpenFileDelete] = useState(-1);
  const [openFilesDelete, setOpenFilesDelete] = useState(false);
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

  useEffect(() => {
    setIsAgentDataLoading(true);
    GetAgentInstallerListFunc({}, ({ agentProgramHistories, queryTotalCount }: GetAgentInstallerApiResponseType) => {
      setAgentData(agentProgramHistories);
      setTotalCount(queryTotalCount);
      setIsAgentFileDisable(new Array(agentProgramHistories.length).fill(false));
    }).finally(() => {
      setIsAgentDataLoading(false);
    })
  }, [tableCellSize, pageNum, rendering]);

  // agentData가 변경되면 checkboxes 초기화
  useEffect(() => {
    const updatedCheckboxes = agentData.map((data, index) => ({
      id: index,
      userId: data.fileId,
      checked: false,
    }));
    setCheckboxes(updatedCheckboxes);
  }, [agentData]);

  const handleRowHover = (index: number) => {
    setHoveredRow(index);
  };

  return (
    <>
      <Contents>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle='VERSION_LIST'>
          <button className="button-st1"
            onClick={(e) => {
              navigate('/AgentManagement/upload');
            }}
          >
            <FormattedMessage id='FILE_UPLOAD' />
          </button>
        </ContentsHeader>
        <CustomTable<AgentInstallerDataType, {}>
          theme='table-st1'
          className="contents-header-container"
          onBodyRowHover={(_, index) => {
            handleRowHover(index)
          }}
          onBodyRowMouseLeave={() => {
            handleRowHover(-1)
          }}
          bodyRowStyle={(_, index) => ({
            background: hoveredRow === index ? 'var(--sub-blue-color-2)' : 'transparent'
          })}
          datas={agentData}
          columns={[
            // {
            //   key: 'check',
            //   title: <input
            //     type='checkbox'
            //     checked={checkAll}
            //     onChange={handleCheckAll}
            //   />,
            //   render: (data, index, row) => <input
            //     type='checkbox'
            //     value={row.fileId}
            //     id={index.toString()}
            //     checked={checkboxes[index]?.checked || false}
            //     onChange={handleCheckboxChange}
            //   />
            // },
            {
              key: 'currentTarget',
              title: '#',
              width: '80px',
              render: (data, index, row) => row.downloadTarget && <span className='manager-mark'>
                <FormattedMessage id='CURRENT' />
              </span>
            },
            {
              key: 'version',
              title: <FormattedMessage id='VERSION' />,
            },
            {
              key: 'os',
              title: 'os'
            },
            {
              key: 'fileName',
              title: <FormattedMessage id='FILE_NAME' />
            },
            {
              key: 'uploadDate',
              title: <FormattedMessage id='UPLOAD_DATE' />
            },
            {
              key: 'uploader',
              title: <FormattedMessage id='UPLOADER' />
            },
            {
              key: 'download',
              width: '100px',
              title: <FormattedMessage id='DOWNLOAD' />,
              render: (_, index, data) => isAgentFileDisable[index] ?
                <img
                  src={download_installer_icon}
                  style={{ cursor: 'default', pointerEvents: 'none' }}
                  width='20px'
                />
                :
                <img
                  src={list_download}
                  style={{ cursor: 'pointer' }}
                  width='18px'
                  onClick={() => {
                    const updatedIsAgentFileDisable = [...isAgentFileDisable];
                    updatedIsAgentFileDisable[index] = true;
                    setIsAgentFileDisable(updatedIsAgentFileDisable);
                    DownloadAgentInstallerFunc({ file_id: data.fileId }).catch(err => {
                      message.error(formatMessage({ id: 'DOWNLOAD_FAILED' }));
                    }).finally(() => {
                      const updatedIsAgentFileDisable = [...isAgentFileDisable];
                      updatedIsAgentFileDisable[index] = false;
                      setIsAgentFileDisable(updatedIsAgentFileDisable);
                    })
                  }}
                />
            }, {
              key: 'currentVersionSetting',
              title: <FormattedMessage id='CURRENT_VERSION_SETTING' />,
              width: '140px',
              render: (_, index, data) => <button
                className={'button-st4 agent_management_target_version_btn ' + (data.downloadTarget ? 'disable' : '')}
                disabled={data.downloadTarget ? true : false}
                onClick={() => {
                  CurrentAgentVersionChangeFunc(data.fileId, () => {
                    message.success(formatMessage({ id: 'CURRENT_VERSION_CHANGE_COMPLETE' }));
                    const render = rendering;
                    const renderTemp = render.concat(true);
                    setRendering(renderTemp);
                  })
                }}
              ><FormattedMessage id='APPLY' /></button>
            },
            {
              key: 'delete',
              title: '',
              // title: (_, index) => <Popconfirm
              //   title={formatMessage({ id: 'DELETE_A_FILE' })}
              //   description={formatMessage({ id: 'CONFIRM_DELETE_FILE' })}
              //   okText={formatMessage({ id: 'DELETE' })}
              //   cancelText={formatMessage({ id: 'CANCEL' })}
              //   open={openFilesDelete}
              //   onConfirm={() => {
              //     const versionIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
              //     const target = agentData.find((data) => data.downloadTarget === true);
              //     const targetVersion = checkboxes.filter((checkbox) => checkbox.userId === target?.fileId);

              //     if (targetVersion[0]?.checked) {
              //       message.error(formatMessage({ id: 'CURRENT_VERSION_CANNOT_BE_DELETED' }));
              //     } else {
              //       DeleteAgentInstallerFunc(versionIds, () => {
              //         setOpenFilesDelete(false);

              //         message.success(formatMessage({ id: 'VERSION_DELETE' }));

              //         const render = rendering;
              //         const renderTemp = render.concat(true);
              //         setRendering(renderTemp);
              //       })
              //       // if (versionIds) {
              //       // } else {
              //       //   message.error(formatMessage({ id: 'NO_ITEM_SELECTED' }));
              //       // }
              //     }
              //   }}
              //   onCancel={() => {
              //     setOpenFilesDelete(false);
              //   }}
              // >
              //   <img src={delete_icon} width='25px' style={{ opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer' }}
              //     onClick={() => {
              //       setOpenFilesDelete(true);
              //     }}
              //   />
              // </Popconfirm>,
              render: (_, index, row) => <Popconfirm
                title={formatMessage({ id: 'DELETE_A_FILE' })}
                description={formatMessage({ id: 'CONFIRM_DELETE_FILE' })}
                okText={formatMessage({ id: 'DELETE' })}
                cancelText={formatMessage({ id: 'CANCEL' })}
                open={openFileDelete === index}
                onConfirm={() => {
                  // const versionIds = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.userId).join(',');
                  const versionIds = `${row.fileId}`
                  const target = agentData.find((data) => data.downloadTarget === true);
                  const targetVersion = checkboxes.filter((checkbox) => checkbox.userId === target?.fileId);

                  if (targetVersion[0]?.checked) {
                    message.error(formatMessage({ id: 'CURRENT_VERSION_CANNOT_BE_DELETED' }));
                  } else {
                    if (versionIds) {
                      DeleteAgentInstallerFunc(versionIds, () => {
                        setOpenFileDelete(-1);

                        message.success(formatMessage({ id: 'VERSION_DELETE' }));

                        const render = rendering;
                        const renderTemp = render.concat(true);
                        setRendering(renderTemp);
                      })
                    } else {
                      message.error(formatMessage({ id: 'NO_ITEM_SELECTED' }));
                    }
                  }
                }}
                onCancel={() => {
                  setOpenFileDelete(-1);
                }}
              >
                <img src={delete_icon} width='25px' style={{ opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer' }}
                  onClick={() => {
                    setOpenFileDelete(index);
                  }}
                />
              </Popconfirm>
            }
          ]}
        />
        <div
          className="mt30 mb40"
          style={{ textAlign: 'center' }}
        >
          <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableCellSize} total={totalCount} onChange={onChangePage} />
        </div>
      </Contents>
    </>
  )
}

export default AgentManagement;