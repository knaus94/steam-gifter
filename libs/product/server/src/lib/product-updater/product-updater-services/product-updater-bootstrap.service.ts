import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductUpdaterService } from './product-updater.service';

@Injectable()
export class ProductPriceUpdaterBootstrapService implements OnApplicationBootstrap {
	private readonly logger = new Logger(ProductPriceUpdaterBootstrapService.name);

	constructor(private readonly productUpdaterService: ProductUpdaterService) {}

	onApplicationBootstrap() {
		this.logger.log('onApplicationBootstrap');
	}

	@Cron(CronExpression.EVERY_3_HOURS)
	private async handleCron() {
		try {
			await this.productUpdaterService.updatePrices();
		} catch (e) {
			this.logger.error(e);
		} finally {
			this.logger.debug('Cron job: update prices finished');
		}
	}
}
