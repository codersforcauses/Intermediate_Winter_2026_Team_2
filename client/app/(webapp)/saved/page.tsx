import { getCurrentUser } from "@/lib/auth";
import SavedRecipesList from "@/components/SavedRecipesList";

export default async function SavedPage() {
    const user = await getCurrentUser();
    const isGuest = !user;

    return (
        <div className="flex flex-col items-center w-full py-12 px-4">
            <h1 className="text-3xl font-bold mb-4">Saved Recipes</h1>

            {isGuest ? (
                <div className="bg-gray-500 text-white w-full max-w-2xl h-64 rounded-lg flex items-center justify-center text-center">
                    You have to create an account to use this feature
                </div>
            ) : (
                <SavedRecipesList />
            )}
        </div>
    );
}