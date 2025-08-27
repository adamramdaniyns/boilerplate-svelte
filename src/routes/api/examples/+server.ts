import { json } from '@sveltejs/kit';

const API_URL = 'https://api.restful-api.dev/objects'

// GET EXAMPLES
export async function GET({ url }) {
	//https://api.restful-api.dev/objects
	const query = url.searchParams;
	
	const page = query.get('page') || '1';
	const limit = query.get('limit') || '10';
	const key = query.get('key') || '';
	const keywords = query.get('keywords') || '';

	const response = await fetch(API_URL);
	let data = await response.json();
	
	if (key && keywords) {
		data = data.filter((item: Record<string, unknown>) =>
			item[key]?.toString().toLowerCase().includes(keywords.toLowerCase())
		);
	}

	// for dummy purpose add numeric and date to data
	data = data.map((item: Record<string, unknown>) => ({
		...item,
		date: new Date(),
		price: Math.floor(Math.random() * 10000)
	}));	

	const total = data.length;
	const lastPage = Math.ceil(total / Number(limit));
	const hasNextPage = Number(page) < lastPage;
	let limitData = data.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
	
	return json({
		rows: limitData,
		total: total,
		page: Number(page),
		lastPage: lastPage,
		hasNextPage: hasNextPage
	});
}

export async function POST({ request }) {
	const body = await request.json();
	console.log('Received POST data:', body);

	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		console.error('Error creating data:', response.statusText);
		return json({
			success: false,
			error: response.statusText
		});
	}

	const data = await response.json();

	// Simulate a successful creation
	return json({
		success: true,
		data: data,
		message: 'Data created successfully'
	});
}


export async function PUT({ request }) {
	const body = await request.json();

	const response = await fetch(`${API_URL}/${body.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	// Simulate a successful update
	return json({
		success: true,
		message: 'Data updated successfully'
	});
}

export async function DELETE({ request }) {
	const body = await request.json();

	const response = await fetch(`${API_URL}/${body.id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	// Simulate a successful deletion
	return json({
		success: true,
		message: 'Data deleted successfully'
	});
}