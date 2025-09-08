interface FetcherClientOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	url: string;
	body?: Record<string, unknown>;
	headers?: Record<string, string>;
	queryParams?: Record<string, string>;
}

async function fetcherClient(
	{ method, url, body, headers, queryParams }: FetcherClientOptions,
	event?: { fetch: typeof fetch }
) {
	try {
		let fullUrl = url;
		if (queryParams) {
			const queryString = new URLSearchParams(queryParams).toString();
			fullUrl += `?${queryString}`;
		}

		let fetcher;

		if (!event || typeof event.fetch !== 'function') {
			fetcher = fetch;
		} else {
			fetcher = event.fetch;
		}
		const response = await fetcher(fullUrl, {
			method,
			headers: {
				'Content-Type': 'application/json',
				...headers
			},
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
            console.error('Error in fetcherClient:', response);

            if(response.status === 303) {
                // Handle redirect to sign-in
                // fetch to logout
               if(event && typeof event.fetch === 'function') {
                    await event.fetch('/api/auth/logout', {
                        method: 'POST'
                    });
               } else {
                    await fetch('/api/auth/logout', {
                        method: 'POST'
                    });
               }
                // then redirect to sign-in page
                // throw new Error('Redirecting to sign-in');
                return { data: null };
            }
            
			let errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
			try {
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					errorData = await response.json();
				} else {
					errorData.message = await response.text();
				}
			} catch (e) {
				errorData.message = 'No response body';
			}
			throw new Error(errorData.message || 'An error occurred while fetching data.');
		}

		return await response.json();
	} catch (error) {
		console.error('Error in fetcherClient:', error);
		throw error;
	}
}

export { fetcherClient };
