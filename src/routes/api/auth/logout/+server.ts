import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
    // u can fetch to api for delete jwt or etc

	cookies.delete('token', { path: '/' });

	return json({ success: true, message: 'Logged out' });
}
