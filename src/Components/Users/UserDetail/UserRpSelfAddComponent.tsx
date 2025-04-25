import CustomModal from 'Components/Modal/CustomModal';
import './UserRpSelfAddComponent.css'
import { useEffect, useLayoutEffect, useState } from 'react';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import CustomSelect from 'Components/CommonCustomComponents/CustomSelect';
import { GetApplicationListFunc, RPPrimaryAuthFunc } from 'Functions/ApiFunctions';
import RegisterOMPASSAuthModal from 'Components/Modal/RegisterOMPASSAuthModal';
import Input from 'Components/CommonCustomComponents/Input';
import Button from 'Components/CommonCustomComponents/Button';

type UserRpSelfAddComponentProps = {
    refreshCallback: () => void
}

const UserRpSelfAddComponent = ({ refreshCallback }: UserRpSelfAddComponentProps) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState("")
    const [rpUsername, setRpUsername] = useState('')
    const [rpPassword, setRpPassword] = useState('')
    const [applications, setApplications] = useState<ApplicationListDataType[]>([])
    const [authLoading, setAuthLoading] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState<ApplicationListDataType | undefined>()
    const [dataLoading, setDataLoading] = useState(false)
    const { formatMessage } = useIntl()

    const getApplications = async (params: CustomTableSearchParams) => {
        setDataLoading(true)
        const _params: GeneralParamsType = {
            page_size: params.size,
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
        }
    }, [modalOpen])

    return <>
        <Button loading={dataLoading} className='user-detail-self-rp-user-add-container' onClick={() => {
            getApplications({
                page: 1,
                size: 99999,
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
            + 사용자 추가
        </Button>
        <CustomModal
            open={modalOpen}
            onCancel={() => {
                setModalOpen(false)
            }}
            type="info"
            typeTitle={formatMessage({ id: 'USER_RP_SELF_ADD_MODAL_TITLE' })}
            typeContent={<>
                <div>
                    OMPASS 포탈에서는 일부 애플리케이션(인증 기능만 제공하는 애플리케이션)에 대해 사용자가 직접 OMPASS 등록을 진행할 수 있는 기능을 제공합니다.
                </div>
                <br />
                <div className='user-detail-self-rp-user-add-application-select-container'>
                    <div>
                        애플리케이션 선택
                    </div>
                    <CustomSelect
                        items={applications.map(_ => ({
                            key: _.id,
                            label: _.name,
                            value: _.id
                        }))}
                        needSelect
                        value={selectedApplication?.id}
                        onChange={(value) => {
                            setSelectedApplication(applications.find(_ => _.id === value))
                        }}
                    />
                </div>
                <br />
                {
                    selectedApplication && <>
                        <div>
                            애플리케이션에서 사용하는 계정 정보를 입력해주세요.
                        </div>
                        <Input placeholder={formatMessage({ id: 'USER_ID_PLACEHOLDER' })} value={rpUsername} onChange={(e) => {
                            setRpUsername(e.target.value)
                        }} autoComplete='off'/>
                        <Input placeholder={formatMessage({ id: 'PASSWORD_PLACEHOLDER' })} value={rpPassword} onChange={(e) => {
                            setRpPassword(e.target.value)
                        }} type='password' autoComplete='off' />
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
                            console.log('res: ',res, res.primaryAuthToken)
                            setAuthModalOpen(res.primaryAuthToken)
                        } else {
                            message.error("계정 정보가 올바르지 않습니다.")
                        }
                    })
                }
            }}
            buttonLoading />
        <RegisterOMPASSAuthModal primaryAuthToken={authModalOpen} applicationId={selectedApplication?.id} opened={authModalOpen !== ""} onCancel={() => {
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

export default UserRpSelfAddComponent;