import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? 'http://localhost:8000';

export async function POST() {
    const refreshToken = (await cookies()).get('refresh_token')?.value;

    if (refreshToken) {
        // Best-effort: invalidate the refresh token server-side so it can't
        // be reused if it was ever captured. Cookies get cleared either way.
        try {
            await fetch(`${DJANGO_API_URL}/api/token/blacklist/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
            });
        } catch {
            // Django unreachable — still proceed to clear cookies below
        }
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set('access_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    response.cookies.set('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    return response;
}
