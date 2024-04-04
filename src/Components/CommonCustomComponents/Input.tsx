import { SetStateType } from "Types/PropsTypes"

const Input = ({valueChange, ...props}: React.InputHTMLAttributes<HTMLInputElement> & {
    valueChange?: SetStateType<string>
}) => {
    return <input onChange={e => {
        if(valueChange) valueChange(e.target.value)
    }} {...props}/>
}

export default Input