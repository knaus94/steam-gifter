import { CacheEvict } from '@knaus94/nestjs-cacheable';
import { OKDto } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable, Logger } from '@nestjs/common';
import { DigisellerConfigService } from '../../digiseller-services/digiseller-config.service';
import { DigisellerConfigUpdatePanelArgs } from '../digiseller-panel-dto/digiseller-config-panel.dto';

@Injectable()
export class DigisellerConfigPanelService {
	private readonly logger = new Logger(DigisellerConfigPanelService.name);

	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly digisellerConfigService: DigisellerConfigService,
	) {}

	async getRegions() {
		return this.digisellerConfigService.getConfig().then(({ regions }) => regions);
	}

	@CacheEvict({
		namespace: DigisellerConfigService.name,
		key: `config`,
	})
	async updateConfig({
		apiKey,
		profileLinkFieldName,
		regionFieldName,
		regions,
		editionSelectionFieldName,
		sellerId,
	}: DigisellerConfigUpdatePanelArgs) {
		return this.digisellerConfigService
			.getConfig()
			.then(({ id: configId, regions: configRegions }) =>
				this.sdkPrismaService.digisellerConfig.update({
					where: {
						id: configId,
					},
					data: {
						apiKey,
						profileLinkFieldName,
						regionFieldName,
						editionSelectionFieldName,
						sellerId,
						regions: (() => {
							const deleteIds = configRegions.reduce((acc, { id, name }) => {
								if (!regions.find((regionName) => regionName === name)) {
									acc.push(id);
								}
								return acc;
							}, [] as number[]);

							const createData = regions.reduce((acc, name) => {
								if (!configRegions.find((region) => region.name === name)) {
									acc.push(name);
								}
								return acc;
							}, [] as string[]);

							return {
								deleteMany:
									deleteIds.length === 0
										? undefined
										: {
												id: {
													in: deleteIds,
												},
										  },
								createMany:
									createData.length === 0
										? undefined
										: {
												data: createData.map((name) => ({ name })),
										  },
							};
						})(),
					},
				}),
			)
			.then(() => new OKDto());
	}
}
