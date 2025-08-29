import type { Cookies } from "@sveltejs/kit";
import { API_URL } from '$env/static/private';

interface FetcherServerOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    cookies: Cookies;
}

async function fetcherServer({
    method,
    url,
    body,
    headers,
    queryParams,
    cookies
}: FetcherServerOptions) {
    try {
        let fullUrl =  `${API_URL}${url}`;
        if (queryParams) {
            const queryString = new URLSearchParams(queryParams).toString();
            fullUrl += `?${queryString}`;
        }

        const token = cookies.get('token');

        const response = await fetch(fullUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...token ? { 'Authorization': `Bearer ${token}` } : {},
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            const errorData = await response.json();

            if(response.status === 401) {
                // Handle unauthorized access
                console.error('Unauthorized access - perhaps your token is invalid?');
                // log out the user or redirect to login
                cookies.delete('token', { path: '/' });
                // Optionally, you can fetch a refresh token here
            }

            throw new Error(errorData.message || 'An error occurred while fetching data.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetcherServer:', error);
        throw error;
    }
}

export { fetcherServer };