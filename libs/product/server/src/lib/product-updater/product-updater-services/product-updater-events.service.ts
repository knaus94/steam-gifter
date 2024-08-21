import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs';
import { ProductsPriceUpdatedEventInterface } from '../product-updater-interfaces/product-price-updated.interface';

@Injectable()
export class ProductUpdaterEventsService {
	private ProductsPriceUpdated$ = new ReplaySubject<ProductsPriceUpdatedEventInterface>();

	public static ProductsPriceUpdatedStream = 'ProductsPriceUpdatedStream';

	public sendToProductsPriceUpdatedStream(event: ProductsPriceUpdatedEventInterface) {
		this.ProductsPriceUpdated$.next(event);
	}

	public listenProductsPriceUpdatedStream() {
		return this.ProductsPriceUpdated$;
	}
}
