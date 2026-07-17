import { NextResponse } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? 'http://localhost:8000';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const tokenRes = await fetch(`${DJANGO_API_URL}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: body.username, password: body.password }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok) {
            return NextResponse.json(tokenData, { status: tokenRes.status });
        }

        const userRes = await fetch(`${DJANGO_API_URL}/api/user/`, {
            headers: { Authorization: `Bearer ${tokenData.access}` },
            cache: 'no-store',
        });
        const user = await userRes.json();

        const response = NextResponse.json({ user }, { status: 200 });

        response.cookies.set('access_token', tokenData.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60, // JWT access token lifetime
        });

        response.cookies.set('refresh_token', tokenData.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // JWT refresh token lifetime
        });

        return response;
    } catch (err) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
