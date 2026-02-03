import { message } from "antd";
import Button from "Components/CommonCustomComponents/Button";
import CustomModal from "Components/Modal/CustomModal";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import Contents from "Components/Layout/Contents";
import ContentsHeader from "Components/Layout/ContentsHeader";
import { AddUserWithCsvDataFunc, GetUserApiSyncInfoDataFunc, ReissuanceSecretKeyForUserSyncFunc, SyncExternalDirectoryPortalUsersFunc } from "Functions/ApiFunctions";
import useFullName from "hooks/useFullName";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { userSelectPageSize } from "Constants/ConstantValues";
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/acai.css';
import './UserApiSync.css'
import BottomLineText from "Components/CommonCustomComponents/BottomLineText";
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import Input from "Components/CommonCustomComponents/Input";
import CopyToClipboard from "react-copy-to-clipboard";
import copyIcon from '@assets/jsonCopyIcon2.png';
import copyIconHover from '@assets/jsonCopyIcon.png';
import { emailRegex, idRegex, nameRegex, phoneRegex } from "Constants/CommonRegex";
import BulkUserRegexErrorModal from "Components/CommonCustomComponents/BulkUserRegexErrorModal";
import useBulkUserDataRegex from "hooks/useBulkUserDataRegex";



const UserApiSync = () => {
    const [apiInfo, setApiInfo] = useState<ExternalDirectoryDataType | null>(null)
    const [datas, setDatas] = useState<UserExcelDataType[]>([])
    const [showError, setShowError] = useState<UserRegexErrorDataType[]>([])
    const [sureReset, setSureReset] = useState(false)
    const [showJsonModal, setShowJsonModal] = useState(false)
    const [pageSetting, setPageSetting] = useState({
        page: 1,
        showPerPage: userSelectPageSize()
    })
    const [loading, setLoading] = useState(false)
    const createHeaderColumn = (formattedId: string) => <FormattedMessage id={formattedId} />
    const { formatMessage } = useIntl()
    const { regexTestBulkUserData } = useBulkUserDataRegex()
    const getFullName = useFullName()

    const tableData = useMemo(() => {
        const { page, showPerPage } = pageSetting
        return datas.slice((page - 1) * showPerPage, page * showPerPage)
    }, [datas, pageSetting])

    const GetDatas = () => {
        GetUserApiSyncInfoDataFunc(({ results }) => {
            setApiInfo(results[0])
        })
        // setInputUrl('https://api.example.com/v2/users/api-sync')
        // setInputSecretKey('1234567890')
    }

    useEffect(() => {
        GetDatas()
    }, [])

    return <>
        <Contents>
            <ContentsHeader subTitle={'USER_ADD_API_SYNC_ITEM_LABEL'}>
                <Button loading={loading} disabled={datas.length === 0} className="st3" onClick={() => {
                    setLoading(true)
                    return AddUserWithCsvDataFunc({
                        userSyncMethod: 'API',
                        users: datas.map(_ => ({
                            ..._,
                            role: 'USER'
                        }))
                    }, res => {
                        message.success(formatMessage({ id: 'EXCEL_USER_ADD_SUCCESS_MSG' }))
                        setDatas([])
                    }).finally(() => {
                        setLoading(false)
                    })
                }}>
                    <FormattedMessage id="SAVE" />
                </Button>
                <Button disabled={loading || !apiInfo} className="st3" onClick={() => {
                    setLoading(true)
                    if (apiInfo) {
                        return SyncExternalDirectoryPortalUsersFunc(apiInfo.id, res => {
                            regexTestBulkUserData(res.map(item => ({
                                username: item.username,
                                name: item.name,
                                email: item.email,
                                role: 'USER',
                                phone: item.phone
                            }))).then(datas => {
                                setDatas(datas)
                            }).catch(errorDatas => {
                                setShowError(errorDatas)
                            }).finally(() => {
                                setLoading(false)
                            })
                            message.success(formatMessage({ id: 'USER_ADD_API_SYNC_USER_LIST_LOAD_SUCCESS_MSG' }))
                        }).catch(err => {
                            console.log(err)
                            message.error(formatMessage({ id: 'USER_ADD_API_SYNC_USER_LIST_LOAD_FAIL_MSG' }))
                        }).finally(() => {
                            setLoading(false)
                        })
                    }
                }}>
                    <FormattedMessage id="LOAD_LABEL" />
                </Button>
                <Button className="st5" onClick={() => {
                    setShowJsonModal(true)
                }}>
                    <FormattedMessage id="USER_ADD_API_SYNC_USER_INFO_EXAMPLE_LABEL" />
                </Button>
            </ContentsHeader>
            <div className="contents-header-container">
                <BottomLineText title={<FormattedMessage id="USER_ADD_API_SYNC_INFO_LABEL" />} />
                <CustomInputRow title={<FormattedMessage id="USER_ADD_API_SYNC_URL_LABEL" />}>
                    <CopyToClipboard text={apiInfo?.apiServerHost ?? ""} onCopy={(value, result) => {
                        if (result) {
                            message.success(formatMessage({ id: 'API_URL_COPY_SUCCESS_MSG' }))
                        } else {
                            message.success(formatMessage({ id: 'API_URL_COPY_FAIL_MSG' }))
                        }
                    }}>
                        <Input className="st1 secret-key" value={apiInfo?.apiServerHost ?? ""} readOnly />
                    </CopyToClipboard>
                </CustomInputRow>
                <CustomInputRow title={<FormattedMessage id="USER_ADD_API_SYNC_SECRET_KEY_LABEL" />}>
                    <CopyToClipboard text={apiInfo?.secretKey ?? ""} onCopy={(value, result) => {
                        if (result) {
                            message.success(formatMessage({ id: 'API_SECRET_KEY_COPY_SUCCESS_MSG' }))
                        } else {
                            message.success(formatMessage({ id: 'API_SECRET_KEY_COPY_FAIL_MSG' }))
                        }
                    }}>
                        <Input className="st1 secret-key" value={apiInfo?.secretKey ?? ""} readOnly />
                    </CopyToClipboard>
                    <Button className="st9 api-secret-key-reset-btn" onClick={() => {
                        setSureReset(true)
                    }}><FormattedMessage id="APPLICATION_SECRET_KEY_RESET" /></Button>
                </CustomInputRow>
                <CustomTable<UserExcelDataType>
                    datas={tableData}
                    theme='table-st1'
                    pagination
                    onPageChange={(page, size) => {
                        setPageSetting({
                            page,
                            showPerPage: size
                        })
                    }}
                    totalCount={datas.length}
                    columns={[
                        {
                            key: 'username',
                            title: createHeaderColumn('USER_ID')
                        },
                        {
                            key: 'name',
                            title: createHeaderColumn('NAME'),
                            render: (data) => getFullName(data)
                        },
                        {
                            key: 'phone',
                            title: createHeaderColumn('PHONE_NUMBER'),
                            noWrap: true
                        },
                        {
                            key: 'email',
                            title: createHeaderColumn('EMAIL'),
                        }
                    ]}
                />
            </div>
        </Contents>
        <CustomModal noBtns open={showJsonModal} onCancel={() => {
            setShowJsonModal(false)
        }} titleLeft title={<FormattedMessage id="USER_ADD_API_SYNC_JSON_MODAL_TITLE" />}>
            <div className="user-add-api-sync-json-modal-description">
                <FormattedMessage id="USER_ADD_API_SYNC_JSON_MODAL_DESCRIPTION" />
            </div>
            <div className="json-pretty-container">
                <CopyBtn />
                <JSONPretty id="json-pretty" data={jsonData} className="user-add-api-sync-json-modal-json-pretty" />
            </div>
        </CustomModal>
        <CustomModal
            open={sureReset}
            onCancel={() => {
                setSureReset(false);
            }}
            type="warning"
            typeTitle={formatMessage({ id: 'APPLICATION_INFO_SECRET_KEY_SURE_RESET_TEXT' })}
            typeContent={<FormattedMessage id="API_SYNC_SECRET_KEY_SURE_RESET_SUBSCRIPTION" />}
            yesOrNo
            okCallback={async () => {
                if (apiInfo) {
                    return ReissuanceSecretKeyForUserSyncFunc(apiInfo.id, res => {
                        setApiInfo(res)
                        message.success(formatMessage({ id: 'API_SYNC_SECRET_KEY_REISSUANCE_SUCCESS_MSG' }))
                        setSureReset(false)
                    }).catch(err => {
                        console.log(err)
                        message.error(formatMessage({ id: 'API_SYNC_SECRET_KEY_REISSUANCE_FAIL_MSG' }))
                    })
                }
            }} buttonLoading />
        <BulkUserRegexErrorModal open={showError.length > 0} onCancel={() => {
            setShowError([])
        }} onOk={async () => {
            setShowError([])
        }} showError={showError} />
    </>
}

const CopyBtn = () => {
    const [isHover, setIsHover] = useState(false)
    const { formatMessage } = useIntl()
    return <CopyToClipboard text={JSON.stringify(jsonData)} onCopy={(value, result) => {
        if (result) {
            message.success(formatMessage({ id: 'JSON_COPY_SUCCESS_MSG' }))
        } else {
            message.success(formatMessage({ id: 'JSON_COPY_FAIL_MSG' }))
        }
    }}>
        <div className="json-copy-btn" onMouseEnter={() => {
            setIsHover(true)
        }} onMouseLeave={() => {
            setIsHover(false)
        }}>
            <img src={isHover ? copyIconHover : copyIcon} alt="copy" />
        </div>
    </CopyToClipboard>
}

const jsonData = {
    "organizations": [
        {
            "id": "T000001",
            "parentId": null,
            "name": "원모어시큐리티"
        },
        {
            "id": "T000002",
            "parentId": "T000001",
            "name": "개발1팀"
        },
        {
            "id": "T000003",
            "parentId": "T000001",
            "name": "개발2팀"
        }
    ],
    "users": [
        {
            "organizationId": "T000001",
            "username": "test01",
            "employeeId": "E000001",
            "name": {
                "lastName": "홍",
                "firstName": "길동"
            },
            "email": "test01@example.com",
            "phone": "010-0000-0001",
            "jobLevel": "Grade 7",                // 직급
            "jobPosition": "Deputy Officer",      // 직위
            "jobTitle": "Civil Affairs Officer"   // 직책
        },
        {
            "organizationId": "T000002",
            "username": "test02",
            "employeeId": "E000002",
            "name": {
                "lastName": "이",
                "firstName": "순신"
            },
            "email": "test02@example.com",
            "phone": "010-0000-0002",
            "jobLevel": null,
            "jobPosition": null,
            "jobTitle": null
        },
        {
            "organizationId": "T000003",
            "username": "test03",
            "employeeId": "E000003",
            "name": {
                "lastName": "김",
                "firstName": "아무개"
            },
            "email": "test03@example.com",
            "phone": "010-0000-0003",
            "jobLevel": null,
            "jobPosition": null,
            "jobTitle": null
        }
    ]
}

export default UserApiSync;