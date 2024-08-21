import { coreConfig } from '@libs/core/common';
import { All, Controller, HttpCode, Param, Render, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('digiseller')
export class DigisellerController {
	@All(':userId')
	@HttpCode(200)
	@Render('redirect')
	getRedirect(@Req() req: Request) {
		const redirectUrl = `${coreConfig.project.url}/?q=${req.query.uniquecode}`;
		return { redirectUrl };
	}

	@All()
	@HttpCode(200)
	@Render('redirect')
	getRedirectAll(@Req() req: Request) {
		const redirectUrl = `${coreConfig.project.url}/?q=${req.query.uniquecode}`;
		return { redirectUrl };
	}
}
