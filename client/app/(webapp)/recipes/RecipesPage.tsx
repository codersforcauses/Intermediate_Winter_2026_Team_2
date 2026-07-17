"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import RecipeCard, { Recipe } from "@/components/recipe/RecipeCard";

const DEFAULT_CHIPS = ["Beef", "Chicken", "Fish", "Onion", "Egg", "Tomato", "Rice", "Garlic"];

export default function RecipesPage({ isGuest }: { isGuest: boolean }) {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [query, setQuery] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
    const [showAllChips, setShowAllChips] = useState(false);

    useEffect(() => {
        fetch("/api/recipes")
            .then((res) => res.json())
            .then((data) => setRecipes(Array.isArray(data) ? data : []));

        fetch("/api/saved-recipes")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setSavedIds(new Set(data.map((s: { recipe: { id: string } }) => s.recipe.id)));
                }
            });
    }, []);

    const allIngredientNames = useMemo(() => {
        if (!recipes) return [];
        const names = new Set<string>();
        recipes.forEach((r) => r.ingredients.forEach((ri) => names.add(ri.ingredient.name)));
        return Array.from(names).sort();
    }, [recipes]);

    const chips = showAllChips ? allIngredientNames : DEFAULT_CHIPS;

    const toggleIngredient = (name: string) => {
        setSelectedIngredients((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    };

    const filteredRecipes = useMemo(() => {
        if (!recipes) return [];
        const q = query.trim().toLowerCase();

        return recipes.filter((recipe) => {
            const ingredientNames = recipe.ingredients.map((ri) => ri.ingredient.name.toLowerCase());

            const matchesQuery =
                !q ||
                recipe.title.toLowerCase().includes(q) ||
                recipe.description.toLowerCase().includes(q) ||
                ingredientNames.some((name) => name.includes(q));

            const matchesIngredients =
                selectedIngredients.size === 0 ||
                Array.from(selectedIngredients).every((selected) =>
                    ingredientNames.includes(selected.toLowerCase())
                );

            return matchesQuery && matchesIngredients;
        });
    }, [recipes, query, selectedIngredients]);

    return (
        <div className="flex flex-col items-center w-full py-12 px-4">
            <h1 className="text-2xl font-bold mb-6">What do you feel like eating today?</h1>

            <div className="w-full max-w-2xl relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search recipes or type ingredients (e.g., chicken, beef)"
                    className="w-full border border-input-gray rounded-full pl-10 pr-4 py-2.5 bg-input-gray/30 focus:outline-none focus:ring-1 focus:ring-main"
                />
            </div>

            <div className="w-full max-w-2xl mb-10">
                <p className="text-sm font-medium mb-2">What&apos;s in your fridge today?</p>
                <div className="flex flex-wrap gap-2">
                    {chips.map((name) => (
                        <button
                            key={name}
                            onClick={() => toggleIngredient(name)}
                            className={`text-sm rounded-full px-3 py-1 border transition-colors ${
                                selectedIngredients.has(name)
                                    ? "bg-main text-white border-main"
                                    : "bg-white text-foreground/70 border-input-gray hover:border-main"
                            }`}
                        >
                            {name}
                        </button>
                    ))}
                    {!showAllChips && (
                        <button
                            onClick={() => setShowAllChips(true)}
                            className="text-sm text-main hover:underline px-3 py-1"
                        >
                            Add more
                        </button>
                    )}
                </div>
            </div>

            {recipes === null ? (
                <p className="text-foreground/50">Loading...</p>
            ) : filteredRecipes.length === 0 ? (
                <p className="text-foreground/50">No recipes match your search.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            initialSaved={savedIds.has(recipe.id)}
                            isGuest={isGuest}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
