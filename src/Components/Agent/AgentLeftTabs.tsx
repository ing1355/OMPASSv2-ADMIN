import { Tabs, TabsProps } from "antd"
import useCustomRoute from "hooks/useCustomRoute"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import './AgentLeftTabs.css'

type AgentLeftTabsProps<T> = TabsProps & {
    defaultKey: T
    onChange?: (key: T) => void
}

const AgentLeftTabs = <T extends string>({
    defaultKey,
    items,
    onChange
}: AgentLeftTabsProps<T>) => {
    const { customPushRoute } = useCustomRoute()
    const [searchParams] = useSearchParams()
    const [active, setActive] = useState(searchParams.get('tabType') ?? defaultKey as string)

    useEffect(() => {
        if (onChange) onChange(active)
    }, [active])

    return <Tabs
        activeKey={active}
        className={"agent-left-tabs"}
        animated
        tabPosition="left"
        onChange={act => {
            setActive(act)
            customPushRoute({
                tabType: act
            }, true, true)
        }}
        items={items} />
}

export default AgentLeftTabs