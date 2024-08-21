import { OKDto } from '@libs/core/server';
import { CustomInjectorService } from '@libs/custom-injector/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { BotStatusEnum } from '@prisma/client';
import { RedisCache } from 'cache-manager-redis-yet';
import { catchError, concatMap, firstValueFrom, from, map, mergeMap, of, tap, throwError, toArray } from 'rxjs';
import { BotService } from '../../bot-services/bot.service';
import { BotLoginSelectedFields } from '../../bot-types/bot-login.types';

@Injectable()
export class BotPanelOperationService {
	constructor(
		private readonly sdkPrismaService: SdkPrismaService,
		private readonly botService: BotService,
		private readonly customInjectorService: CustomInjectorService,
	) {}

	private get redisCache() {
		return this.customInjectorService.getLastComponentByName<RedisCache>(CACHE_MANAGER)!;
	}

	private openOperation() {
		return of(null).pipe(
			mergeMap(() =>
				from(this.redisCache.get<boolean>(`panel:bots:operation_status`)).pipe(
					catchError(() => throwError(() => new Error(`Не удалось получить статус`))),
				),
			),
			mergeMap((result) => {
				if (result) {
					throwError(() => new Error(`Одна из операций уже запущен`));
				}

				return of(null);
			}),
			mergeMap(() => from(this.redisCache.set(`panel:bots:operation_status`, 1, 15 * 60 * 1000)).pipe(catchError(() => of(null)))),
		);
	}

	private closeOperation() {
		return firstValueFrom(
			from(this.redisCache.del(`panel:bots:operation_status`)).pipe(
				map(() => true),
				catchError(() => of(false)),
			),
		);
	}

	stopBot(botId: number) {
		return of(null).pipe(
			mergeMap(() => this.openOperation()),
			mergeMap(() =>
				from(
					this.sdkPrismaService.bot.findFirstOrThrow({
						where: {
							id: botId,
						},
						select: {
							id: true,
							status: true,
						},
					}),
				).pipe(catchError(() => throwError(() => new Error(`Бот не найден`)))),
			),
			mergeMap((bot) => {
				if (bot.status !== BotStatusEnum.RUNNING && bot.status !== BotStatusEnum.STARTING) {
					throwError(() => new Error('bot not running'));
				}

				return of(bot);
			}),
			mergeMap((bot) => from(this.botService.shutdownBot({ botId: bot.id, setStatus: true }))),
			map(() => new OKDto()),
		);
	}

	startBot(botId: number) {
		return of(null).pipe(
			mergeMap(() => this.openOperation()),
			mergeMap(() =>
				from(
					this.sdkPrismaService.bot.findFirstOrThrow({
						where: {
							id: botId,
						},
						select: {
							...BotLoginSelectedFields,
							status: true,
						},
					}),
				).pipe(catchError(() => throwError(() => new Error(`Бот не найден`)))),
			),
			mergeMap((bot) => {
				if (bot.status !== BotStatusEnum.ERROR && bot.status !== BotStatusEnum.STOPPED) {
					throwError(() => new Error(`Bot not stopped`));
				}

				return of(bot);
			}),
			tap((bot) => firstValueFrom(from(this.botService.logIn(bot)).pipe(tap(() => this.closeOperation())))),
			map(() => new OKDto()),
		);
	}

	restartBot(botId: number) {
		return of(null).pipe(
			mergeMap(() => this.openOperation()),
			mergeMap(() =>
				from(
					this.sdkPrismaService.bot.findFirstOrThrow({
						where: {
							id: botId,
						},
						select: {
							...BotLoginSelectedFields,
							status: true,
						},
					}),
				).pipe(catchError(() => throwError(() => new Error(`Бот не найден`)))),
			),
			tap((bot) =>
				firstValueFrom(
					from(
						this.botService.shutdownBot({
							botId: bot.id,
							setStatus: true,
						}),
					).pipe(
						mergeMap(() => from(this.botService.logIn(bot))),
						tap(() => this.closeOperation()),
					),
				),
			),
			map(() => new OKDto()),
		);
	}

	stopAllBots() {
		return of(null).pipe(
			mergeMap(() => this.openOperation()),
			mergeMap(() =>
				from(
					this.sdkPrismaService.bot.findMany({
						where: {
							status: {
								in: [BotStatusEnum.RUNNING, BotStatusEnum.STARTING],
							},
						},
						select: {
							id: true,
						},
					}),
				),
			),
			tap((ids) =>
				firstValueFrom(
					from(ids).pipe(
						concatMap(({ id }) =>
							from(
								this.botService.shutdownBot({
									botId: id,
									setStatus: true,
								}),
							),
						),
						toArray(),
						tap(() => this.closeOperation()),
					),
				),
			),
			map(() => new OKDto()),
		);
	}

	startAllBots() {
		return of(null).pipe(
			mergeMap(() => this.openOperation()),
			mergeMap(() =>
				from(
					this.sdkPrismaService.bot.findMany({
						where: {
							status: {
								in: [BotStatusEnum.STOPPED, BotStatusEnum.ERROR],
							},
						},
						select: {
							...BotLoginSelectedFields,
						},
					}),
				),
			),
			tap((bots) =>
				firstValueFrom(
					from(bots).pipe(
						concatMap((bot) => from(this.botService.logIn(bot))),
						toArray(),
						tap(() => this.closeOperation()),
					),
				),
			),
			map(() => new OKDto()),
		);
	}

	restartAllBots() {
		return of(null).pipe(
			mergeMap(() => this.openOperation()),
			mergeMap(() =>
				from(
					this.sdkPrismaService.bot.findMany({
						where: {
							status: {
								in: [BotStatusEnum.RUNNING, BotStatusEnum.STARTING],
							},
						},
						select: {
							...BotLoginSelectedFields,
						},
					}),
				),
			),
			tap((bots) =>
				firstValueFrom(
					from(bots).pipe(
						concatMap((bot) =>
							from(
								this.botService.shutdownBot({
									botId: bot.id,
									setStatus: true,
								}),
							).pipe(mergeMap(() => from(this.botService.logIn(bot)))),
						),
						toArray(),
						tap(() => this.closeOperation()),
					),
				),
			),
			map(() => new OKDto()),
		);
	}
}
