type DefaultType = {
	label: string;
	type: string;
	placeholder: string;
	id: string;
	key: string;
	value: string;
	errorMessage: string;
	required?: boolean;
	options?: { 
		hideInput?: boolean;
		hideTable?: boolean;
	 };
}[];
