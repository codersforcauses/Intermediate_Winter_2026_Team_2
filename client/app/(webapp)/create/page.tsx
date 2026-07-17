import { getCurrentUser } from "@/lib/auth";
import CreateRecipeForm from "@/components/CreateRecipeForm";

export default async function CreatePage() {
    const user = await getCurrentUser();
    const isGuest = !user;

    return (
        <div className="flex flex-col items-center w-full py-12 px-4">
            <h1 className="text-3xl font-bold mb-1">Create a Recipe</h1>
            <p className="text-foreground/70 mb-8">Share your food masterpiece with everyone</p>

            {isGuest ? (
                <div className="bg-gray-500 text-white w-full max-w-2xl h-64 rounded-lg flex items-center justify-center text-center">
                    You have to create an account to use this feature
                </div>
            ) : (
                <CreateRecipeForm />
            )}
        </div>
    );
}