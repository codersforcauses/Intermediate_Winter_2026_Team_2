// Route URL
import HomePage from "./HomePage";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
    const user = await getCurrentUser();
    return(
         <HomePage isGuest={!user} />
    );
}