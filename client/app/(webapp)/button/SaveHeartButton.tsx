"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export default function SaveHeartButton({
    recipeId,
    initialSaved,
}: {
    recipeId: string;
    initialSaved: boolean;
}) {
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);

    const toggle = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/saved-recipes/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipe_id: recipeId }),
            });
            const data = await res.json();
            setSaved(data.saved);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={toggle} disabled={loading} aria-label="Toggle save recipe">
            <Heart
                size={20}
                className={saved ? "fill-main text-main" : "text-foreground/40"}
            />
        </button>
    );
}