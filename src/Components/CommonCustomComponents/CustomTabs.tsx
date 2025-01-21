import { Tabs, TabsProps } from "antd"
import useCustomRoute from "hooks/useCustomRoute"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

type CustomTabsProps<T> = TabsProps & {
    defaultKey: T
    onChange?: (key: T) => void
}

const CustomTabs = <T extends string>({
    defaultKey,
    items,
    onChange
}: CustomTabsProps<T>) => {
    const { customPushRoute } = useCustomRoute()
    const [searchParams] = useSearchParams()
    const [active, setActive] = useState(searchParams.get('tabType') ?? defaultKey as string)

    useEffect(() => {
        if(onChange) onChange(active)        
    },[active])
    
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