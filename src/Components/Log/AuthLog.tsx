import Contents from "Components/Layout/Contents"
import ContentsHeader from "Components/Layout/ContentsHeader"
import { useEffect, useState } from "react"
import { Tabs } from "antd"
import ValidAuthLogs from "./ValidAuthLogs"
import InvalidAuthLogs from "./InvalidAuthLogs"
import { useLocation } from "react-router"
import AllAuthLogs from "./AllAuthLogs"
import './AuthLog.css'
import { FormattedMessage } from "react-intl"

type AuthLogType = 'all'|'valid'|'invalid'

const AuthLog = () => {
    const [active, setActive] = useState<AuthLogType>('all')
    const { type } = useLocation().state || {}

    useEffect(() => {
        if (type === 'invalid') {
            setActive(type)
        }
    }, [])

    return <Contents>
        <ContentsHeader title="AUTH_LOG_MANAGEMENT" subTitle="AUTH_LOG_LIST">
        </ContentsHeader>
        <div className="contents-header-container">
            <Tabs
                activeKey={active}
                onChange={act => {
                    setActive(act as AuthLogType)
                }}
                className="auth-log-tab"
                centered
                type="card"
                items={[
                    {
                        label: <FormattedMessage id="ALL_AUTH_LOG_TAB_TITLE_LABEL"/>,
                        key: "all",
                        children: <AllAuthLogs />
                    },
                    {
                        label: <FormattedMessage id="VALID_AUTH_LOG_TAB_TITLE_LABEL"/>,
                        key: "valid",
                        children: <ValidAuthLogs />
                    },
                    {
                        label: <FormattedMessage id="INVALID_AUTH_LOG_TAB_TITLE_LABEL"/>,
                        key: "invalid",
                        children: <InvalidAuthLogs />
                    }
                ]} />
        </div>
    </Contents>
}

export default AuthLog