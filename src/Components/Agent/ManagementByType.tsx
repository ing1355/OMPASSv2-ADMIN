import { message, Popconfirm } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { CurrentAgentVersionChangeFunc, DeleteAgentInstallerFunc, GetAgentInstallerListFunc } from "Functions/ApiFunctions";
import { convertUTCStringToLocalDateString } from "Functions/GlobalFunctions";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { subdomainInfoChange } from "Redux/actions/subdomainInfoChange";
import tableDeleteIcon from '@assets/tableDeleteIcon.png';
import tableDeleteIconHover from '@assets/deleteIconRed.png';
import downloadIcon from '@assets/downloadIcon.png';
import uploadIcon from '@assets/uploadIcon.png';
import uploadIconHover from '@assets/uploadIconHover.png';

type ManagementByTypeProps = {
    type: AgentType
    isCloud?: boolean
}

const ManagementByType = ({ type, isCloud }: ManagementByTypeProps) => {
    const subdomainInfo = useSelector((state: ReduxStateType) => state.subdomainInfo!);
    const [openFileDelete, setOpenFileDelete] = useState(-1);
    const [deleteHover, setDeleteHover] = useState(-1)
    const [dataLoading, setDataLoading] = useState(false)
    const [totalCount, setTotalCount] = useState<number>(0);
    const [tableData, setTableData] = useState<AgentInstallerListDataType>([]);
    const [refresh, setRefresh] = useState(false)

    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: isCloud ? 1 : params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
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

    const columns = () => {
        const temp: CustomTableColumnType<AgentInstallerDataType>[] = [
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
            }
        ]
        if (!isCloud) {
            temp.unshift(
                {
                    key: 'downloadTarget',
                    title: '#',
                    width: '80px',
                    render: (data) => data && <span className='manager-mark'>
                        <FormattedMessage id='CURRENT' />
                    </span>
                }
            )
            temp.push(
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
                                if (type === 'WINDOWS_AGENT') {
                                    dispatch(subdomainInfoChange({
                                        ...subdomainInfo,
                                        windowsAgentUrl: newData.downloadUrl
                                    }))
                                } else if (type === 'LINUX_PAM') {
                                    dispatch(subdomainInfoChange({
                                        ...subdomainInfo,
                                        linuxPamDownloadUrl: newData.downloadUrl
                                    }))
                                } else if (type === 'OMPASS_PROXY') {
                                    dispatch(subdomainInfoChange({
                                        ...subdomainInfo,
                                        ompassProxyDownloadUrl: newData.downloadUrl
                                    }))
                                }
                            })
                        }}
                    ><FormattedMessage id='APPLY' />
                    </Button>
                } as CustomTableColumnType<AgentInstallerDataType>,
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
                } as CustomTableColumnType<AgentInstallerDataType>
            )
        }
        return temp
    }

    return <CustomTable<AgentInstallerDataType>
        theme='table-st1'
        loading={dataLoading}
        className={`contents-header-container ${isCloud ? 'cloud-table' : ''}`}
        onSearchChange={(data) => {
            GetDatas(data)
        }}
        onBodyRowClick={!isCloud ? (data) => {
            navigate('/AgentManagement/note', {
                state: {
                    fileId: data.fileId,
                    note: data.note
                }
            });
        } : undefined}
        refresh={refresh}
        addBtn={isCloud ? undefined : {
            label: <FormattedMessage id='FILE_UPLOAD' />,
            icon: uploadIcon,
            hoverIcon: uploadIconHover,
            style: 'st5',
            callback: () => {
                navigate(`/AgentManagement/upload/${type}`);
            }
        }}
        hover
        pagination={isCloud ? false : true}
        totalCount={totalCount}
        datas={tableData}
        columns={columns()}
    />

}

export default ManagementByType