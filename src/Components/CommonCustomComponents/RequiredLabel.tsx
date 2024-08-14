import './RequiredLabel.css'

const RequiredLabel = ({required}: {
    required? : boolean
}) => {
    return <div className={"required-label" + (required ? ' visible' : '')}>*</div>
}

export default RequiredLabel