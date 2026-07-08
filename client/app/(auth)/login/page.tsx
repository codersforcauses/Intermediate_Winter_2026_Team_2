import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="max-w-4xl">
        <header
          id="intro"
          className="flex flex-col py-8 space-y-4 items-center justify-center max-w-4xl"
        >
          <Image
            className=""
            src="/recipe-book.png"
            alt="BrokeMeals logo"
            width={100}
            height={100}
          />
          <h1>Welcome Back to BrokeMeals!</h1>
          <h2>Log in to access your own delicious recipes</h2>
        </header>

        <div>
          <LoginForm />
        </div>

        <footer className="my-2 gap-y-6 flex flex-col justify-center items-center text-center">
          <h2><Link href={""} className="text-main hover:text-secondary-dark hover:font-bold hover:underline">
            Forgot password?
          </Link></h2>
          <h2>
            Don&apos;t have an account?&nbsp;
            <Link href={"/signup"} className="text-main hover:text-secondary-dark hover:font-bold hover:underline">Sign up</Link>
          </h2>
          <h2>OR</h2>
          <Button type="button" variant="primary" className="w-full ease-in-out transition-all hover:font-bold">
            Browse as guest
          </Button>
          <h2>View others&apos; recipes, no account needed</h2>
        </footer>
      </div>
    </div>
  );
}
