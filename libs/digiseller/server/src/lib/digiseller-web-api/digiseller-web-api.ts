import { Nullable } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import {
	ApiloginResponseInterface,
	CheckCodeResponseInterface,
	DigisellerLangEnum,
	DigisellerWebApiConfig,
	ResponseDigisellerGetProductInterface,
	RetvalEnum,
} from './types/digiseller-web-api.types';

export default class DigisellerWebApi {
	private readonly baseURL = 'https://api.digiseller.ru/api';
	private readonly config: DigisellerWebApiConfig;
	private axios: AxiosInstance;

	constructor(config: DigisellerWebApiConfig) {
		this.config = config;

		this.axios = axios.create({
			baseURL: this.baseURL,
			params: config.token
				? {
						token: config.token,
				  }
				: undefined,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	private get sign() {
		const timestamp = Date.now();

		return {
			timestamp,
			sign: crypto
				.createHash('sha256')
				.update(this.config.apikey + timestamp)
				.digest('hex'),
		};
	}

	setToken(token: string) {
		this.axios.defaults.params = {
			token,
		};
	}

	getToken() {
		return new Promise<string>((resolve, reject) => {
			this.axios
				.request({
					method: 'post',
					url: 'apilogin',
					data: {
						seller_id: this.config.sellerId,
						...this.sign,
					},
				})
				.then(({ data }: { data: ApiloginResponseInterface }) => {
					if (data.retval === RetvalEnum.Success) {
						return resolve(data.token);
					}

					return reject();
				})
				.catch(() => {
					return reject();
				});
		});
	}

	checkCode(uniqCode: string) {
		return new Promise<Nullable<CheckCodeResponseInterface>>((resolve, reject) => {
			this.axios
				.request({
					method: 'get',
					url: `purchases/unique-code/${uniqCode}`,
				})
				.then(({ data }: { data: CheckCodeResponseInterface }) => {
					if (data.retval === RetvalEnum.Success) {
						return resolve(data);
					}

					resolve(null);
				})
				.catch(() => {
					reject();
				});
		});
	}

	async getProduct(id: number, lang?: DigisellerLangEnum) {
		return this.axios
			.request<ResponseDigisellerGetProductInterface>({
				method: 'get',
				url: `products/${id}/data`,
				params: {
					lang,
					product_id: id,
				},
				timeout: 5000,
			})
			.then(({ data }) => {
				return data;
			})
			.catch(() => {
				throw new Error();
			});
	}

	async updatePrices(data: { digisellerId: number; price: number }[]) {
		return this.axios
			.request({
				method: 'post',
				url: `product/edit/prices`,
				data: data.map(({ digisellerId: ProductId, price: Price }) => ({ ProductId, Price })),
				timeout: 15000,
			})
			.then(() => {
				return new OKDto();
			})
			.catch(() => {
				throw new Error();
			});
	}
}
