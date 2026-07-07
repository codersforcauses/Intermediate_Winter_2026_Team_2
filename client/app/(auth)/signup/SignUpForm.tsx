// Must use to turn this into client component
// Allows usage of useState, useEffect, onClick, onSubmit, etc
"use client";

// useForm from react-hook-form will be used instead of useState
// useState = manual form handling, state updates everytime user types (good for small forms)
// useForm = form library, updates when needed (better for larger forms)
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  verifyPassword: string;
};

export default function SignUpForm() {
  // useForm setup
  const {
    register, // connects input to the form system
    handleSubmit, // wraps submit function to give form `data.<input-key>`
    formState: { errors }, // auto stores validation `errors.<input-key>?.message`
  } = useForm<SignUpFormData>();

  // Submit function (api/route hanlder)
  async function onSubmit(input: SignUpFormData) {
    try {
      const response = await fetch("api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      // Check for HTTP Errors
      if (!response.ok) {
        // Temporary error message
        alert(`Signup failed: HTTP Error ${response.status}`);
        return;
      }

      const data = await response.json();

      // Temporary success message
      alert("Signup successful!");
    } catch (error) {
      // Temporary error message
      alert(`${error}: Request cannot be completed`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-2"
    >
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        placeholder="food123"
        {...register("username", {
          // Validation
          required: "Username is required",
        })}
      />

      {errors.username && <p>{errors.username.message}</p>}
      
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="food123@email.com"
        // register = track this input as "email"
        {...register("email", {
          // Validation: checks empty + format
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Invalid email"
          }
        })}
      />

      {errors.email && <p>{errors.email.message}</p>}

      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        {...register("password", {
          // Validation
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          }
        })}
      />

      {errors.password && <p>{errors.password.message}</p>}

      <Label htmlFor="verifyPassword">Verify Password</Label>
      <Input
        id="verifyPassword"
        type="password"
        {...register("verifyPassword", {
          required: "Verification of password is required",
        })}
      />

      <Button type="submit" variant="primary" className="my-10 ease-in-out transition-all hover:font-bold">
        Sign Up
      </Button>
    </form>
  );
}
