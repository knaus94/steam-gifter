import { Args, Query, Resolver } from '@nestjs/graphql';
import { ConfigDto } from '../config-dto/config.dto';
import { ConfigService } from '../config-services/config.service';

@Resolver()
export class ConfigResolver {
	constructor(private readonly configHelpersService: ConfigService) {}

	@Query(() => ConfigDto, { name: 'config' })
	getConfig(): Promise<ConfigDto> {
		return this.configHelpersService.getConfig();
	}
}
