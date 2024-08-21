import { ConsoleLogger } from '@nestjs/common';

export class CoreLogger extends ConsoleLogger {
	public static excludeContexts: string[] = [];

	public static addExcludeContexts(excludeContext: string) {
		CoreLogger.excludeContexts.push(excludeContext);
	}

	/**
	 * Write a 'log' level log.
	 */
	log(message: any, ...optionalParams: any[]) {
		if (!CoreLogger.excludeContexts.includes(optionalParams[0])) {
			super.log(message, ...optionalParams);
		}
	}

	/**
	 * Write an 'error' level log.
	 */
	error(message: any, ...optionalParams: any[]) {
		if (
			!CoreLogger.excludeContexts.includes(optionalParams[1]) &&
			!CoreLogger.excludeContexts.find((ctx) => String(message).includes(ctx))
		) {
			super.error(message, ...optionalParams);
		}
	}

	/**
	 * Write a 'warn' level log.
	 */
	warn(message: any, ...optionalParams: any[]) {
		if (!CoreLogger.excludeContexts.includes(optionalParams[0])) {
			super.warn(message, ...optionalParams);
		}
	}

	/**
	 * Write a 'debug' level log.
	 */
	debug(message: any, ...optionalParams: any[]) {
		if (!CoreLogger.excludeContexts.includes(optionalParams[0])) {
			super.debug(message, ...optionalParams);
		}
	}

	/**
	 * Write a 'verbose' level log.
	 */
	verbose(message: any, ...optionalParams: any[]) {
		if (!CoreLogger.excludeContexts.includes(optionalParams[0])) {
			super.verbose(message, ...optionalParams);
		}
	}
}
