import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from 'react-router-dom';
import { Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';

import tableDeleteIcon from '../../assets/tableDeleteIcon.png';
import tableDeleteIconHover from '../../assets/tableDeleteIconHover.png';
import downloadIcon from '../../assets/downloadIcon.png';
import uploadIcon from '../../assets/uploadIcon.png';
import uploadIconHover from '../../assets/uploadIconHover.png';
import download_installer_icon from '../../assets/download_installer_icon.png';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import CustomTable from 'Components/CommonCustomComponents/CustomTable';
import { CurrentAgentVersionChangeFunc, DeleteAgentInstallerFunc, DownloadAgentInstallerFunc, GetAgentInstallerListFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import { userSelectPageSize } from 'Constants/ConstantValues';

interface Checkbox {
  id: number;
  userId: number;
  checked: boolean;
}

const AgentManagement = () => {
  const [dataLoading, setDataLoading] = useState(false)
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableData, setTableData] = useState<AgentInstallerListDataType>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [openFileDelete, setOpenFileDelete] = useState(-1);
  const [deleteHover, setDeleteHover] = useState(-1)
  const [openFilesDelete, setOpenFilesDelete] = useState(false);
  const [isAgentFileDisable, setIsAgentFileDisable] = useState<boolean[]>(new Array(tableData.length).fill(false));

  const { formatMessage } = useIntl();
  const navigate = useNavigate();

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

  const GetDatas = async (params: CustomTableSearchParams) => {
    setDataLoading(true)
    const _params: GeneralParamsType = {
      page_size: params.size,
      page: params.page
    }
    if (params.type) {
      _params[params.type] = params.value
    }
    await GetAgentInstallerListFunc(_params, ({ results, totalCount }) => {
      setTableData(results)
      setTotalCount(totalCount)
    }).finally(() => {
      setDataLoading(false)
    })
  }

  useEffect(() => {
    GetDatas({
      page: 1,
      size: userSelectPageSize()
    })
  }, [])

  // agentData가 변경되면 checkboxes 초기화
  // useEffect(() => {
  //   const updatedCheckboxes = agentData.map((data, index) => ({
  //     id: index,
  //     userId: data.fileId,
  //     checked: false,
  //   }));
  //   setCheckboxes(updatedCheckboxes);
  // }, [agentData]);

  return (
    <>
      <Contents loading={dataLoading}>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle='VERSION_LIST'>
        </ContentsHeader>
        <CustomTable<AgentInstallerDataType, {}>
          theme='table-st1'
          className="contents-header-container"
          onSearchChange={(data) => {
            GetDatas(data)
          }}
          addBtn={{
            label: <FormattedMessage id='FILE_UPLOAD' />,
            icon: uploadIcon,
            hoverIcon: uploadIconHover,
            style: 'st5',
            callback: () => {
              navigate('/AgentManagement/upload');
            }
          }}
          pagination
          totalCount={totalCount}
          datas={tableData}
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
              key: 'downloadTarget',
              title: '#',
              width: '80px',
              render: (data) => data && <span className='manager-mark'>
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
                  src={downloadIcon}
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
              render: (_, index, data) => <Button
                className={'st1' + (data.downloadTarget ? ' disable' : '')}
                disabled={data.downloadTarget ? true : false}
                onClick={() => {
                  CurrentAgentVersionChangeFunc(data.fileId, (newData) => {
                    setTableData(tableData.map(t => t.fileId === newData.fileId ? newData : ({...t, downloadTarget: false})))
                    message.success(formatMessage({ id: 'CURRENT_VERSION_CHANGE_COMPLETE' }));
                  })
                }}
              ><FormattedMessage id='APPLY' />
              </Button>
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
              render: (_, index, row) => !row.downloadTarget && <Popconfirm
                title={formatMessage({ id: 'DELETE_A_FILE' })}
                description={formatMessage({ id: 'CONFIRM_DELETE_FILE' })}
                okText={formatMessage({ id: 'DELETE' })}
                cancelText={formatMessage({ id: 'CANCEL' })}
                open={openFileDelete === index}
                onConfirm={() => {
                  const versionIds = `${row.fileId}`
                  const target = tableData.find((data) => data.downloadTarget === true);
                  const targetVersion = checkboxes.filter((checkbox) => checkbox.userId === target?.fileId);

                  if (targetVersion[0]?.checked) {
                    message.error(formatMessage({ id: 'CURRENT_VERSION_CANNOT_BE_DELETED' }));
                  } else {
                    if (versionIds) {
                      DeleteAgentInstallerFunc(versionIds, () => {
                        setOpenFileDelete(-1);
                        message.success(formatMessage({ id: 'VERSION_DELETE' }));
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
                <img src={deleteHover === row.fileId ? tableDeleteIconHover : tableDeleteIcon} width='25px' style={{ opacity: 0.44, position: 'relative', top: '2.5px', cursor: 'pointer' }}
                  onClick={() => {
                    setOpenFileDelete(index);
                  }}
                  onMouseEnter={() => {
                    setDeleteHover(row.fileId)
                  }}
                  onMouseLeave={() => {
                    setDeleteHover(-1)
                  }}
                />
              </Popconfirm>
            }
          ]}
        />
      </Contents>
    </>
  )
}

export default AgentManagement;