import { useNavigate } from "react-router"
import { useSearchParams } from "react-router-dom"

const useCustomRoute = () => {
    const navigate = useNavigate()
    const [oldSearchParams] = useSearchParams()
    const customPushRoute = (queryParams: {
        [key: string]: any
    }, replace?: boolean, reset?: boolean) => {
        let resultString = ""
        const result = new URLSearchParams()
        // if(!reset) {
        //     oldSearchParams.forEach((val, key) => {
        //         if(!['tabType', 'applicationType', 'applicationId'].includes(key)) {
        //             result.append(key, val)
        //         }
        //     })
        // }
        if (queryParams) {
            Object.keys(queryParams).forEach(_ => {
                if (_ === 'filterOptions') {
                    if (queryParams.filterOptions) {
                        const filterTargets = (queryParams.filterOptions as TableFilterOptionType).filter(_ => (Array.isArray(_.value) ? _.value.length > 0 : _.value))
                        filterTargets.forEach(__ => {
                            if(Array.isArray(__.value)) {
                                result.delete(__.key)
                                __.value.forEach(v => {
                                    result.append(__.key, v)
                                })
                            } else {
                                result.set(__.key, __.value)
                            }
                        })
                    }
                } else {
                    result.set(_, queryParams[_])
                }
            })
        }
        if (queryParams.tabType) result.set('tabType', queryParams.tabType)
        else if (oldSearchParams.get('tabType')) result.set('tabType', oldSearchParams.get('tabType')!)
        if (queryParams.applicationType) result.set('applicationType', queryParams.applicationType)
        else if (oldSearchParams.get('applicationType')) result.set('applicationType', oldSearchParams.get('applicationType')!)
        if (queryParams.applicationId) result.set('applicationId', queryParams.applicationId)
        else if (oldSearchParams.get('applicationId')) result.set('applicationId', oldSearchParams.get('applicationId')!)
        resultString += result.toString()
        if (!reset || resultString) {
            // window.history.pushState("", "", `${window.location.pathname}?${resultString}`)
            navigate(`${window.location.pathname}?${resultString}`, {
                replace
            })
        } else {
            navigate(`${window.location.pathname}`, {
                replace
            })
        }
    }

    return { customPushRoute }
}

export default useCustomRoute