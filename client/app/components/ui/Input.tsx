// This component behaves exactly like a normal HTML input
// So it can accept: type, place, value, onChange
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// props = everything that will be passed into <Input />
// {...props} = actually passing it to <input>

export default function Input(props: InputProps) {
    return (
        <input
            {...props}
            className="border p-2 my-4 w-full rounded-md"
        />
    )
}