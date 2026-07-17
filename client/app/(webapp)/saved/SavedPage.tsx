"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedRecipe = {
    id: number;
    recipe: {
        id: string;
        title: string;
        description: string;
        prep_time_display: string;
        serving_size: number;
    };
};

export default function SavedPage() {
    const [saved, setSaved] = useState<SavedRecipe[] | null>(null);

    useEffect(() => {
        fetch("/api/saved-recipes")
            .then((res) => res.json())
            .then((data) => setSaved(data));
    }, []);

    if (saved === null) {
        return <p className="text-foreground/50">Loading...</p>;
    }

    if (saved.length === 0) {
        return (
            <div className="flex flex-col items-center text-center">
                <h2 className="text-xl font-semibold mb-2">No saved recipes yet</h2>
                <p className="text-foreground/60 mb-6">
                    Start saving recipes you love by clicking the heart icon
                </p>
                <Link href="/recipes" className="px-5 py-2 bg-main text-white rounded-md">
                    Browse Recipes
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
            {saved.map(({ id, recipe }) => (
                <div key={id} className="border border-main rounded-lg p-4">
                    <h3 className="font-semibold text-main">{recipe.title}</h3>
                    <p className="text-sm text-foreground/70">{recipe.description}</p>
                </div>
            ))}
        </div>
    );
}