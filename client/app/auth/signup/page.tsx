// Note: @/ is an alias (shortcut) for imports
// Based on `tsconfig.json`, "@/" starts with "client/app"

import Image from "next/image";
import SignUpForm from "@/auth/signup/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
        <Image 
            className=""
            src="/recipe-book.png"
            alt="BrokeMeals logo"
            width={100}
            height={100}
        />
        <h1>Join BrokeMeals!</h1>
        <h2>Create your account and start prepping your meal</h2>

        {/* Displays the signup form */}
        <SignUpForm />
    </div>
  )
}