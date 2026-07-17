import { Clock, Users, ChefHat } from "lucide-react";
import SaveHeartButton from "@/(webapp)/button/SaveHeartButton";

export type Recipe = {
    id: string;
    title: string;
    description: string;
    prep_time_display: string;
    serving_size: number;
    image: string | null;
    created_by_username: string;
    ingredients: {
        ingredient: { name: string };
    }[];
};

export default function RecipeCard({
    recipe,
    initialSaved,
    isGuest,
}: {
    recipe: Recipe;
    initialSaved: boolean;
    isGuest: boolean;
}) {
    return (
        <div className="relative border border-main rounded-lg overflow-hidden bg-white flex flex-col">
            <div className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5">
                <SaveHeartButton
                    recipeId={recipe.id}
                    initialSaved={initialSaved}
                    isGuest={isGuest}
                />
            </div>

            <div className="h-36 w-full bg-input-gray flex items-center justify-center overflow-hidden">
                {recipe.image ? (
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <ChefHat className="text-foreground/30" size={36} />
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-main mb-1">{recipe.title}</h3>
                <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                    {recipe.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-foreground/60 mb-3">
                    <span className="flex items-center gap-1">
                        <Clock size={14} /> {recipe.prep_time_display}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={14} /> {recipe.serving_size} servings
                    </span>
                </div>

                {recipe.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {recipe.ingredients.slice(0, 4).map((ri, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-input-gray/50 text-foreground/70 rounded-full px-2 py-0.5"
                            >
                                {ri.ingredient.name}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-xs text-foreground/50 mt-auto">
                    By {recipe.created_by_username}
                </p>
            </div>
        </div>
    );
}
