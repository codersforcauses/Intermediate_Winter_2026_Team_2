// This component behaves exactly like a normal HTML label
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

// props = everything that will be passed into <Input />
// {...props} = actually passing it to <input>

export default function Label(props: LabelProps) {
    return (
        <label
            {...props}
            className="block text-sm font-medium mb-1"
        />
    )
}