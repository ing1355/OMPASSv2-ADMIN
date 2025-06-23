import CustomModal from 'Components/Modal/CustomModal';
import './UserRpSelfAddComponent.css'
import { useEffect, useLayoutEffect, useState } from 'react';
import { message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import CustomSelect from 'Components/CommonCustomComponents/CustomSelect';
import { GetApplicationListFunc, RPPrimaryAuthFunc } from 'Functions/ApiFunctions';
import RegisterOMPASSAuthModal from 'Components/Modal/RegisterOMPASSAuthModal';
import Input from 'Components/CommonCustomComponents/Input';
import Button from 'Components/CommonCustomComponents/Button';
import { INT_MAX_VALUE } from 'Constants/ConstantValues';

type UserRpSelfAddComponentProps = {
    refreshCallback: () => void
}

const UserRpSelfAddComponent = ({ refreshCallback }: UserRpSelfAddComponentProps) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState("")
    const [rpUsername, setRpUsername] = useState('')
    const [rpPassword, setRpPassword] = useState('')
    const [applications, setApplications] = useState<ApplicationListDataType[]>([])
    const [selectedApplication, setSelectedApplication] = useState<ApplicationListDataType | undefined>()
    const [dataLoading, setDataLoading] = useState(false)
    const { formatMessage } = useIntl()

    const getApplications = async (params: CustomTableSearchParams) => {
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
        return GetApplicationListFunc(_params, ({ results, totalCount }) => {
            setApplications(results)
        })
    }

    useLayoutEffect(() => {
        if (modalOpen) {
            setRpUsername('')
            setRpPassword('')
            setSelectedApplication(undefined)
        }
    }, [modalOpen])

    return <>
        <Button loading={dataLoading} className='st5 user-detail-self-rp-user-add-container' onClick={() => {
            getApplications({
                page: 0,
                size: INT_MAX_VALUE,
                filterOptions: [{
                    key: 'types',
                    value: ['RADIUS', 'LDAP']
                }]
            }).then(res => {
                setModalOpen(true)
            }).finally(() => {
                setDataLoading(false)
            })
            setModalOpen(true)
        }}>
            + <FormattedMessage id="USER_RP_SELF_ADD_MODAL_USER_ADD_BUTTON_LABEL" />
        </Button>
        <CustomModal
            open={modalOpen}
            onCancel={() => {
                setModalOpen(false)
            }}
            okText={formatMessage({ id: 'NORMAL_ADD_LABEL' })}
            type="info"
            typeTitle={formatMessage({ id: 'USER_RP_SELF_ADD_MODAL_TITLE' })}
            typeContent={<>
                <div className='user-detail-self-rp-user-add-description'>
                    <FormattedMessage id="USER_RP_SELF_ADD_MODAL_SUBSCRIPTION_1" />
                </div>
                <InputContainerHeader title={formatMessage({ id: 'USER_RP_SELF_ADD_MODAL_APPLICATION_INFO_TITLE' })} />
                <div className='user-detail-self-rp-user-add-application-select-container'>
                    <CustomSelect
                        style={{
                            width: '100%',
                            height: '42px',
                            lineHeight: '42px'
                        }}
                        items={applications.map(_ => ({
                            key: _.id,
                            label: _.name,
                            value: _.id
                        }))}
                        noLabel={formatMessage({ id: 'USER_RP_SELF_ADD_MODAL_APPLICATION_SELECT_PLACEHOLDER' })}
                        needSelect
                        value={selectedApplication?.id}
                        onChange={(value) => {
                            setSelectedApplication(applications.find(_ => _.id === value))
                        }}
                    />
                </div>
                {
                    selectedApplication && <>
                        {/* <InputContainerHeader title={formatMessage({ id: 'USER_RP_SELF_ADD_MODAL_USER_INFO_TITLE' })} /> */}
                        <Input containerClassName='user-detail-self-rp-user-add-input-container first' className='st1 login-input username' placeholder={formatMessage({ id: 'USER_ID_PLACEHOLDER' })} value={rpUsername} onChange={(e) => {
                            setRpUsername(e.target.value)
                        }} autoComplete='off' maxLength={20}/>
                        <Input containerClassName='user-detail-self-rp-user-add-input-container' className='st1 login-input password' placeholder={formatMessage({ id: 'PASSWORD_PLACEHOLDER' })} value={rpPassword} onChange={(e) => {
                            setRpPassword(e.target.value)
                        }} type='password' autoComplete='off' maxLength={20}/>
                        <div className='user-detail-self-rp-user-add-info-description'>
                            * <FormattedMessage id="USER_RP_SELF_ADD_MODAL_SUBSCRIPTION_2" />
                        </div>
                    </>
                }
            </>}
            onSubmit={async () => {
                if (!selectedApplication) {
                    message.error(formatMessage({ id: 'PLEASE_SELECT_APPLICATION_FOR_RP_USER_ADD_MSG' }))
                } else if (!rpUsername || !rpPassword) {
                    message.error(formatMessage({ id: 'PLEASE_INPUT_RP_USER_INFO_MSG' }))
                } else {
                    return RPPrimaryAuthFunc({
                        applicationId: selectedApplication.id,
                        username: rpUsername,
                        password: rpPassword
                    }, (res) => {
                        if (res.isSuccess) {
                            setModalOpen(false)
                            setAuthModalOpen(res.primaryAuthToken)
                        } else {
                            message.error(formatMessage({ id: 'APPLICATION_ACCOUNT_INFO_INVALID_MSG' }))
                        }
                    })
                }
            }}
            buttonLoading />
        <RegisterOMPASSAuthModal username={rpUsername} applicationName={selectedApplication?.name} primaryAuthToken={authModalOpen} applicationId={selectedApplication?.id} opened={authModalOpen !== ""} onCancel={() => {
            setAuthModalOpen("")
        }} successCallback={token => {
            message.success(formatMessage({ id: getSuccessMessageByType(selectedApplication?.type) }))
            refreshCallback()
        }} purpose={getPurposeByType(selectedApplication?.type) as AuthPurposeType} targetUserId={""} />
    </>
}

const getPurposeByType = (type?: ApplicationDataType['type']) => {
    if (type === 'RADIUS') {
        return 'RADIUS_REGISTRATION'
    } else if (type === 'LDAP') {
        return 'LDAP_REGISTRATION'
    } else {
        return ""
    }
}

const getSuccessMessageByType = (type?: ApplicationDataType['type']) => {
    if (type === 'RADIUS') {
        return 'RADIUS_OMPASS_REGISTRATION_SUCCESS_MSG'
    } else if (type === 'LDAP') {
        return 'LDAP_OMPASS_REGISTRATION_SUCCESS_MSG'
    } else {
        return ""
    }
}

const InputContainerHeader = ({ title }: { title: React.ReactNode }) => {
    return <div className='user-detail-self-rp-user-add-input-header'>
        <div className='input-header-circle'>
            <div className='input-header-circle-inner' />
        </div>
        {title}
    </div>
}

export default UserRpSelfAddComponent;