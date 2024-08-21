import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const HideFieldMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
	return null;
};
