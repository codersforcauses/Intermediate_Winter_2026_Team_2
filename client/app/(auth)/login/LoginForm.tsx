"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Form from "@/components/layout/Form";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  async function onSubmit(input: LoginFormData) {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Login failed: ${JSON.stringify(errorData)}`);
        return;
      }

      router.push("/home");
      router.refresh();
    } catch (error) {
      alert(`${error}: Request cannot be completed`);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        placeholder="food123"
        {...register("username", {
          required: "Username is required",
        })}
      />

      {errors.username && <p>{errors.username.message}</p>}

      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        {...register("password", {
          required: "Password is required",
        })}
      />

      {errors.password && <p>{errors.password.message}</p>}

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
