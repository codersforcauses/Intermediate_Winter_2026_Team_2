// Implemented using useState to learn how it works
// May change to useForm later on for better validation
"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Form from "@/components/layout/Form";
import {
  ChangeEvent,
  useState,
} from "react";

export default function LoginForm() {
  // useState(initialState) returns array w/ exactly two values:
  // 1. current state: aka what was put in as initialState
  // 2. `set` function: updates the state to a different value and trigger a re-render
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  // Handle input change (state update)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // setSomething(nextState)
    // nextState: value that you want the state to be (only updates the state variable for the next render)
    // Updating object formFata in state by replace whe obj
    // In this case, nextState is an updater function (takes pending state and returns the next state)
    setFormData((prevData) => ({
      ...prevData, // copies object and its existing data (old fields)
      [name]: value, // override this specific field
    }));
  };

  // Processes form data
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = {
        email: "",
        password: "",
    }

    // Validation
    if (!formData.email) nextErrors.email = "Email is required";
    if (!formData.password) nextErrors.password = "Password is required";

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check for HTTP Errors
      if (!response.ok) {
        // Temporary error message
        throw new Error(`Signup failed: HTTP Error ${response.status}`);
      }

      //   const data = await response.json();

      // Temporary success message
      alert("Signup successful!");
    } catch (error) {
      // Temporary error message
      alert(`${error}: Request cannot be completed`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="food123@email.com"
        value={formData.email}
        onChange={handleChange}
      />

      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="primary"
        className="my-10 ease-in-out transition-all hover:font-bold"
      >
        Login
      </Button>
    </Form>
  );
}
