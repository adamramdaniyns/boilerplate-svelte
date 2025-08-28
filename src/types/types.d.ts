type DefaultType = {
	label: string;
	type: string;
	placeholder: string;
	id: string;
	key: string;
	value: string;
	errorMessage: string;
	options?: {
		hideInput?: boolean;
		hideTable?: boolean;
		canFilter?: boolean;
	};
	validation?: {
		required?: boolean;
		minLength?: number;
		maxLength?: number;
		pattern?: RegExp;
		message?: [string?, string?, string?];
	};
	datas?: { label: string; value: string }[];
};

type Filter = {
	key: string;
	keyWords: string;
	sort: {
		field: string;
		order: 'asc' | 'desc';
	};
};

interface ResponseStack extends Record<string, unknown> {
	rows: Array<Record<string, unknown>>;
	total: number;
	page: number;
	lastPage: number;
	hasNextPage: boolean;
	isLoading: boolean;
};
