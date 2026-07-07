"use client"

/* Uses client state (re-renders on browser) */
import Link from "next/link";
import { usePathname } from 'next/navigation'
/*Uses icon library to have lock icon, bookmark, home*/
import { Home, BookOpen, Bookmark, PlusCircle, Lock } from "lucide-react";


/* TypeScript's interface to define an object */
interface SidebarUser {
    name : string;
    isGuest: boolean;
}

/* Object for TypeScript, including waiting parents to pass function to child below*/
interface SidebarObject {
    user?: SidebarUser;
    onExitGuestMode?: () => void;
    onLogout?: () => void;
}

/* Button for sidebar */
const navItems = [
    { label: "Home", href: "/home", icon: Home, guestAllowed: true},
    { label: "Recipes", href: "/recipes", icon: BookOpen, guestAllowed: true},
    { label: "Saved", href: "/saved", icon: Bookmark, guestAllowed: false},
    { label: "Create", href: "/create", icon: PlusCircle, guestAllowed: false},
]

/* Default object call */
export default function LeftSidebar({
    user = { name: "Guest", isGuest: true },
    onExitGuestMode,
    onLogout,
}: SidebarObject) {
    /* Updates URL if user wants to go other page*/
    const pathname = usePathname();

    return (
        /* Uses aside for left column and stack <vertically*/
        <aside className="flex h-screen w-56 flex-col items-center border-r-2 border-main/20 bg-white py-8 px-4">
            {/*Logo*/}
            <div className="flex flex-col items-center gap-1 mb-8">
                <span className="text-lg font-bold text-main">
                    BrokeMeal
                </span>
            </div>

            {/*GREETING DISPLAY FOR USER OR GUEST*/}
            <div className="mb-6 w-full rounded-full bg-main py-2 text-center text-sm font-medium text-white">
                {user.isGuest ? "Browsing as Guest" : `Welcome back ${user.name}`}
            </div>
            
            {/*Creating one link for each navItems (an object) with mapping */}
            <nav className="flex w-full flex-1 flex-col gap-3">
                {navItems.map(({ label, href, icon: Icon, guestAllowed }) => {
                    /*Checks if user nextpath==currentpath->stay on same page*/
                    const isActive = pathname === href;
                    const isLocked = user.isGuest && !guestAllowed;

                    /* Check condition so if user don't show lock icon and vice versa*/
                    return (
                        <Link key={label} href={isLocked ? "/signup" : href} className={`relative flex items-center justify-center gap-2 rounded-full py-2.5 text-sm 
                        font-medium text-white transition-colors ${isActive ? "bg-secondary-dark" : "bg-main hover:bg-secondary-dark"}`}>
                        <Icon className="h-5 w-5" />
                        
                        {label}
                        {isLocked && (<Lock className="absolute right-3 h-3.5 w-3.5 text-white/90" />)}
                        </Link>
                        );
                    })}
                </nav>

                {/* Authorise user credential first */}
                {user.isGuest ? (
                    /*if Guest then shows Sign up link, Login link*/
                    <div className="flex w-full flex-col items-center gap-3 mt-6">
                        <Link href="/signup" className="w-full rounded-full bg-main py-2.5 text-center text-sm font-medium text-white hover:bg-secondary-dark">
                            Sign up
                        </Link>

                        <Link href="/login" className="w-full rounded-full bg-main py-2.5 text-center text-sm font-medium text-white hover:bg-secondary-dark">
                            Login
                        </Link>

                        <button onClick={onExitGuestMode} className="text-xs text-gray-500 underline-offset-2 hover:underline">
                            Exit Guest Mode
                        </button>
                    </div>
                ) : (
                    /* For User mode */
                    <div className="flex w-full flex-col gap-3 mt-6">
                        <div className="rounded-full bg-main py-2.5 text-center text-sm font-medium text-white">
                            Signed in as {user.name}
                        </div>
                        
                        <button onClick={onLogout} className="rounded-full bg-main py-2.5 text-center text-sm font-medium text-white hover:bg-secondary-dark">
                            Logout
                        </button>
                    </div>
                )}
            </aside>
            );
        }