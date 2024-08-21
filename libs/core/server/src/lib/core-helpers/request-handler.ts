import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export function requestHandlerFromCtx(context: ExecutionContext) {
	if (context.getType() === 'http') {
		const http = context.switchToHttp();
		return {
			req: http.getRequest(),
			res: http.getResponse(),
		};
	}

	const { req, res } = GqlExecutionContext.create(context).getContext();

	return { req, res };
}

export function requestHandlerFromHost(host: ArgumentsHost) {
	let req: any;
	let res: any;

	if (host.getType() === 'http') {
		req = host.switchToHttp().getRequest();
		res = host.switchToHttp().getResponse();
	} else if (host.getType<GqlContextType>() === 'graphql') {
		[, , req, res] = host.getArgs();
	}

	return {
		req: req?.req || req,
		res: res?.res || res,
	};
}
