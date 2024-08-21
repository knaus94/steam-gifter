export interface GameInfoResponse {
	[gameId: string]: {
		success: true;
		data: {
			price_overview?: {
				currency: string;
				initial: number;
				final: number;
				discount_percent: number;
				initial_formatted: string;
				final_formatted: string;
			};
			price?: {
				currency: string;
				initial: number;
				final: number;
				discount_percent: number;
				initial_formatted: string;
				final_formatted: string;
			};
		};
	};
}
