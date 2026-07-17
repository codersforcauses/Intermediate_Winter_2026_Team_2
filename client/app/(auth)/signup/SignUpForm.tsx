// Must use to turn this into client component
// Allows usage of useState, useEffect, onClick, onSubmit, etc
"use client";

// useForm from react-hook-form will be used instead of useState
// useState = manual form handling, state updates everytime user types (good for small forms)
// useForm = form library, updates when needed (better for larger forms)
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Form from "@/components/layout/Form";

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  verifyPassword: string;
};

const FIELD_NAMES: (keyof SignUpFormData)[] = ["username", "email", "password"];

export default function SignUpForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // useForm setup
  const {
    register, // connects input to the form system
    handleSubmit, // wraps submit function to give form `data.<input-key>`
    watch, // read other field values (needed to compare passwords)
    setError, // attach a server-side error message to a specific field
    formState: { errors, isSubmitting }, // auto stores validation `errors.<input-key>?.message`
  } = useForm<SignUpFormData>();

  // Submit function (api/route hanlder)
  async function onSubmit(input: SignUpFormData) {
    setFormError(null);

    try {
      // go through Next.js route handler (sets httpOnly auth cookies)
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: input.username,
          email: input.email,
          password: input.password,
          verify_pass: input.verifyPassword,
        }),
      });

      // Check for HTTP Errors
      if (!response.ok) {
        // Backend returns { fieldName: ["message", ...], ... }
        const errorData: Record<string, string[]> = await response.json();
        let hasFieldError = false;

        for (const field of FIELD_NAMES) {
          if (errorData[field]?.length) {
            setError(field, { type: "server", message: errorData[field].join(" ") });
            hasFieldError = true;
          }
        }

        if (!hasFieldError) {
          const message = Object.values(errorData).flat().join(" ");
          setFormError(message || "Signup failed. Please try again.");
        }

        return;
      }

      // Cookies are already set by the route handler — no need to read tokens here
      setSuccess(true);
      setTimeout(() => {
        router.push("/home");
        router.refresh(); // re-check auth state for sidebar and gated pages
      }, 1200);
    } catch {
      setFormError("Something went wrong. Please check your connection and try again.");
    }
  }

  if (success) {
    return (
      <p className="text-center text-green-600 font-medium">
        Account created successfully! Taking you to BrokeMeal...
      </p>
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
    >
      {formError && <p className="text-red-500">{formError}</p>}

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
          // compare between second password (verifyPassword) and first password (password)
          validate: (value) =>
            value === watch("password") || "Passwords do not match",
        })}
      />

      {errors.verifyPassword && <p>{errors.verifyPassword.message}</p>}
      
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="my-10 ease-in-out transition-all hover:font-bold disabled:opacity-50"
      >
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </Button>
    </Form>
  );
}