import { PrismaClient, RegionCodeEnum } from '@prisma/client';
import { parseArgs } from 'node:util';

const prisma = new PrismaClient();

async function main() {
	const {
		values: { environment },
	} = parseArgs({
		options: {
			environment: {
				type: 'string',
			},
		},
	});

	if (!environment) {
		throw new Error('environment is undefined');
	}
}

main()
	.then(async () => {
		await prisma.config.create({
			data: {
				telegramLogin: 'knaus94',
			},
		});

		await prisma.telegramConfig.create({
			data: {
				botToken: null,
				balanceChatId: null,
				statusChangeChatId: null,
				statusChangeNotification: false,
				balanceNotification: false,
			},
		});

		const { id: userId } = await prisma.user.create({
			data: {
				email: 'admin@admin.com',
				// password: admin
				hashedPassword: '$2b$10$1oiYby6UaqZk5fJBWbqC3uDMQTHsETNWI3h0hUCrA4eSTx9NYXlGu',
			},
		});

		const digisellerConfig = await prisma.digisellerConfig.create({
			data: {
				profileLinkFieldName: {
					ru: 'Ссылка на профиль',
					en: 'Steam profile link',
				},
				regionFieldName: {
					ru: 'Регион',
					en: 'Region',
				},
				editionSelectionFieldName: {
					ru: 'Издание',
					en: 'Edition',
				},
				regions: {
					createMany: {
						data: [
							{
								name: 'Россия|Russia',
							},
							{
								name: 'Украина|Ukraine',
							},
						],
					},
				},
			},
		});

		const { id: productId } = await prisma.product.create({
			data: {
				isBundle: false,
				name: 'For The King',
				identifier: 126353,
				prices: {
					[RegionCodeEnum.UA]: 0,
					[RegionCodeEnum.RU]: 0,
				},
			},
		});

		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
