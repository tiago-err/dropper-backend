export interface IDrop {
	userId: string;
	id: string;
	name: string;
	image: string;
	store: string;
	size: string;
	url: string;
	price: {
		original: number;
		current: number;
	};
	isStocked: boolean;
}
