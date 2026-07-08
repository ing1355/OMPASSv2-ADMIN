import { useMemo } from "react";
import { useSelector } from "react-redux";

const useFullName = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);

    return useMemo(() => (name: UserNameType) => {
        if (lang === 'EN') {
            return `${name.firstName ?? ""} ${name.lastName ?? ""}`
        } else {
            return `${name.lastName ?? ""}${name.firstName ?? ""}`
        }
    }, [lang])
};

export default useFullName