// Note: @/ is an alias (shortcut) for imports
// Based on `tsconfig.json`, "@/" starts with "client/app"

import Image from "next/image";
import Link from "next/link";
import SignUpForm from "@/(auth)/signup/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
        {/* div for same width for all children divs within it */}
        <div className="max-w-2xl">
          <header
            id="intro"
            className="flex flex-col py-8 space-y-4 items-center justify-center max-w-4xl">
            <Image
                className=""
                src="/recipe-book.png"
                alt="BrokeMeals logo"
                width={100}
                height={100}
            />
            <h1>Join BrokeMeals!</h1>
            <h2>Create your account and start prepping your meal</h2>
          </header>

          {/* Displays the signup form */}
          <div>
            <SignUpForm />
          </div>

          <footer>
            <h2 className="my-2 flex justify-center items-center text-center">
              Already have an account?&nbsp; 
              <Link href={"/login"} className="text-main hover:text-secondary-dark hover:font-bold hover:underline">Login</Link>
            </h2>
          </footer>
        </div>
    </div>
  )
}