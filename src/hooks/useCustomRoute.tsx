import { useLocation, useNavigate, useParams } from "react-router"
import { useSearchParams } from "react-router-dom"

const useCustomRoute = () => {
    const navigate = useNavigate()
    const [oldSearchParams] = useSearchParams()
    const params = useParams()
    const location = useLocation()
    const pathName = location.pathname
    const splitPathname = pathName.split('/')
    const hasParams = Object.keys(params).length > 1
    const isParamsEnd = Object.values(params).some(_ => splitPathname[splitPathname.length - 1] === _)
    const goBack = () => {
        navigate(-1)
        // navigate(location.pathname.split('/').slice(0, (hasParams && isParamsEnd) ? -2 : -1).join('/') || '/Main', {
        //     replace: true
        // })
    }
    const customPushRoute = (queryParams: {
        [key: string]: any
    }, replace?: boolean, reset?: boolean) => {
        let resultString = ""
        const result = new URLSearchParams()
        if (queryParams) {
            Object.keys(queryParams).forEach(_ => {
                if (_ === 'filterOptions') {
                    if (queryParams.filterOptions) {
                        const filterTargets = (queryParams.filterOptions as TableFilterOptionType).filter(_ => (Array.isArray(_.value) ? _.value.length > 0 : _.value))
                        filterTargets.forEach(__ => {
                            if (Array.isArray(__.value)) {
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
        
        if (queryParams.sortKey) result.set('sortKey', queryParams.sortKey)
        if (queryParams.sortDirection) result.set('sortDirection', queryParams.sortDirection)
        if (queryParams.tabType) result.set('tabType', queryParams.tabType)
        else if (oldSearchParams.get('tabType')) result.set('tabType', oldSearchParams.get('tabType')!)
        if (queryParams.applicationType) result.set('applicationType', queryParams.applicationType)
        else if (oldSearchParams.get('applicationType')) result.set('applicationType', oldSearchParams.get('applicationType')!)
        // if (queryParams.applicationId) result.set('applicationId', queryParams.applicationId)
        // else if (oldSearchParams.get('applicationId')) result.set('applicationId', oldSearchParams.get('applicationId')!)
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

    return { customPushRoute, goBack }
}

export default useCustomRoute