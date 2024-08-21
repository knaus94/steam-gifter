import React, { useEffect, useState } from 'react';

import './Products.scss';
import {
	InputProductPanelArgs,
	PanelProductsQuery,
	ProductPanelSortEnumType,
	SortEnumType,
	usePanelProductsLazyQuery,
} from '@generated/client-panel/graphql/types';
import ProductsHeader from './ProductsHeader/ProductsHeader';
import ProductsTable from './ProductsTable/ProductsTable';

export type ProductsData = PanelProductsQuery['panelProducts']['records'];

const Products = () => {
	const [data, setData] = useState<ProductsData>([]);
	const [total, setTotal] = useState(0);

	const [formData, setFormData] = useState<InputProductPanelArgs>({
		take: 10,
		skip: 0,
		name: null,
		sort: {
			field: ProductPanelSortEnumType.Id,
			type: SortEnumType.Desc,
		},
	});

	const [getProducts] = usePanelProductsLazyQuery();

	useEffect(() => {
		(async () => {
			const { data } = await getProducts({
				variables: {
					args: formData,
				},
				fetchPolicy: 'no-cache',
			});
			if (data) {
				setData(data.panelProducts.records);
				setTotal(data.panelProducts.total);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	return (
		<div className="products">
			<ProductsHeader setData={setData} />
			<ProductsTable data={data} setData={setData} total={total} setFormData={setFormData} />
		</div>
	);
};

export default Products;
