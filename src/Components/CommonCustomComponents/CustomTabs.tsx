import { Tabs, TabsProps } from "antd"
import useCustomRoute from "hooks/useCustomRoute"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

type CustomTabsProps<T extends string> = TabsProps & {
    defaultKey: T
}

const CustomTabs = <T extends string>({
    defaultKey,
    items
}: CustomTabsProps<T>) => {
    const { customPushRoute } = useCustomRoute()
    const [searchParams] = useSearchParams()
    const [active, setActive] = useState(searchParams.get('tabType') ?? defaultKey as string)
    
    return <Tabs
            activeKey={active}
            className={"auth-log-tab"}
            // animated
            onChange={act => {
                setActive(act)
                customPushRoute({
                    tabType: act
                }, true, true)
            }}
            centered
            type="card"
            items={items} />
}

        export default CustomTabs