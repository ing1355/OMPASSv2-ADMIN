import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow";
import CustomSelect from "Components/CommonCustomComponents/CustomSelect";
import CustomTable from "Components/CommonCustomComponents/CustomTable";
import { authenticatorList, authenticatorLabelList, getApplicationTypeLabel, INT_MAX_VALUE } from "Constants/ConstantValues";
import { GetApplicationListFunc, GetRpUsersListFunc } from "Functions/ApiFunctions";
import useCustomRoute from "hooks/useCustomRoute";
import useFullName from "hooks/useFullName";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import usePlans from "hooks/usePlans";

const ApplicationUserManagement = () => {
    const [searchParams] = useSearchParams()
    const lang = useSelector((state: ReduxStateType) => state.lang!);
    const [dataLoading, setDataLoading] = useState(false)
    const [tableData, setTableData] = useState<RpUserListDataType[]>([])
    const [totalCount, setTotalCount] = useState<number>(0);
    const [appTypes, setAppTypes] = useState<ApplicationListDataType[]>([])
    const [refresh, setRefresh] = useState(false)
    const [applicationType, setApplicationType] = useState<ApplicationDataType['type']>(searchParams.get('applicationType') as ApplicationDataType['type'] ?? undefined)
    const [targetApplication, setTargetApplication] = useState<ApplicationListDataType | undefined>()
    const navigate = useNavigate()
    const getFullName = useFullName()
    const { customPushRoute } = useCustomRoute()
    const { getApplicationTypesByPlanType } = usePlans()
    const typeItems = (type: ApplicationDataType['type']) => appTypes.filter(_ => _.type === type).map(_ => ({
        key: _.id,
        label: _.name
    }))

    const targetApplicationRef = useRef(targetApplication)
    const tableSearchOptions = useMemo(() => {
        let temp: TableSearchOptionType[] = [
            {
                key: 'portalName',
                label: <FormattedMessage id="NAME" />,
                type: 'string'
            },
            {
                key: 'portalUsername',
                label: <FormattedMessage id="PASSCODE_COLUMN_PORTAL_ID_LABEL" />,
                type: 'string'
            },
            {
                key: 'rpUsername',
                label: <FormattedMessage id="PASSCODE_COLUMN_RP_ID_LABEL" />,
                type: 'string'
            },
            {
                key: 'groupName',
                type: 'string'
            },
        ]
        if (targetApplication?.type === 'WINDOWS_LOGIN') {
            temp.push({ key: 'pcName', type: 'string' }, { key: 'windowsPackageVersion', type: 'string' })
        }
        return temp
    }, [targetApplication])

    const tableColumns: CustomTableColumnType<RpUserListDataType>[] = useMemo(() => {
        let temp: CustomTableColumnType<RpUserListDataType>[] = [
            {
                key: 'name',
                title: <FormattedMessage id="NAME" />,
                render: (data, ind, row) => row.portalUser.name ? getFullName(row.portalUser.name) || "-" : '-'
            },
            {
                key: 'portalUser',
                title: <FormattedMessage id="PORTAL_USERNAME_COLUMN_LABEL" />,
                render: (data, ind, row) => row.portalUser.username
            },
            {
                key: 'rpUser',
                title: <FormattedMessage id="RP_USERNAME_COLUMN_LABEL" />,
                render: (data, ind, row) => row.rpUser.username
            },
            {
                key: 'groupName',
                title: <FormattedMessage id="GROUP_NAME_LABEL" />
            },
        ]
        if (targetApplication?.type === 'WINDOWS_LOGIN') {
            temp.push({ key: 'pcName', title: <FormattedMessage id="PC_NAME_LABEL" /> }, { key: 'windowsPackageVersion', title: <FormattedMessage id="AGENT_VERSION_LABEL" /> })
        }
        if (targetApplication?.type === 'LINUX_LOGIN') {
            temp.push({ key: 'hostname', title: <FormattedMessage id="HOST_NAME_LABEL" /> }, { key: 'linuxPamPackageVersion', title: <FormattedMessage id="AGENT_VERSION_LABEL" /> })
        }
        temp.push({
            key: 'lastLoggedInAuthenticator',
            title: <FormattedMessage id="LAST_LOGGED_IN_AUTHENTICATOR_LABEL" />,
            filterKey: 'lastLoggedInAuthenticator',
            filterOption: authenticatorList.filter(_ => {
                if (_ === 'NONE') return false
                else if (_ === 'MASTER_USB' && targetApplication?.type === 'WINDOWS_LOGIN') return true
                else if (_ === 'MASTER_USB') return false
                else return true
            }).map(_ => ({
                label: authenticatorLabelList[_],
                value: _
            }))
        },
            {
                key: 'lastLoggedInAt',
                title: <FormattedMessage id="LAST_LOGGED_IN_TIME_LABEL" />,
                isTime: true
            },
            {
                key: 'ompassRegisteredAt',
                title: <FormattedMessage id="RP_OMPASS_REGISTED_AT_LABEL" />,
                filterType: 'date',
                isTime: true
            }, {
            key: 'hasPasscode',
            title: <FormattedMessage id="RP_HAS_PASSCODE_LABEL" />,
            render: (data) => data ? 'O' : 'X',
            filterKey: 'isPasscodeCheckEnabled',
            filterOption: [true, false].map(_ => ({
                label: _ ? 'O' : 'X',
                value: _
            }))
        })
        return temp
    }, [targetApplication, lang])

    const GetAppTypes = async (params: CustomTableSearchParams) => {
        const _params: GeneralParamsType = {
            pageSize: params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        GetApplicationListFunc(_params, ({ results, totalCount }) => {
            setAppTypes(results)
            let target: ApplicationListDataType | undefined
            const targetType = searchParams.get('applicationType') as ApplicationDataType['type']
            if (targetType && searchParams.get('applicationId')) {
                target = results.find(_ => _.id === searchParams.get('applicationId'))
            } else if (targetType) {
                target = results.find(_ => _.type === targetType)
            }
            setTargetApplication(target)
        }).finally(() => {
            // setDataLoading(false)
        })
    }

    const GetDatas = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            pageSize: params.size,
            page: params.page
        }
        if (params.searchType) {
            _params[params.searchType] = params.searchValue
        }
        if (params.filterOptions) {
            params.filterOptions.forEach(_ => {
                _params[_.key] = _.value
            })
        }
        _params.applicationId = targetApplication?.id
        GetRpUsersListFunc(_params, ({ results, totalCount }) => {
            setTableData(results)
            setTotalCount(totalCount)
        }).finally(() => {
            setDataLoading(false)
        })
    }

    useEffect(() => {
        GetAppTypes({
            page: 0,
            size: INT_MAX_VALUE
        })
    }, [])

    useEffect(() => {
        if (refresh) {
            setTimeout(() => {
                setRefresh(false)
            }, 100);
        }
    }, [refresh])

    useEffect(() => {
        if (targetApplicationRef.current && targetApplication) {
            setRefresh(true)
        }
        targetApplicationRef.current = targetApplication
    }, [targetApplication])

    return <>
        <CustomInputRow title={<FormattedMessage id="APPLICATION_SELECT_LABEL" />}>
            <CustomSelect value={applicationType} onChange={value => {
                setApplicationType(value as ApplicationDataType['type'])
                let target: ApplicationListDataType | undefined
                getApplicationTypesByPlanType().forEach((_: ApplicationDataType['type']) => {
                    if (_ === value) {
                        target = appTypes.find(__ => __.type === value)
                    }
                })

                if (target) {
                    setRefresh(true)
                }
                if (target) {
                    customPushRoute({
                        applicationType: target.type,
                        applicationId: target.id
                    }, true)
                } else {
                    customPushRoute({
                        applicationType: value
                    }, true, true)
                }
                setTargetApplication(target)
            }} items={getApplicationTypesByPlanType().map(_ => ({
                key: _,
                label: getApplicationTypeLabel(_),
            }))} needSelect />
            {applicationType && <CustomSelect value={targetApplication?.id} onChange={value => {
                const target = appTypes.find(_ => _.id === value)
                if (target) {
                    setTargetApplication(target)
                    customPushRoute({
                        applicationType: target.type,
                        applicationId: target.id
                    }, true)
                }
            }} items={typeItems(applicationType)} needSelect />}
        </CustomInputRow>
        {
            !refresh && targetApplication && <CustomTable<RpUserListDataType>
                className='tab_table_list'
                loading={dataLoading || !(!refresh && targetApplication)}
                theme='table-st1'
                datas={tableData}
                hover
                refresh={refresh}
                searchOptions={tableSearchOptions}
                onSearchChange={(data) => {
                    GetDatas(data)
                }}
                pagination
                columns={tableColumns}
                onBodyRowClick={(row, index, arr) => {
                    navigate(`/UserManagement/detail/${row.portalUser.id}`, {
                        state: {
                            targetId: row.authenticationInfoId
                        }
                    });
                }}
                totalCount={totalCount}
            />
        }
    </>
}

export default ApplicationUserManagement