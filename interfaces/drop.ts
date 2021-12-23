export interface IDrop {
	userId: string;
	id: string;
	name: string;
	image: string;
	store: string;
	sizes: {
		[key: string]: boolean;
	};
	url: string;
	price: {
		original: number;
		current: number;
	};
	userSize: string;
}
