import './AgentManagement.css';
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from 'react-router-dom';
import { Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';

import tableDeleteIcon from '../../assets/tableDeleteIcon.png';
import tableDeleteIconHover from '../../assets/deleteIconRed.png';
import downloadIcon from '../../assets/downloadIcon.png';
import uploadIcon from '../../assets/uploadIcon.png';
import uploadIconHover from '../../assets/uploadIconHover.png';
import ContentsHeader from 'Components/Layout/ContentsHeader';
import Contents from 'Components/Layout/Contents';
import CustomTable from 'Components/CommonCustomComponents/CustomTable';
import { CurrentAgentVersionChangeFunc, DeleteAgentInstallerFunc, GetAgentInstallerListFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import { convertUTCStringToLocalDateString } from 'Functions/GlobalFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { subdomainInfoChange } from 'Redux/actions/subdomainInfoChange';

const AgentManagement = () => {
  const { subdomainInfo } = useSelector((state: ReduxStateType) => ({
    subdomainInfo: state.subdomainInfo!
  }));
  const [dataLoading, setDataLoading] = useState(false)
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableData, setTableData] = useState<AgentInstallerListDataType>([]);
  const [refresh, setRefresh] = useState(false)
  const [openFileDelete, setOpenFileDelete] = useState(-1);
  const [deleteHover, setDeleteHover] = useState(-1)

  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      setTableData(results.map(_ => ({
        ..._,
        uploadDate: convertUTCStringToLocalDateString(_.uploadDate),
        downloadTarget: false
      })))
      setTotalCount(totalCount)
    }).finally(() => {
      setDataLoading(false)
    })
  }

  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [refresh])

  return (
    <>
      <Contents loading={dataLoading}>
        <ContentsHeader title="VERSION_MANAGEMENT" subTitle='VERSION_LIST'>
        </ContentsHeader>
        <div className="contents-header-container">
          <CustomTable<AgentInstallerDataType>
            theme='table-st1'
            className="contents-header-container"
            onSearchChange={(data) => {
              GetDatas(data)
            }}
            onBodyRowClick={(data) => {
              navigate('/AgentManagement/note', {
                state: {
                  fileId: data.fileId,
                  note: data.note
                }
              });
            }}
            refresh={refresh}
            addBtn={{
              label: <FormattedMessage id='FILE_UPLOAD' />,
              icon: uploadIcon,
              hoverIcon: uploadIconHover,
              style: 'st5',
              callback: () => {
                navigate('/AgentManagement/upload');
              }
            }}
            hover
            pagination
            totalCount={totalCount}
            datas={tableData}
            columns={[
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
                key: 'note',
                title: <FormattedMessage id='MEMO' />,
                maxWidth: '300px'
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
                render: (_, index, data) => <a href={data.downloadUrl} download onClick={e => {
                  e.stopPropagation()
                }}>
                  <img
                    src={downloadIcon}
                    className='agent-table-icon'
                  />
                </a>
              }, {
                key: 'currentVersionSetting',
                title: <FormattedMessage id='CURRENT_VERSION_SETTING' />,
                width: '140px',
                render: (_, index, data) => <Button
                  className={'st1' + (data.downloadTarget ? ' disable' : '')}
                  disabled={data.downloadTarget ? true : false}
                  onClick={(e) => {
                    e.stopPropagation()
                    CurrentAgentVersionChangeFunc(data.fileId, (newData) => {
                      setTableData(tableData.map(t => t.fileId === newData.fileId ? ({
                        ...newData,
                        uploadDate: convertUTCStringToLocalDateString(newData.uploadDate)
                      }) : ({ ...t, downloadTarget: false })))
                      message.success(formatMessage({ id: 'CURRENT_VERSION_CHANGE_COMPLETE' }));
                      dispatch(subdomainInfoChange({
                        ...subdomainInfo,
                        windowsAgentUrl: newData.downloadUrl
                      }))
                    })
                  }}
                ><FormattedMessage id='APPLY' />
                </Button>
              },
              {
                key: 'delete',
                title: '',
                render: (_, index, row) => !row.downloadTarget && <Popconfirm
                  title={formatMessage({ id: 'DELETE_A_FILE' })}
                  description={formatMessage({ id: 'CONFIRM_DELETE_FILE' })}
                  okText={formatMessage({ id: 'DELETE' })}
                  cancelText={formatMessage({ id: 'CANCEL' })}
                  open={openFileDelete === index}
                  onConfirm={(e) => {
                    e?.stopPropagation()
                    e?.preventDefault()
                    const versionIds = `${row.fileId}`
                    DeleteAgentInstallerFunc(versionIds, () => {
                      setOpenFileDelete(-1);
                      setRefresh(true)
                      message.success(formatMessage({ id: 'VERSION_DELETE' }));
                    })
                  }}
                  onCancel={(e) => {
                    e?.stopPropagation()
                    e?.preventDefault()
                    setOpenFileDelete(-1);
                  }}
                >
                  <img src={deleteHover === row.fileId ? tableDeleteIconHover : tableDeleteIcon} className='agent-table-icon'
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
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
        </div>
      </Contents>
    </>
  )
}

export default AgentManagement;