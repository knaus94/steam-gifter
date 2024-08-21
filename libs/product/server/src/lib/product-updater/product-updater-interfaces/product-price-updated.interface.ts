import { Product } from '@prisma/client';

export interface ProductsPriceUpdatedEventInterface {
	products: Pick<Product, 'id' | 'isBundle' | 'name' | 'prices'>[];
}
