import { requestHandlerFromCtx } from '@libs/core/server';
import { UserType } from '@libs/user/server';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserType = UserType;

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext): CurrentUserType => {
	const { req } = requestHandlerFromCtx(ctx);
	return req.user as CurrentUserType;
});
