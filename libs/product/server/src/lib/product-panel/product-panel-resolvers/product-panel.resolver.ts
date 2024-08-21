import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { Nullable } from '@libs/core/common';
import { OKDto } from '@libs/core/server';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { Prisma, RegionCodeEnum } from '@prisma/client';
import {
	ProductPanelArgs,
	ProductPanelCreateArgs,
	ProductPanelDto,
	ProductPanelPaginatedDto,
	ProductPanelRegionPriceDto,
	ProductPanelSteamInfoDto,
	ProductPanelUpdateArgs,
} from '../product-panel-dto/product-panel.dto';
import { ProductPanelService } from '../product-panel-services/product-panel.service';

@Resolver(() => ProductPanelDto)
@UseGuards(AuthGuard)
export class ProductPanelResolver {
	constructor(private readonly productPanelService: ProductPanelService) {}

	@Query(() => ProductPanelPaginatedDto, { name: 'panelProducts' })
	getProducts(
		@Args({
			name: 'args',
			type: () => ProductPanelArgs,
		})
		args: ProductPanelArgs,
	): Promise<ProductPanelPaginatedDto> {
		return this.productPanelService.getProducts(args);
	}

	@Query(() => ProductPanelDto, { name: 'panelProduct', nullable: true })
	getProduct(
		@Args({
			name: 'productId',
			type: () => Int,
		})
		productId: number,
	): Promise<Nullable<ProductPanelDto>> {
		return this.productPanelService.getProduct(productId);
	}

	@Throttle({ default: { limit: 1, ttl: 5 } })
	@Query(() => ProductPanelSteamInfoDto, { name: 'panelProductSteamPackageInfo' })
	getPackagePrices(
		@Args({
			name: 'packageId',
			type: () => Int,
		})
		packageId: number,
	): Promise<ProductPanelSteamInfoDto> {
		return this.productPanelService.getPackagePrices(packageId);
	}

	@Throttle({ default: { limit: 1, ttl: 5 } })
	@Query(() => ProductPanelSteamInfoDto, { name: 'panelProductSteamBundleInfo' })
	getBundlePrices(
		@Args({
			name: 'bundleId',
			type: () => Int,
		})
		bundleId: number,
	): Promise<ProductPanelSteamInfoDto> {
		return this.productPanelService.getBundlePrices(bundleId);
	}

	@Mutation(() => OKDto, { name: 'panelProductForceUpdatePrices' })
	@Throttle({ default: { limit: 1, ttl: 5 * 60 }, long: { limit: 5, ttl: 60 * 60 } })
	forceUpdatePrices(): Promise<OKDto> {
		return this.productPanelService.updatePrices();
	}

	@Mutation(() => ProductPanelDto, { name: 'panelProductCreate' })
	createProduct(
		@Args({
			name: 'args',
			type: () => ProductPanelCreateArgs,
		})
		args: ProductPanelCreateArgs,
	): Promise<ProductPanelDto> {
		return this.productPanelService.createProduct(args);
	}

	@Mutation(() => ProductPanelDto, { name: 'panelProductUpdate' })
	updateProduct(
		@Args({
			name: 'productId',
			type: () => Int,
		})
		productId: number,
		@Args({
			name: 'args',
			type: () => ProductPanelUpdateArgs,
		})
		args: ProductPanelUpdateArgs,
	): Promise<ProductPanelDto> {
		return this.productPanelService.updateProduct(productId, args);
	}

	@Mutation(() => OKDto, { name: 'panelProductDelete' })
	deleteProduct(
		@Args({
			name: 'productId',
			type: () => Int,
		})
		productId: number,
	): Promise<OKDto> {
		return this.productPanelService.deleteProduct(productId);
	}

	@ResolveField(() => [ProductPanelRegionPriceDto], { name: Prisma.ProductScalarFieldEnum.prices })
	getPrices(@Parent() { prices }: ProductPanelDto): ProductPanelRegionPriceDto[] {
		return Object.keys(prices).map(
			(region) =>
				({
					region: RegionCodeEnum[region],
					price: prices[region] ?? 0,
				}) satisfies ProductPanelRegionPriceDto,
		);
	}
}
