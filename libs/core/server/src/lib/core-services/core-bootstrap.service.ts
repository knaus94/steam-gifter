import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { setGlobalI18nService } from '../core-interfaces/i18n.interface';

@Injectable()
export class CoreBootstrapService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(CoreBootstrapService.name);
	private intervalRef: NodeJS.Timer;

	constructor(readonly i18nService: I18nService) {
		setGlobalI18nService(this.i18nService);
	}

	onModuleDestroy() {
		this.logger.log('onModuleDestroy');
		if (this.intervalRef) {
			// @ts-ignore
			clearInterval(this.intervalRef);
		}
	}

	onModuleInit() {
		this.logger.log('onModuleInit');
		let tmStart = new Date().getTime();
		this.intervalRef = setInterval(() => {
			const endTime = new Date().getTime();
			const diff = endTime - tmStart;
			if (diff >= 3000) {
				this.logger.error(`NodeJS event loop was frozen more than 3s. Freeze duration was: ${diff}ms.`);
			}
			tmStart = endTime;
		}, 1000);
	}
}
