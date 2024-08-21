import { CustomInjectorService } from '@libs/custom-injector/server';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import axios from 'axios';
import { HEALTH_CONFIG, HealthConfig } from '../health-config/health.config';

@Injectable()
export class HealthBootstrapService implements OnApplicationBootstrap {
	constructor(private readonly customInjectorService: CustomInjectorService) {}

	async onApplicationBootstrap() {
		await this.ping();
	}

	get config() {
		return this.customInjectorService.getLastComponentByName<HealthConfig>(HEALTH_CONFIG)!;
	}

	@Interval('ping', 1000 * 60 * 5) // 5 minutes
	async ping() {
		if (!this.config.enable) return;

		try {
			await axios.get(this.config.pingUrl);
		} catch (e) {}
	}
}
