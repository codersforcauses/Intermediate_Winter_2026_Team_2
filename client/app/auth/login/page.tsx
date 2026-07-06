import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <Image
        className=""
        src="/recipe-book.png"
        alt="BrokeMeals logo"
        width={100}
        height={100}
      />
      <h1>Welcome Back to BrokeMeals!</h1>
      <h2>Log in to access your own delicious recipes</h2>
    </div>
  );
}
