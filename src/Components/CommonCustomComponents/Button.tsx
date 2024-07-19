type ButtonProps = React.DOMAttributes<HTMLButtonElement> & {
    loading?: boolean
    className?: string
}

const Button = ({ className, loading, onClick, ...props } : ButtonProps) => {
    return <button aria-loading={loading} onClick={(e) => {
        if(!loading && onClick) onClick(e)
    }} {...props} className={className}/>
}

export default Button