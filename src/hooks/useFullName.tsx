import { useSelector } from "react-redux";

const useFullName = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);

    return (name: UserNameType) => {
        if (lang === 'EN') {
            return `${name.firstName ?? ""} ${name.lastName ?? ""}`
        } else {
            return `${name.lastName ?? ""}${name.firstName ?? ""}`
        }
    }
};

export default useFullName