// API for Signup Page via Route Handler
// From https://nextjs.org/docs/app/getting-started/route-handlers
// "Route Handlers are defined in a route.js|ts file inside the app directory"
// "there cannot be a route.js file at the same route segment level as page.js"
// Folder structure auto creates route "POST /api/signup"
// Running Next.js 

// Produce a response that redirects to a URL
import { NextResponse } from 'next/server';

// Client sends json and Django as the end point will receive the request and 
// sends the response
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const djangoRes = await fetch('http://localhost:8000/api/signup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await djangoRes.json();

        if (!djangoRes.ok) {
            return NextResponse.json(data, { status: djangoRes.status });
        }

        // Django returns after the token fix
        const response = NextResponse.json({ user: data.user }, { status: djangoRes.status });

        response.cookies.set('access_token', data.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60, // JWT access token lifetime
        });

        response.cookies.set('refresh_token', data.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // JWT refresh token lifetime
        });

        return response;
    } catch (err) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500});
    }
}