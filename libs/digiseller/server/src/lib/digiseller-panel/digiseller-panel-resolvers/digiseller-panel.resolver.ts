import { CurrentUser, CurrentUserType } from '@libs/auth/server';
import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { Nullable } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { DigisellerService } from '../../digiseller-services/digiseller.service';
import {
	DigisellerProductInfoDto,
	DigisellerProductPanelArgs,
	DigisellerProductPanelCreateArgs,
	DigisellerProductPanelDto,
	DigisellerProductPanelPaginatedDto,
	DigisellerProductPanelUpdateArgs,
} from '../digiseller-panel-dto/digiseller-panel.dto';
import { DigisellerPanelService } from '../digiseller-panel-services/digiseller-panel.service';

@Resolver()
@UseGuards(AuthGuard)
export class DigisellerPanelResolver {
	constructor(
		private readonly digisellerPanelService: DigisellerPanelService,
		private readonly digisellerService: DigisellerService,
	) {}

	@Query(() => DigisellerProductPanelPaginatedDto, { name: 'panelDigisellerProducts' })
	products(
		@Args({
			name: 'args',
			type: () => DigisellerProductPanelArgs,
		})
		args: DigisellerProductPanelArgs,
	): Promise<DigisellerProductPanelPaginatedDto> {
		return this.digisellerPanelService.getProducts(args);
	}

	@Query(() => DigisellerProductPanelDto, { name: 'panelDigisellerProduct', nullable: true })
	product(
		@Args({
			name: 'id',
			type: () => Int,
		})
		id: number,
	): Promise<Nullable<DigisellerProductPanelDto>> {
		return this.digisellerPanelService.getProduct(id);
	}

	@Mutation(() => DigisellerProductPanelDto, { name: 'panelDigisellerProductCreate' })
	createProduct(
		@Args({
			name: 'args',
			type: () => DigisellerProductPanelCreateArgs,
		})
		args: DigisellerProductPanelCreateArgs,
	): Promise<DigisellerProductPanelDto> {
		return this.digisellerPanelService.createProduct(args);
	}

	@Mutation(() => DigisellerProductPanelDto, { name: 'panelDigisellerProductUpdate' })
	updateProduct(
		@Args({
			name: 'id',
			type: () => Int,
		})
		id: number,
		@Args({
			name: 'args',
			type: () => DigisellerProductPanelUpdateArgs,
		})
		args: DigisellerProductPanelUpdateArgs,
	): Promise<DigisellerProductPanelDto> {
		return this.digisellerPanelService.updateProduct(id, args);
	}

	@Mutation(() => OKDto, { name: 'panelDigisellerProductDelete' })
	deleteProduct(
		@Args({
			name: 'id',
			type: () => Int,
		})
		id: number,
	): Promise<OKDto> {
		return this.digisellerPanelService.deleteProduct(id);
	}

	@Query(() => DigisellerProductInfoDto, { name: 'panelDigisellerParseProductInfo' })
	parseDigisellerProductInfo(
		@Args({
			name: 'digisellerId',
			type: () => Int,
		})
		digisellerId: number,
	) {
		return this.digisellerPanelService.getDigisellerProductInfo(digisellerId);
	}

	@Mutation(() => OKDto, { name: 'panelDigisellerSyncPrices' })
	@Throttle({
		default: {
			limit: 1,
			ttl: 30 * 60, // 30m
		},
	})
	syncPrices(@CurrentUser() currentUser: CurrentUserType): Promise<OKDto> {
		return this.digisellerService.updatePrices();
	}
}
