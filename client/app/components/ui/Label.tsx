// This component behaves exactly like a normal HTML label
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

// props = everything that will be passed into <Input />
// {...props} = actually passing it to <input>

export default function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`block text-md my-1 ${className}`}
      {...props}
    />
  );
}
