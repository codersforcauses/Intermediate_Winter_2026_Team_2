type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary";
    onClick?: () => void;
}

export default function Button({
    children, 
    type = "button",
    variant = "primary", 
    onClick,
}: ButtonProps) {
    const styles = "px-4 py-2 rounded-md font-medium transition-all"
    const variants = {
        primary: "bg-main text-white",
        secondary: "bg-white text-main",
    };

    return (
        <button type={type} onClick={onClick} className={`${styles} ${variants[variant]}`}>
            {children}
        </button>
    );
}