import RecipesPage from "./RecipesPage";
import { getCurrentUser } from "@/lib/auth";

export default async function Recipes() {
    const user = await getCurrentUser();
    return <RecipesPage isGuest={!user} />;
}
