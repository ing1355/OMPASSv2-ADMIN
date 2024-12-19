import { useSelector } from "react-redux";

const useFullName = () => {
    const lang = useSelector((state: ReduxStateType) => state.lang!);

    return (name: UserNameType) => {
        if(lang === 'KR') {
            return `${name.lastName ?? ""}${name.firstName ?? ""}`
        } else {
            return `${name.firstName ?? ""} ${name.lastName ?? ""}`
        }
    }
};

  export default useFullName