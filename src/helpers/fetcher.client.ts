


interface FetcherClientOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
}

async function fetcherClient({
    method,
    url,
    body,
    headers,
    queryParams
}: FetcherClientOptions) {
    try {
        let fullUrl = url;
        if (queryParams) {
            const queryString = new URLSearchParams(queryParams).toString();
            fullUrl += `?${queryString}`;
        }

        const response = await fetch(fullUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred while fetching data.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in fetcherClient:', error);
        throw error;
    }
}


export { fetcherClient };