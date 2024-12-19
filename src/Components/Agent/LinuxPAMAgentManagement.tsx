import tableDeleteIcon from '../../assets/tableDeleteIcon.png';
import tableDeleteIconHover from '../../assets/deleteIconRed.png';
import downloadIcon from '../../assets/downloadIcon.png';
import uploadIcon from '../../assets/uploadIcon.png';
import uploadIconHover from '../../assets/uploadIconHover.png';
import CustomTable from 'Components/CommonCustomComponents/CustomTable';
import { CurrentAgentVersionChangeFunc, DeleteAgentInstallerFunc, GetAgentInstallerListFunc } from 'Functions/ApiFunctions';
import Button from 'Components/CommonCustomComponents/Button';
import { Popconfirm, message } from 'antd';
import { subdomainInfoChange } from 'Redux/actions/subdomainInfoChange';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { convertUTCStringToLocalDateString } from 'Functions/GlobalFunctions';

const LinuxPAMAgentManagement = () => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [openFileDelete, setOpenFileDelete] = useState(-1);
    const [deleteHover, setDeleteHover] = useState(-1)
    const [dataLoading, setDataLoading] = useState(false)
    const [totalCount, setTotalCount] = useState<number>(0);
    const [tableData, setTableData] = useState<AgentInstallerListDataType>([]);
    const [refresh, setRefresh] = useState(false)
    const type = 'LINUX_PAM' as UploadFileTypes

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
        await GetAgentInstallerListFunc(type, _params, ({ results, totalCount }) => {
            setTableData(results.map(_ => ({
                ..._,
                uploadDate: convertUTCStringToLocalDateString(_.uploadDate)
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

    return <>
        <CustomTable<AgentInstallerDataType>
            theme='table-st1'
            loading={dataLoading}
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
                    navigate(`/AgentManagement/upload/${type}`);
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
                }, 
                {
                    key: 'currentVersionSetting',
                    title: <FormattedMessage id='CURRENT_VERSION_SETTING' />,
                    width: '140px',
                    render: (_, index, data) => <Button
                        className={'st1' + (data.downloadTarget ? ' disable' : '')}
                        disabled={data.downloadTarget ? true : false}
                        onClick={(e) => {
                            e.stopPropagation()
                            CurrentAgentVersionChangeFunc(type, data.fileId, (newData) => {
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
    </>
}

export default LinuxPAMAgentManagement