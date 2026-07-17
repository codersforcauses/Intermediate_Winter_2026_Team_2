"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormValues = {
    title: string;
    description: string;
    servingSize: number;
    prepTimeMinutes: number;
    instructions: string;
    ingredients: { amount: string; ingredientName: string; description: string }[];
};

export default function CreatePage() {
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            ingredients: [{ amount: "", ingredientName: "", description: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true);
        setError(null);

        const steps = data.instructions
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("serving_size", String(data.servingSize));
        formData.append("prep_time_minutes", String(data.prepTimeMinutes));
        formData.append("ingredients", JSON.stringify(
            data.ingredients.map((i) => ({
                amount: i.amount,
                ingredient_name: i.ingredientName,
                description: i.description,
            }))
        ));
        formData.append("steps", JSON.stringify(steps));
        if (image) formData.append("image", image);

        try {
            const res = await fetch("/api/recipes", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Failed to create recipe");
            router.push("/recipes");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border border-main rounded-xl p-8 w-full max-w-2xl"
        >
            <h2 className="text-xl font-bold text-main mb-1">Recipe Details</h2>
            <p className="text-foreground/60 text-sm mb-6">Fill in the details below to create your recipe</p>

            <label className="block text-sm font-medium mb-1">Recipe Name *</label>
            <input
                {...register("title", { required: true })}
                placeholder="e.g., Roast Chicken"
                className="w-full border border-input-gray rounded-md px-3 py-2 mb-1"
            />
            {errors.title && <p className="text-red-500 text-xs mb-3">Required</p>}

            <label className="block text-sm font-medium mb-1 mt-3">Description *</label>
            <input
                {...register("description", { required: true })}
                placeholder="A brief description of your recipe..."
                className="w-full border border-input-gray rounded-md px-3 py-2"
            />

            <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Serving Size *</label>
                    <input
                        type="number"
                        {...register("servingSize", { required: true, valueAsNumber: true })}
                        placeholder="e.g., 4 (int value only)"
                        className="w-full border border-input-gray rounded-md px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Prep Time (minutes) *</label>
                    <input
                        type="number"
                        {...register("prepTimeMinutes", { required: true, valueAsNumber: true })}
                        placeholder="e.g., 30"
                        className="w-full border border-input-gray rounded-md px-3 py-2"
                    />
                </div>
            </div>

            <label className="block text-sm font-medium mb-1 mt-4">Ingredients *</label>
            {fields.map((field, index) => (
                <div key={field.id} className="border border-input-gray rounded-md p-2 mb-2">
                    <div className="flex gap-2 mb-2">
                        <input
                            {...register(`ingredients.${index}.amount` as const, { required: true })}
                            placeholder="Amount"
                            className="w-1/4 border border-input-gray rounded-md px-3 py-2"
                        />
                        <input
                            {...register(`ingredients.${index}.ingredientName` as const, { required: true })}
                            placeholder="Actual Ingredient (tag)"
                            className="flex-1 border border-input-gray rounded-md px-3 py-2"
                        />
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="px-3 border border-input-gray rounded-md text-foreground/50"
                            >
                                −
                            </button>
                        )}
                    </div>
                    <input
                        {...register(`ingredients.${index}.description` as const)}
                        placeholder="Description (optional)"
                        className="w-full border border-input-gray rounded-md px-3 py-2"
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={() => append({ amount: "", ingredientName: "", description: "" })}
                className="text-sm text-main hover:underline mb-4"
            >
                + Add ingredient
            </button>

            <label className="block text-sm font-medium mb-1">Instructions *</label>
            <textarea
                {...register("instructions", { required: true })}
                placeholder="Step-by-step cooking instructions... (one step per line)"
                className="w-full border border-input-gray rounded-md px-3 py-2 mb-4"
                rows={4}
            />

            <label className="block text-sm font-medium mb-1">Image</label>
            <label className="flex items-center justify-center border-2 border-dashed border-input-gray rounded-md h-24 cursor-pointer text-foreground/40 text-2xl mb-6">
                {image ? image.name : "+"}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
            </label>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex justify-end gap-3">
                <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-input-gray rounded-md">
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-main text-white rounded-md disabled:opacity-50"
                >
                    {submitting ? "Creating..." : "Create Recipe"}
                </button>
            </div>
        </form>
    );
}