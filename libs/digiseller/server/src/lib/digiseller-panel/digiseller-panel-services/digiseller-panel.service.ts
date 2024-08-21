import { ConfigErrorsEnum } from '@libs/config/common';
import { ConfigError } from '@libs/config/server';
import { LangEnum, throwError } from '@libs/core/common';
import { ClsCustomStore, OKDto } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClsService } from 'nestjs-cls';
import { DigisellerConfigService } from '../../digiseller-services/digiseller-config.service';
import { DigisellerService } from '../../digiseller-services/digiseller.service';
import {
	DigisellerProductPanelArgs,
	DigisellerProductPanelCreateArgs,
	DigisellerProductPanelUpdateArgs,
} from '../digiseller-panel-dto/digiseller-panel.dto';
import { DigisellerProductPanelSelectedFields } from '../digiseller-panel-types/digiseller-panel.types';

@Injectable()
export class DigisellerPanelService {
	private readonly logger = new Logger(DigisellerPanelService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly digisellerConfigService: DigisellerConfigService,
		private readonly clsService: ClsService<ClsCustomStore>,
		private readonly digisellerService: DigisellerService,
	) {}

	async getProducts({ digisellerId, isDisabled, name, take, skip, sort, id }: DigisellerProductPanelArgs) {
		const where: Prisma.DigisellerProductWhereInput = {
			id: id
				? {
						equals: id,
				  }
				: undefined,
			digisellerId: digisellerId
				? {
						equals: digisellerId,
				  }
				: undefined,
			OR: name
				? Object.values(LangEnum).map((lang) => ({
						name: {
							path: [lang],
							string_contains: name,
						},
				  }))
				: undefined,
			isDisabled,
		};

		return Promise.all([
			this.sdkPrismaService.digisellerProduct.findMany({
				where,
				skip,
				take,
				orderBy: {
					[Prisma.DigisellerProductScalarFieldEnum[sort.field]]: sort.type,
				},
				select: {
					...DigisellerProductPanelSelectedFields,
				},
			}),
			this.sdkPrismaService.digisellerProduct.count({
				where,
			}),
		]).then(([records, total]) => ({ records, total }));
	}

	async getProduct(id: number) {
		return this.sdkPrismaService.digisellerProduct.findUnique({
			where: { id },
			select: {
				...DigisellerProductPanelSelectedFields,
			},
		});
	}

	async createProduct({
		digisellerId,
		editionSelection,
		editions,
		name,
		previewUrl,
		isDisabled,
		syncPrice,
		syncPricePercent,
		syncPriceRegion,
	}: DigisellerProductPanelCreateArgs) {
		return this.sdkPrismaService.digisellerProduct
			.create({
				data: {
					digisellerId,
					editionSelection,
					isDisabled,
					name,
					previewUrl,
					syncPrice,
					syncPricePercent,
					syncPriceRegion,
				},
				select: {
					id: true,
				},
			})
			.then(({ id: digisellerProductId }) =>
				this.sdkPrismaService
					.$transaction(
						editions.map(({ bots, name, productId, isDefault }) =>
							this.sdkPrismaService.digisellerProductEdition.create({
								data: {
									digisellerProductId,
									productId,
									name,
									isDefault,
									bots: {
										createMany: {
											data: bots.map(({ regionId, botRegions }) => ({ regionId, botRegions })),
										},
									},
								},
							}),
						),
					)
					.then(() =>
						this.sdkPrismaService.digisellerProduct.findUniqueOrThrow({
							where: {
								id: digisellerProductId,
							},
							select: {
								...DigisellerProductPanelSelectedFields,
							},
						}),
					)
					.catch(() =>
						this.sdkPrismaService.digisellerProduct
							.delete({ where: { id: digisellerProductId } })
							.then(() => throwError(() => new Error())),
					),
			)
			.catch(() => throwError(() => new Error('Не удалось создать')));
	}

	async updateProduct(
		id: number,
		{
			digisellerId,
			editionSelection,
			editions,
			name,
			previewUrl,
			isDisabled,
			syncPrice,
			syncPricePercent,
			syncPriceRegion,
		}: DigisellerProductPanelUpdateArgs,
	) {
		return this.sdkPrismaService.digisellerProduct
			.update({
				where: {
					id,
				},
				data: {
					editionSelection,
					isDisabled,
					digisellerId,
					name,
					previewUrl,
					syncPrice,
					syncPricePercent,
					syncPriceRegion,
					editions: {
						updateMany: {
							where: {
								digisellerProductId: id,
							},
							data: {
								isDeleted: true,
								isDefault: false,
							},
						},
					},
				},
				select: {
					id: true,
				},
			})
			.then(() =>
				this.sdkPrismaService
					.$transaction(
						editions.map(({ bots, name, productId, isDefault }) =>
							this.sdkPrismaService.digisellerProductEdition.create({
								data: {
									digisellerProductId: id,
									productId,
									name,
									isDefault,
									bots: {
										createMany: {
											data: bots.map(({ regionId, botRegions }) => ({ regionId, botRegions })),
										},
									},
								},
							}),
						),
					)
					.then(() =>
						this.sdkPrismaService.digisellerProduct.findUniqueOrThrow({
							where: {
								id,
							},
							select: {
								...DigisellerProductPanelSelectedFields,
							},
						}),
					),
			)
			.catch((e) => {
				this.logger.error(e);
				throw new Error('Не удалось обновить');
			});
	}

	async deleteProduct(id: number) {
		return this.sdkPrismaService.digisellerProduct
			.delete({
				where: {
					id,
				},
			})
			.then(() => new OKDto())
			.catch(() => throwError(() => new Error('Не удалось удалить')));
	}

	//await $(DigisellerService).getProduct(3950960)
	async getDigisellerProductInfo(id: number) {
		const { product } = await this.digisellerService
			.createClient()
			.then((client) => client.getProduct(id))
			//TODO: add error handling
			.catch(() => throwError(() => new ConfigError(ConfigErrorsEnum.UnknownError, this.clsService.get().i18n)));

		if (!product) {
			throw new Error('Товар не найден');
		}

		const config = await this.digisellerConfigService.getConfig();

		const regions = product.options?.find(
			(option) => Object.values(config.regionFieldName).includes(option.label) && option.type === 'radio',
		);
		if (!regions || regions.variants.length === 0) {
			throw new Error('Не обнаружены добавленные регионы');
		}

		const editions = product.options?.find(
			(option) => Object.values(config.editionSelectionFieldName).includes(option.label) && option.type === 'radio',
		);

		return {
			name: product.name,
			preview: product.preview_imgs?.[0]?.url ?? null,
			editionEnabled: !!editions,
			editions: editions?.variants.map(({ text }) => text) ?? [],
		};
	}
}
