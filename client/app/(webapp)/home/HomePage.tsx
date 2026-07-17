import Link from "next/link";
import {BookOpen, Heart, Carrot, PlusCircle} from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Browse Recipes",
        description: "Explore a collection of delicious recipes from all around the world. Use our smart search and ingredient filters to find exactly what you're craving.",
        href: "/recipes",
        guestAllowed: true,
    },
    {
        icon: Heart,
        title: "Save Your Favorites",
        description: "Found something you'd like to cook? Save recipes to your personal collection for quick access anytime. Build your yummy recipe library!",
        href: "/saved",
        guestAllowed: false,
    },
    {
        icon: Carrot,
        title: "Ingredient Search",
        description: "Type what you have in the fridge and find recipes that match! Our ingredient tagging system suggests recipes based on what you want to cook with.",
        href: "/recipes?filter=ingredients",
        guestAllowed: true,
    },
    {
        icon: PlusCircle,
        title: "Create and Share",
        description: "Got a family recipe or new famous social media recipe? Share it with the community by adding photos, instructions, and let others try your culinary masterpieces.",
        href: "/create",
        guestAllowed: false,
    },
];

export default function HomePage() {
    return (
        <div className="flex flex-col items-center py-12 px-4">
            <h1 className="text-2xl font-bold mb-2">Welcome to BrokeMeal!</h1>
            <p className="text-center max-w-xl mb-10 text-gray-600">
                Your cozy corner for discovering, saving, and sharing amazing
                recipes. Let's make cooking fun and easy!
            </p>

        <div className="grid grid-cols-2 gap-6 max-w-3xl w-full">
            {features.map((feature) => (
                <div key={feature.title} className="border border-main rounded-lg p-6 flex flex-col">
                    <feature.icon className="text-lg" size={28} />

                    <h2 className="text-main mb-2 font-semibold text-lg">{feature.title}</h2>
                    <p className="text-foreground mb-4"> {feature.description} </p>
                    <Link href={feature.href} className="text-main hover:text-secondary-dark 
                    hover:font-bold hover:underline">
                    Get Started </Link>
                </div>
            ))}
            </div>
        </div>
    );
}