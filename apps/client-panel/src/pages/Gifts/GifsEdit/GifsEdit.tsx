import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	InputProductPanelArgs,
	ProductPanelSortEnumType,
	RegionCodeEnumType,
	SortEnumType,
	useGetGiftByIdQuery,
	usePanelDigisellerRegionsQuery,
	usePanelProductLazyQuery,
	usePanelProductsLazyQuery,
	usePanelProductsQuery,
	useParseDigisellerProductInfoLazyQuery,
	useUpdateGiftMutation,
} from '@generated/client-panel/graphql/types';
import { DeleteOutlined, LoadingOutlined, MinusCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, InputNumber, Radio, Select, Space, Switch, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { LangEnum, Nullable, tuple } from '@libs/core/common';
import type { ProductsData } from '../../Products/Products';
import './GifsEdit.scss';
import debounce from 'lodash.debounce';
import { GiftData } from '../types/giftData';
import { ApolloError } from '@apollo/client';
import moment from 'moment';
import { ParseEdition } from '../GiftsCreate/GiftsCreate';
import { valueType } from 'antd/es/statistic/utils';

const GifsEdit = () => {
	const [name, setName] = useState<Partial<Record<LangEnum, Nullable<string>>>>({});

	const [editionSelection, setEditionSelection] = useState(false);
	const [products, setProducts] = useState<ProductsData>([]);
	const [total, setTotal] = useState(0);
	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<number>();
	const [selectedRegion, setSelectedRegion] = useState<number[]>([]);
	const [selectedRegions, setSelectedRegions] = useState({});
	const [editions, setEditions] = useState<GiftData['editions']>([]);
	const [isInitialRender, setIsInitialRender] = useState(true);

	const [productAvatar, setProductAvatar] = useState<Nullable<string>>(null);
	const [syncPrice, setSyncPrice] = useState(false);
	const [syncPricePercent, setSyncPricePercent] = useState<Nullable<number>>(null);
	const [syncPriceRegion, setSyncPriceRegion] = useState<RegionCodeEnumType>(RegionCodeEnumType.Ru);
	const [digiId, setDigiId] = useState<Nullable<valueType>>(null);

	const [formData, setFormData] = useState<InputProductPanelArgs>({
		take: 10,
		skip: 0,
		name: null,
		sort: {
			field: ProductPanelSortEnumType.Id,
			type: SortEnumType.Desc,
		},
	});

	const [messageApi, contextHolder] = message.useMessage();
	const { Option } = Select;
	const { id } = useParams();
	const { t, i18n } = useTranslation();
	const [form] = useForm();
	const navigate = useNavigate();

	const { data, loading } = useGetGiftByIdQuery({
		variables: { digisellerProductId: +id! },
		fetchPolicy: 'no-cache',
	});
	const [getPanelProducts, { data: productsData }] = usePanelProductsLazyQuery();

	const { data: regions } = usePanelDigisellerRegionsQuery({ fetchPolicy: 'no-cache' });
	const [parseInfo, { loading: parseLoading }] = useParseDigisellerProductInfoLazyQuery();
	const [getProductById, { data: productById }] = usePanelProductLazyQuery();
	const [updateGift] = useUpdateGiftMutation();
	useEffect(() => {
		if (!isInitialRender) {
			(async () => {
				const { data } = await getPanelProducts({
					variables: {
						args: formData,
					},
					fetchPolicy: 'no-cache',
				});
				if (data) {
					setProducts((prev) => [...prev, ...data.panelProducts.records]);
					setTotal(data.panelProducts.total);
				}
			})();
		} else {
			setIsInitialRender(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);
	const getProduct = async () => {
		if (products.length > 0) return;
		const { data } = await getPanelProducts({
			variables: {
				args: formData,
			},
			fetchPolicy: 'no-cache',
		});

		if (data) {
			setProducts(data.panelProducts.records);
			setTotal(data.panelProducts.total);
		}
	};
	const handleInputChange = (lang: LangEnum, value: string) => {
		setName((prev) => ({
			...prev,
			[lang]: value.trim() === '' ? null : value,
		}));
	};
	const createdTime = moment(data?.panelDigisellerProduct?.createdAt)
		.locale(i18n.language)
		.format('HH:mm:ss ll');
	const updatedTime = moment(data?.panelDigisellerProduct?.updatedAt)
		.locale(i18n.language)
		.format('HH:mm:ss ll');

	useEffect(() => {
		if (!data || !data?.panelDigisellerProduct) return;

		const { panelDigisellerProduct } = data;
		if (panelDigisellerProduct.editionSelection) {
			setEditionSelection(panelDigisellerProduct.editionSelection);
		}
		if (panelDigisellerProduct.name) {
			setName(panelDigisellerProduct.name);
		}
		setDigiId(panelDigisellerProduct.digisellerId);
		setSyncPricePercent(panelDigisellerProduct.syncPricePercent);
		setSyncPriceRegion(panelDigisellerProduct.syncPriceRegion);
		setSyncPrice(panelDigisellerProduct.syncPrice);
		setProductAvatar(panelDigisellerProduct.previewUrl ?? null);
		if (!panelDigisellerProduct.editionSelection) {
			if (panelDigisellerProduct.editions.length < 1) return;
			const initialValue = panelDigisellerProduct.editions[0].bots.map((el) => {
				setSelectedRegion((prev) => {
					const arr = prev.slice();
					arr.push(el.region.id);
					return arr;
				});

				return {
					regionId: el.region.id,
					botRegions: el.botRegions,
				};
			});

			form.setFieldsValue({ bots: initialValue });
		}

		if (panelDigisellerProduct?.editionSelection) {
			const getInfo = async (id: number) => {
				const { data } = await getProductById({ variables: { productId: id } });
				return data;
			};
			const initialValue = panelDigisellerProduct.editions.map((el, index) => {
				const product = productsData?.panelProducts.records.filter((item) => item.id === el.product.id);

				const id = product?.length ? product[0].id : el.product.name;
				if (typeof id === 'string') {
					getInfo(el.product.id);
				}
				return {
					name: el.name,
					productId: id,
					isDefault: el.isDefault,
					bots: el.bots.map((bot) => ({
						regionId: bot.region.id,
						botRegions: bot.botRegions,
					})),
				};
			});
			form.setFieldsValue({ editions: initialValue });
			const initialSelectedRegions = {};
			initialValue.forEach((edition, index) => {
				initialSelectedRegions[index] = {};
				edition.bots.forEach((bot, botIndex) => {
					initialSelectedRegions[index][botIndex] = bot.regionId;
				});
			});

			setSelectedRegions(initialSelectedRegions);
			if (panelDigisellerProduct.editions) {
				setSelectedProducts((prev) => {
					let arr = prev.slice();
					arr = panelDigisellerProduct.editions.map((el) => el.product.id!);
					return arr;
				});
			}
		} else {
			const getInfo = async (id: number) => {
				const { data } = await getProductById({ variables: { productId: id } });
				return data;
			};

			panelDigisellerProduct.editions.map((el, index) => {
				const product = productsData?.panelProducts.records.filter((item) => item.id === el.product.id);

				const id = product?.length ? product[0].id : el.product.name;
				if (typeof id === 'string') {
					getInfo(el.product.id);
				}

				form.setFieldValue('productId', id);
			});

			setSelectedProduct(panelDigisellerProduct.editions[0].product.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const debouncedFunction = debounce((e: string) => {
		setProducts([]);
		setFormData((prev) => ({ ...prev, take: 10, skip: 0, name: e }));
	}, 350);

	const handleAddBot = (item: number, index: number) => {
		setSelectedRegion((prevSelectedItems) => {
			const updatedItems = prevSelectedItems.slice();
			updatedItems[index] = item;
			return updatedItems;
		});
	};

	const handleDeleteRegion = (name: number) => {
		if (name >= 0 && name < selectedRegion.length) {
			const updatedRegion = [...selectedRegion];
			updatedRegion.splice(name, 1);
			setSelectedRegion(updatedRegion);
		}
	};

	const handleDeleteRegions = (nameEdition: number, nameBot: number) => {
		setSelectedRegions((prevSelectedRegions) => {
			const updatedSelectedRegions = { ...prevSelectedRegions };
			if (updatedSelectedRegions[nameEdition] && updatedSelectedRegions[nameEdition][nameBot]) {
				delete updatedSelectedRegions[nameEdition][nameBot];
			}
			return updatedSelectedRegions;
		});
	};

	const handleAddProduct = (id: number, index: number) => {
		setSelectedProducts((prevSelectedProducts) => {
			const updatedItems = prevSelectedProducts.slice();
			updatedItems[index] = id;
			return updatedItems;
		});
	};

	const handleRegionChange = (value: number, nameEdition: number, nameBot: number) => {
		setSelectedRegions((prevSelectedRegions) => ({
			...prevSelectedRegions,
			[nameEdition]: {
				...prevSelectedRegions[nameEdition],
				[nameBot]: value,
			},
		}));
	};

	const handleRemoveProduct = (index: number) => {
		setSelectedProducts((prevSelectedProducts) => {
			const updatedItems = prevSelectedProducts.slice();
			updatedItems.splice(index, 1);
			return updatedItems;
		});
	};

	const handleFinish = async (_data: GiftData) => {
		let commonArgs = {
			digisellerId: _data.digisellerId,
			name: name,
			editionSelection,
			isDisabled: _data.isDisabled,
			editions,
			previewUrl: productAvatar,
			syncPrice,
			syncPricePercent: syncPricePercent ?? 100,
			syncPriceRegion,
		};

		if (editionSelection && _data.editions) {
			setEditions(_data.editions);

			const formattedEditions = _data.editions.map((edition, index) => {
				const idProduct =
					typeof edition.productId === 'string' ? data?.panelDigisellerProduct?.editions[index].product.id : edition.productId;

				return {
					productId: idProduct!,
					name: edition.name,
					isDefault: edition.isDefault,
					bots: edition.bots.map((bot) => ({
						regionId: bot.regionId,
						botRegions: bot.botRegions,
					})),
				};
			});
			commonArgs = {
				...commonArgs,
				editions: formattedEditions,
			};
		} else if (_data.bots) {
			if (!_data.productId) {
				return messageApi.open({
					type: 'error',
					content: t('gifts.create.error_game'),
				});
			}
			const idProduct = typeof _data.productId === 'string' ? data?.panelDigisellerProduct?.editions[0].product.id : _data.productId;
			const formattedEditions = [
				{
					name: null,
					productId: idProduct!,
					bots: _data.bots,
					isDefault: true,
				},
			];
			commonArgs = {
				...commonArgs,
				editions: formattedEditions,
			};
		}

		const botIsEmpty = commonArgs.editions.some((el) => !el.bots.length);

		if (botIsEmpty) {
			return messageApi.open({
				type: 'error',
				content: t('gifts.create.error'),
			});
		}
		const isSetDefault = commonArgs.editions.some((el) => el.isDefault);

		if (!isSetDefault) {
			return messageApi.open({
				type: 'error',
				content: t('gifts.create.error_default'),
			});
		}
		try {
			await updateGift({ variables: { args: commonArgs, digisellerProductUpdateId: +id! }, fetchPolicy: 'no-cache' });
			navigate('/gifts');
		} catch (error) {
			if (error instanceof ApolloError) {
				return messageApi.open({
					type: 'error',
					content: error.message,
				});
			}
		}
	};

	const parseDigiInfo = async () => {
		if (!digiId) return;

		const [res, resError] = await tuple(
			parseInfo({ variables: { digisellerId: +digiId }, fetchPolicy: 'network-only', errorPolicy: 'none' }),
		);
		const err = resError ?? res.error;
		if (err) {
			return messageApi.open({
				type: 'error',
				content: err.message,
			});
		}

		const data = res.data;
		if (data) {
			setProductAvatar(data.panelDigisellerParseProductInfo.preview ?? null);
			setEditionSelection(data.panelDigisellerParseProductInfo.editionEnabled);
			form.setFieldValue('editionSelection', data.panelDigisellerParseProductInfo.editionEnabled);
			Object.values(LangEnum).forEach((el) => {
				handleInputChange(el, data.panelDigisellerParseProductInfo.name);
				form.setFieldValue(`name${el}`, data.panelDigisellerParseProductInfo.name);
			});
			const {
				editions,
			}: {
				editions: ParseEdition;
			} = form.getFieldsValue();

			if (data.panelDigisellerParseProductInfo.editionEnabled) {
				const arr = editions ? editions : [];
				const filteredEditions = arr.filter((el) => data.panelDigisellerParseProductInfo.editions.includes(el.name ?? ''));

				const newEdition = data.panelDigisellerParseProductInfo.editions.filter(
					(name) => !filteredEditions.some((el) => el.name === name),
				);
				const result = filteredEditions.concat(newEdition.map((name) => ({ name, bots: [{ regionId: null }] })));
				const withoutDublicate = result.reduce((uniq, item) => {
					if (!uniq.some((el) => el.name === item.name)) {
						uniq.push(item);
					}

					return uniq;
				}, [] as ParseEdition);

				// update selecte Games
				const actualSelectedGames = withoutDublicate
					.map((el) => el.productId)
					.filter((productId): productId is number => typeof productId === 'number');

				setSelectedProducts(actualSelectedGames);

				// update selecte region in bots

				const actualBotRegions = {};

				withoutDublicate.forEach((item, index) => {
					const filteredBots = item.bots.filter((bot) => bot.regionId !== null).map((bot) => bot.regionId);

					if (filteredBots.length > 0) {
						actualBotRegions[index] = {};
						filteredBots.forEach((value, i) => {
							actualBotRegions[index][i] = value;
						});
					}
				});

				setSelectedRegions(actualBotRegions);

				form.setFieldValue('editions', withoutDublicate);
			}
		}
	};

	const handleSetAsDefaultChange = (index: number) => {
		const editions = form.getFieldValue('editions').map((edition, editionIndex) => {
			if (editionIndex === index) {
				edition.isDefault = true;
			} else {
				edition.isDefault = false;
			}
			return edition;
		});
		form.setFieldsValue({ editions });
	};

	const removeObjectByKey = (index: number) => {
		const newObj = { ...selectedRegions };
		const keys = Object.keys(newObj);
		delete newObj[keys[index]];

		setSelectedRegions(newObj);
	};

	return loading ? (
		<LoadingOutlined />
	) : (
		<section className="gift-edit">
			{contextHolder}
			<div className="gift-edit__info">
				<h1 className="gift-edit__title">{t('gifts.title')}</h1>
				<div className="gift-edit__created">
					<span className="gift-edit__created-title">{t('gifts.table.created')}</span>
					<span className="gift-edit__created-time">{createdTime}</span>
				</div>
				<div className="gift-edit__updated">
					<span className="gift-edit__updated-title">{t('gifts.last_update')}</span>
					<span className="gift-edit__updated-time">{updatedTime}</span>
				</div>
			</div>
			<Form form={form} onFinish={handleFinish} layout="vertical" autoComplete="off" className="gifts-form  form-proxy">
				<div className="gifts__disable-wrap">
					<Form.Item
						label={t('gifts.create.digiseller_id')}
						name="digisellerId"
						className="form-proxy__item gifts__disable-wrap-input"
						rules={[{ required: true, message: t('error_validation') }]}
						initialValue={data?.panelDigisellerProduct?.digisellerId}
					>
						<InputNumber controls={false} onChange={(e) => setDigiId(e)} />
					</Form.Item>
					<Form.Item
						name="isDisabled"
						label={t('gifts.create.disabled')}
						valuePropName="checked"
						initialValue={data?.panelDigisellerProduct?.isDisabled}
					>
						<Switch />
					</Form.Item>
					<Button
						className="parse-btn"
						type="primary"
						onClick={() => parseDigiInfo()}
						disabled={digiId ? false : true}
						loading={parseLoading}
					>
						{t('bots.create.parce')}
					</Button>
				</div>
				<Form.Item name="name" label={t('gifts.create.name')}>
					<div>
						{Object.values(LangEnum).map((el) => {
							return (
								<Form.Item key={`editionSelectionFieldName${el}`} className="gifts__name">
									<Input
										addonBefore={el}
										value={name[el] ?? ''}
										onChange={(e) => handleInputChange(el, e.target.value)}
										required
									/>
								</Form.Item>
							);
						})}
					</div>
				</Form.Item>

				<div className="gifts__create-avatarwrap">
					<Form.Item
						label={t('gifts.create.avatar')}
						className="form-bots__item"
						rules={[{ required: true, message: t('error_validation') }]}
					>
						{productAvatar ? (
							<img className="form-bots__img" src={productAvatar} alt="" />
						) : (
							<div className="form-bots__default-img"></div>
						)}
					</Form.Item>
					<div className="gifts__create__syncPrice-wrap">
						<Form.Item
							name="syncPrice"
							label={t('gifts.create.sync_price')}
							valuePropName="checked"
							initialValue={data?.panelDigisellerProduct?.syncPrice}
						>
							<Checkbox
								onChange={(e) => {
									setSyncPrice(e.target.checked);
								}}
							>
								{t('gifts.create.sync')}
							</Checkbox>
						</Form.Item>
						<div className="gifts__create__syncPrice-data">
							<span className="gifts__create__syncPrice-data_before">{t('gifts.create.set_price')}</span>
							<InputNumber
								min={0}
								max={999}
								defaultValue={data?.panelDigisellerProduct?.syncPricePercent}
								suffix="%"
								onChange={(e) => setSyncPricePercent(e)}
								value={syncPricePercent}
							/>
							<span className="gifts__create__syncPrice-data_after">{t('gifts.create.set_price_steam')}</span>

							<Select onChange={setSyncPriceRegion} defaultValue={data?.panelDigisellerProduct?.syncPriceRegion}>
								{Object.values(RegionCodeEnumType).map((el) => {
									return (
										<Option key={el} value={el}>
											{el}
										</Option>
									);
								})}
							</Select>
						</div>
					</div>
				</div>
				<div className="gifts__create-form_checkbox-wrap">
					<Form.Item
						name="editionSelection"
						label={t('gifts.create.editions')}
						valuePropName="checked"
						initialValue={data?.panelDigisellerProduct?.editionSelection}
					>
						<Checkbox
							onChange={(e) => {
								setEditionSelection(e.target.checked);
							}}
						/>
					</Form.Item>
				</div>
				{editionSelection ? (
					<Form.List name={['editions']} initialValue={[{}]}>
						{(fieldsEditions, { add: addEdition, remove: removeEdition }) => (
							<div>
								{fieldsEditions.map(({ key: keyEdition, name: nameEdition, fieldKey: fieldKeyEdition, ...restFieldEdition }) => (
									<div key={keyEdition} className="gifts__edition-wrap">
										<div className="gifts-form__main-wrap">
											<Form.Item {...restFieldEdition} name={[nameEdition, 'isDefault']} valuePropName="checked">
												<Radio onChange={() => handleSetAsDefaultChange(nameEdition)}>Set as default</Radio>
											</Form.Item>
											<Form.Item
												{...restFieldEdition}
												name={[nameEdition, 'name']}
												className="gifts__create-form_name"
												rules={[{ required: true, message: t('error_validation') }]}
											>
												<Input placeholder={t('gifts.create.name_placeholder')} />
											</Form.Item>
											<Form.Item
												{...restFieldEdition}
												name={[nameEdition, 'productId']}
												className="gifts__create-form_product"
												rules={[{ required: true, message: t('error_validation') }]}
											>
												<Select
													onClick={() => getProduct()}
													showSearch
													filterOption={false}
													onChange={(e) => {
														handleAddProduct(e, nameEdition);
													}}
													onSearch={(e) => debouncedFunction(e)}
													placeholder={t('gifts.create.game_placeholder')}
													onPopupScroll={(e) => {
														e.persist();
														const target = e.target as HTMLElement;
														if (formData.take > total) return;
														if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
															setFormData((prev) => ({ ...prev, skip: prev.skip + 10 }));
														}
													}}
												>
													{products.map((el) => {
														const isSelected = selectedProducts.includes(el.id);
														return (
															<Option key={el.id} value={el.id} disabled={isSelected}>
																{el.name}
															</Option>
														);
													})}
												</Select>
											</Form.Item>
											<div className="gifts-form__regions-wrap">
												<Form.List name={[nameEdition, 'bots']} initialValue={['']}>
													{(fieldsBots, { add: addBot, remove: removeBot }) => (
														<>
															{fieldsBots.map(
																({ key: keyBot, name: nameBot, fieldKey: fieldKeyBot, ...restFieldBot }) => (
																	<Space
																		key={keyBot}
																		style={{ display: 'flex', marginBottom: 8 }}
																		align="baseline"
																	>
																		<Form.Item
																			{...restFieldBot}
																			name={[nameBot, 'regionId']}
																			rules={[{ required: true, message: '' }]}
																			className="gifts__create-form_region"
																		>
																			<Select
																				onChange={(value: number) =>
																					handleRegionChange(value, nameEdition, nameBot)
																				}
																			>
																				{regions?.panelDigisellerRegions.map((region) => {
																					return (
																						<Option
																							key={`regionBot${region.id}`}
																							value={region.id}
																							disabled={
																								selectedRegions[nameEdition] &&
																								Object.values(
																									selectedRegions[nameEdition],
																								).includes(region.id) &&
																								selectedRegions[nameEdition][nameBot] !== region
																							}
																						>
																							{region.name}
																						</Option>
																					);
																				})}
																			</Select>
																		</Form.Item>
																		<Form.Item
																			{...restFieldBot}
																			name={[nameBot, 'botRegions']}
																			className="gifts__create-form_regions"
																			rules={[{ required: true, message: t('error_validation') }]}
																		>
																			<Select
																				mode="multiple"
																				style={{ width: '100%' }}
																				placeholder={t('gifts.create.regions_placeholder')}
																			>
																				{Object.values(RegionCodeEnumType).map((region) => {
																					const product = products.filter(
																						(el) => el.id === selectedProducts[nameEdition],
																					);
																					const isCanSelect =
																						product.length > 0 &&
																						!product[0].prices.some((el) => el.region === region);
																					return (
																						<Option
																							key={region}
																							value={region}
																							className={!isCanSelect ? 'canSelect' : 'noSelect'}
																						>
																							{region}
																						</Option>
																					);
																				})}
																			</Select>
																		</Form.Item>
																		<MinusCircleOutlined
																			onClick={() => {
																				handleDeleteRegions(nameEdition, nameBot);
																				removeBot(nameBot);
																			}}
																		/>
																	</Space>
																),
															)}
															<Form.Item>
																<Button
																	type="dashed"
																	onClick={() => {
																		addBot();
																	}}
																	icon={<PlusOutlined />}
																>
																	{t('gifts.create.add_region')}
																</Button>
															</Form.Item>
														</>
													)}
												</Form.List>
											</div>
										</div>
										<Button
											type="dashed"
											onClick={() => {
												removeObjectByKey(nameEdition);
												handleRemoveProduct(nameEdition);
												removeEdition(nameEdition);
											}}
										>
											{t('gifts.create.delete_edition')}
										</Button>
									</div>
								))}
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => {
											addEdition();
										}}
										icon={<PlusOutlined />}
									>
										{t('gifts.create.add_edition')}
									</Button>
								</Form.Item>
							</div>
						)}
					</Form.List>
				) : (
					<div className="gifts__one-region">
						<Form.Item
							name={'productId'}
							className="gifts__create-form_product"
							rules={[{ required: true, message: t('error_validation') }]}
						>
							<Select
								onClick={() => getProduct()}
								showSearch
								filterOption={false}
								onSearch={(e) => debouncedFunction(e)}
								placeholder={t('gifts.create.game_placeholder')}
								onChange={(value) => {
									setSelectedProduct(value);
								}}
								onPopupScroll={(e) => {
									e.persist();
									const target = e.target as HTMLElement;
									if (formData.take > total) return;
									if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
										setFormData((prev) => ({ ...prev, skip: prev.skip + 10 }));
									}
								}}
							>
								{products.map((el) => {
									return (
										<Option key={el.id} value={el.id}>
											{el.name}
										</Option>
									);
								})}
							</Select>
						</Form.Item>

						<div className="gifts-form__regions-wrap">
							<Form.List name={'bots'} initialValue={['']}>
								{(fieldsBots, { add: addBot, remove: removeBot }) => (
									<>
										{fieldsBots.map(({ key: keyBot, name: nameBot, fieldKey: fieldKeyBot, ...restFieldBot }, index) => (
											<Space key={keyBot} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
												<Form.Item
													{...restFieldBot}
													name={[nameBot, 'regionId']}
													rules={[{ required: true, message: '' }]}
													className="gifts__create-form_region"
												>
													<Select
														onChange={(value) => {
															handleAddBot(value, index);
														}}
													>
														{regions?.panelDigisellerRegions.map((region) => {
															const isSelected = selectedRegion?.includes(region.id);
															return (
																<Option
																	key={`regionId${region.id}`}
																	value={region.id}
																	disabled={isSelected ? true : false}
																>
																	{region.name}
																</Option>
															);
														})}
													</Select>
												</Form.Item>
												<Form.Item
													{...restFieldBot}
													name={[nameBot, 'botRegions']}
													className="gifts__create-form_regions"
													rules={[{ required: true, message: t('error_validation') }]}
												>
													<Select
														mode="multiple"
														style={{ width: '100%' }}
														placeholder={t('gifts.create.regions_placeholder')}
													>
														{Object.values(RegionCodeEnumType).map((region) => {
															const product = products.filter((el) => el.id === selectedProduct);
															const isCanSelect =
																product.length > 0 && !product[0].prices.some((el) => el.region === region);
															return (
																<Option
																	key={region}
																	value={region}
																	className={!isCanSelect ? 'canSelect' : 'noSelect'}
																>
																	{region}
																</Option>
															);
														})}
													</Select>
												</Form.Item>
												<MinusCircleOutlined
													onClick={() => {
														removeBot(nameBot);
														handleDeleteRegion(index);
													}}
												/>
											</Space>
										))}
										<Form.Item>
											<Button
												type="dashed"
												onClick={() => {
													addBot();
												}}
												icon={<PlusOutlined />}
											>
												{t('gifts.create.add_region')}
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>
						</div>
					</div>
				)}
				<div className="gifts-form__btns">
					<Button style={{ marginRight: '15px' }} onClick={() => navigate('/gifts')}>
						{t('buttons.back')}
					</Button>
					<Button type="primary" htmlType="submit">
						{t('buttons.save')}
					</Button>
				</div>
			</Form>
		</section>
	);
};

export default GifsEdit;
