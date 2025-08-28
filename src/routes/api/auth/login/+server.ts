import { json } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
	const { username, password } = await request.json();

    console.log('Login attempt:', { username, password });

	// example login
    if(username == "admin" && password == "password") {
        // here u can fetch to backend for get jwt token.
        // in this case we will just return a mock token
        const fakeToken = "1234567890abcdef";

        // save token on cookies
        cookies.set("token", fakeToken, {
            path: "/", // set to root path
            httpOnly: true, // set to true to prevent client-side access
            sameSite: "strict", // set to strict to prevent CSRF
            secure: process.env.NODE_ENV === "production", // set to true if production
            maxAge: 60 * 60 * 24 // 1 day
        });
        
        return json({ success: true, status: 200 });
    }

	return json({ success: false, message: 'Invalid username or password', status: 401 });
}
