export interface DigisellerWebApiConfig {
	sellerId: number;
	apikey: string;
	token?: string;
	httpProxy?: string;
}

export enum DigisellerLangEnum {
	en = 'en-US',
	ru = 'ru-RU',
}

export enum RetvalEnum {
	Success,
	ErrLoginOrSign,
	AccountBlocked,
	RequestError,
	TimestampError,
	BodyIsEmpty = -5,
}

export interface ApiloginResponseInterface {
	retval: RetvalEnum;
	desc: string;
	token: string;
	seller_id: number;
	valid_thru: Date;
}

/**
 * @example
 *  retval: 0,
    retdesc: null,
    inv: 188255160,
    id_goods: 3839573,
    amount: 13.44,
    profit: 13.24,
    type_curr: 'WMR',
    amount_usd: 0.1371,
    date_pay: '13.08.2023 17:20:40',
    method: 'QIWI',
    email: 'psixo1996@gmail.com',
    name_invoice: 'Fishermurs',
    lang: 'ru-RU',
    agent_id: 0,
    agent_percent: 0,
    query_string: 'b3B0aW9ucz1jaGVjaw==',
    unit_goods: null,
    cnt_goods: 1,
    unique_code_state: { options: 5, date_check: '13.08.2023 17:20:43' },
    options: [
      {
        id: 408596,
        name: 'Ссылка на Ваш профиль Steam',
        value: 'https://steamcommunity.com/profiles/76561199435289452/'
      },
      { id: 417020, name: 'Регион вашего аккаунта', value: 'Казахстан' }
    ]
 */
export interface CheckCodeResponseInterface {
	retval: RetvalEnum;
	retdesc: string | null;
	inv: number;
	id_goods: number;
	amount: number;
	type_curr: string;
	profit: string;
	amount_usd: number;
	date_pay: string;
	email: string;
	agent_id: number;
	agent_percent: number;
	unit_goods: number;
	cnt_goods: number;
	promo_code: string;
	bonus_code: string;
	cart_uid: string;
	unique_code_state: {
		options: number;
		date_check?: string;
		date_delivery?: string;
		date_confirmed?: string;
		date_refuted?: string;
	};
	options?: { id: number; name: string; value: string }[];
}

// export type DigisellerGetProductType = Omit<
// 	ResponseDigisellerGetProductDto,
// 	'id_seller' | 'info' | 'add_info' | 'base_currency' | 'base_price' | 'release_date' | 'owner_id' | 'sale_info' | 'release_date'
// >;

// /**
//  * @example
//  *  id: 3839573,
//     id_seller: 175852,
//     name: 'Fishermurs',
//     info: 'Fishermurs',
//     add_info: 'Fishermurs',
//     collection: 'pins',
//     base_currency: 'WMR',
//     base_price: 10,
//     price_usd: 0.14,
//     price_rub: 12,
//     price_eur: 0.1,
//     price_uah: 5.27,
//     owner_id: 0,
//     release_date: null,
//     cnt_sell: 14,
//     cnt_sell_hidden: 0,
//     cnt_return: 0,
//     cnt_return_hidden: 0,
//     in_stock: 1,
//     num_in_stock: 3,
//     num_in_lock: 0,
//     sale_info: {
//       common_base_price: null,
//       common_price_usd: null,
//       common_price_rur: null,
//       common_price_eur: null,
//       common_price_uah: null,
//       sale_begin: null,
//       sale_end: null,
//       sale_percent: null
//     }
//  */
// export class ResponseDigisellerGetProductDto {
// 	@Expose({ name: 'id' }) digisellerId: number;

// 	@Exclude() id_seller: number;

// 	@Expose({ name: 'name' }) productName: string;

// 	@Exclude() info: string;

// 	@Exclude() add_info: string;

// 	collection: 'digi' | 'pins' | 'unit' | 'book' | 'soft';

// 	@Exclude() base_currency: string;

// 	@Exclude() base_price: number;

// 	@Expose({ name: 'price_usd' }) priceUsd: number;

// 	@Expose({ name: 'price_rub' }) priceRub: number;

// 	@Expose({ name: 'price_eur' }) priceEur: number;

// 	@Expose({ name: 'price_uah' }) priceUah: number;

// 	@Exclude() release_date: Date | null;

// 	@Exclude() owner_id: number;

// 	@Expose({ name: 'cnt_sell' }) cntSell: number;

// 	@Expose({ name: 'cnt_sell_hidden' }) @Transform(({ value }) => (value == 0 ? true : false)) cntSellHidden: boolean;

// 	@Expose({ name: 'cnt_return' }) cntReturn: number;

// 	@Expose({ name: 'cnt_return_hidden' }) @Transform(({ value }) => (value == 0 ? true : false)) cntReturnHidden: boolean;

// 	@Expose({ name: 'in_stock' }) @Transform(({ value }) => (value == 1 ? true : false)) inStock: boolean;

// 	@Expose({ name: 'num_in_stock' }) numInStock: number;

// 	@Expose({ name: 'num_in_lock' }) numInLock: number;

// 	@Exclude() sale_info: {
// 		common_base_price: number | null;
// 		common_price_usd: number | null;
// 		common_price_rur: number | null;
// 		common_price_eur: number | null;
// 		common_price_uah: number | null;
// 		sale_begin: Date | null;
// 		sale_end: Date | null;
// 		sale_percent: number | null;
// 	};
// }

export interface ResponseDigisellerGetProductInterface {
	retval: number;
	retdesc: string;
	product: {
		id: number;
		id_prev: number;
		id_next: number;
		name: string;
		price: number;
		currency: string;
		url: string;
		info: string;
		add_info: string;
		release_date: string;
		agency_fee: number;
		agency_sum: number;
		agency_id: number;
		collection: string;
		propertygood: number;
		is_available: number;
		show_rest: number;
		num_in_lock: number;
		owner: number;
		section_id: number;
		pwyw: number;
		label: string;
		no_cart: number;
		prices: {
			initial: {
				RUB: number;
				USD: number;
				EUR: number;
				UAH: number;
				mBTC: number;
				mLTC: number;
			};
			default: {
				RUB: number;
				USD: number;
				EUR: number;
				UAH: number;
				mBTC: number;
				mLTC: number;
			};
		};
		payment_methods: {
			name: string;
			code: string;
			hide: number;
			currencies: {
				currency: string;
				code: string;
				price: number;
			}[];
		}[];
		preview_imgs: {
			id: number;
			url: string;
			width: number;
			height: number;
		}[];
		type_good: number;
		type: string;
		text: {
			date: string;
			size: number;
		};
		category_id: number;
		breadcrumbs: {
			id: number;
			name: string;
			products_cnt: number;
		}[];
		discounts: {
			summa: number;
			percent: number;
		}[];
		gift_commiss: number;
		options: {
			id: number;
			name: string;
			label: string;
			comment: string;
			type: string;
			separate_content: number;
			required: number;
			variants: {
				value: number;
				text: string;
				default: number;
				modify: string;
				modify_value: number;
				modify_type: string;
			}[];
		}[];
		options_check: number;
		statistics: {
			sales: number;
			sales_hidden: number;
			refunds: number;
			refunds_hidden: number;
			good_reviews: number;
			good_reviews_hidden: number;
			bad_reviews: number;
			bad_reviews_hidden: number;
		};
		seller: {
			id: number;
			name: string;
		};
	};
}
