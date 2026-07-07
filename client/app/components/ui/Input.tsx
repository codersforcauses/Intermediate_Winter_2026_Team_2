// This component behaves exactly like a normal HTML input
// So it can accept standard HTML props: e.g. type, place, value, onChange
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// props = everything that will be passed into <Input />
// {...props} = actually passing it to <input>

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input 
        className={`border p-2 w-full rounded-xl bg-input-gray border-main text-black placeholder-gray-500 
            focus:outline-none focus:ring-1 focus:ring-main shadow-md shadow-gray-400
            ${className}`} 
        {...props} 
    />
  );
}
