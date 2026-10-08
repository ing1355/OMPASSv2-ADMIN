import { DatePicker, message } from "antd"
import Button from "Components/CommonCustomComponents/Button"
import CustomInputRow from "Components/CommonCustomComponents/CustomInputRow"
import Input from "Components/CommonCustomComponents/Input"
import RequiredLabel from "Components/CommonCustomComponents/RequiredLabel"
import CustomModal from "Components/Modal/CustomModal"
import { DownloadServerLogsFunc } from "Functions/ApiFunctions"
import { downloadBlobFile, fileNameFromContentDisposition } from "Functions/GlobalFunctions"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useSelector } from "react-redux"
import downloadIconWhite from '@assets/downloadIconWhite.png'

const serverLogServices: ServerLogServiceType[] = ['ADMIN', 'INTERFACE', 'FIDO']
const serverLogServiceLabel: Record<ServerLogServiceType, string> = {
    ADMIN: 'SETTING_SERVER_LOG_SERVICE_ADMIN_LABEL',
    INTERFACE: 'SETTING_SERVER_LOG_SERVICE_INTERFACE_LABEL',
    FIDO: 'SETTING_SERVER_LOG_SERVICE_FIDO_LABEL'
}
const serverLogLevels: ServerLogLevelType[] = ['INFO', 'ERROR', 'METRICS', 'DEBUG', 'TRACE']

const defaultPeriod = (): [Dayjs, Dayjs] => [dayjs(), dayjs()]

const toggleItem = <T extends string>(list: T[], item: T, checked: boolean) => {
    if (checked) return list.includes(item) ? list : list.concat(item)
    return list.filter(value => value !== item)
}

const parseNodeHeader = (value?: string) => {
    if (!value) return []
    const trimmed = value.trim()
    if (!trimmed || trimmed === '[]') return []
    if (trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed)
            if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
        } catch {
            return trimmed.split(',').map(node => node.trim()).filter(Boolean)
        }
    }
    return trimmed.split(',').map(node => node.trim()).filter(Boolean)
}

const ServerLogDownload = () => {
    const userInfo = useSelector((state: ReduxStateType) => state.userInfo)
    const { formatMessage } = useIntl()
    const [modalOpen, setModalOpen] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [period, setPeriod] = useState<[Dayjs, Dayjs] | null>(defaultPeriod)
    const [services, setServices] = useState<ServerLogServiceType[]>(serverLogServices)
    const [levels, setLevels] = useState<ServerLogLevelType[]>(serverLogLevels)

    const canDownloadServerLog = userInfo?.role === 'ROOT' || userInfo?.role === 'ADMIN'
    if (!canDownloadServerLog) return null

    const resetOptions = () => {
        setPeriod(defaultPeriod())
        setServices(serverLogServices)
        setLevels(serverLogLevels)
    }

    const closeModal = () => {
        if (downloading) return
        setModalOpen(false)
    }

    const handleDownload = () => {
        if (!period?.[0] || !period?.[1]) {
            message.error(formatMessage({ id: 'SETTING_SERVER_LOG_PERIOD_REQUIRED_MSG' }))
            return Promise.reject()
        }
        if (services.length === 0) {
            message.error(formatMessage({ id: 'SETTING_SERVER_LOG_SERVICE_REQUIRED_MSG' }))
            return Promise.reject()
        }
        if (levels.length === 0) {
            message.error(formatMessage({ id: 'SETTING_SERVER_LOG_LEVEL_REQUIRED_MSG' }))
            return Promise.reject()
        }

        const from = period[0].format('YYYY-MM-DD')
        const to = period[1].format('YYYY-MM-DD')
        setDownloading(true)

        return DownloadServerLogsFunc({
            from,
            to,
            services,
            levels
        }).then((res) => {
            const failedNodes = parseNodeHeader(res.headers['x-log-failed-nodes'])
            const fileName = fileNameFromContentDisposition(res.headers['content-disposition'])
                || `ompass-logs_${from}_${to}.tar`
            downloadBlobFile(res.data, fileName, res.headers['content-type'])
            if (failedNodes.length > 0) {
                message.warning(formatMessage({ id: 'SETTING_SERVER_LOG_PARTIAL_FAIL_MSG' }, { nodes: failedNodes.join(', ') }))
            } else {
                message.success(formatMessage({ id: 'SETTING_SERVER_LOG_DOWNLOAD_SUCCESS_MSG' }))
            }
            resetOptions()
            setModalOpen(false)
        }).finally(() => {
            setDownloading(false)
        })
    }

    return <>
        <div className="settings-server-log">
            <CustomInputRow title={<FormattedMessage id="SETTING_SERVER_LOG_DOWNLOAD_LABEL" />}>
                <Button className="st3" icon={downloadIconWhite} onClick={() => setModalOpen(true)}>
                    <FormattedMessage id="DOWNLOAD" />
                </Button>
            </CustomInputRow>
        </div>
        <CustomModal
            open={modalOpen}
            width={560}
            title={<FormattedMessage id="SETTING_SERVER_LOG_DOWNLOAD_LABEL" />}
            titleLeft
            buttonLoading
            noClose={downloading}
            okText={<FormattedMessage id="DOWNLOAD" />}
            onCancel={closeModal}
            onSubmit={handleDownload}
        >
            <div className="settings-server-log-modal">
                <div className="settings-server-log-field">
                    <div className="settings-server-log-modal-label">
                        <RequiredLabel required />
                        <FormattedMessage id="SETTING_SERVER_LOG_PERIOD_LABEL" />
                    </div>
                    <DatePicker.RangePicker
                        size="large"
                        format="YYYY-MM-DD"
                        value={period}
                        allowClear
                        disabled={downloading}
                        disabledDate={(current) => !!current && current.isAfter(dayjs(), 'day')}
                        onChange={(value) => {
                            if (value?.[0] && value?.[1]) setPeriod([value[0], value[1]])
                            else setPeriod(null)
                        }}
                    />
                </div>
                <div className="settings-server-log-field">
                    <div className="settings-server-log-modal-label">
                        <RequiredLabel required />
                        <FormattedMessage id="SETTING_SERVER_LOG_SERVICE_LABEL" />
                    </div>
                    <div className="settings-server-log-options">
                        {serverLogServices.map(service => <Input
                            key={service}
                            type="checkbox"
                            label={<FormattedMessage id={serverLogServiceLabel[service]} />}
                            disabled={downloading}
                            checked={services.includes(service)}
                            onChange={e => {
                                setServices(toggleItem(services, service, e.currentTarget.checked))
                            }}
                        />)}
                    </div>
                </div>
                <div className="settings-server-log-field">
                    <div className="settings-server-log-modal-label">
                        <RequiredLabel required />
                        <FormattedMessage id="SETTING_SERVER_LOG_LEVEL_LABEL" />
                    </div>
                    <div className="settings-server-log-options">
                        {serverLogLevels.map(level => <Input
                            key={level}
                            type="checkbox"
                            label={level}
                            disabled={downloading}
                            checked={levels.includes(level)}
                            onChange={e => {
                                setLevels(toggleItem(levels, level, e.currentTarget.checked))
                            }}
                        />)}
                    </div>
                </div>
            </div>
        </CustomModal>
    </>
}

export default ServerLogDownload
