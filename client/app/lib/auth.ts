import { cookies } from "next/headers";

export type CurrentUser = {
    id: number;
    username: string;
    email: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return null;

    const res = await fetch(`${process.env.DJANGO_API_URL}/api/user/`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) return null; // covers expired/invalid token
    return res.json();
}