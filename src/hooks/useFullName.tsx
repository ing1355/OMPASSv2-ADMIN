import { useSelector } from "react-redux";

const useFullName = () => {
    const { lang } = useSelector((state: ReduxStateType) => ({
        lang: state.lang
      }));

    return (name: UserNameType) => {
        if(lang === 'KR') {
            return `${name.firstName}${name.lastName}`
        } else {
            return `${name.firstName} ${name.lastName}`
        }
    }
};

  export default useFullName