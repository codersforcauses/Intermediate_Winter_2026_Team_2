// This component behaves exactly like a normal HTML label
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  // May edit depending on desired button style
  const baseStyle = "px-4 py-2 rounded-xl transition-all";
  const variants = {
    primary: "bg-main text-white hover:shadow-gray-400 hover:shadow-md hover:bg-secondary-dark hover:cursor-pointer",
    secondary: "bg-white text-main",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
