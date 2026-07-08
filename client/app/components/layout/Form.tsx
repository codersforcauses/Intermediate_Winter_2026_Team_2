type FormProps = React.FormHTMLAttributes<HTMLFormElement>;

export default function Form({className="", children, ...props}: FormProps) {
    return (
        <form
            className={`flex flex-col space-y-2
                ${className}`}
            {...props}
        >
            {children}
        </form>
    )
}