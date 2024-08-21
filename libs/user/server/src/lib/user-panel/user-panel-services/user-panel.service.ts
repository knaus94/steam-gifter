import { OKDto } from '@libs/core/server';
import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

@Injectable()
export class UserPanelService {
	constructor(private readonly sdkPrismaService: SdkPrismaService) {}

	async updatePassword(userId: number, password: string) {
		return this.sdkPrismaService.user
			.update({
				where: {
					id: userId,
				},
				data: {
					hashedPassword: await hash(password, 10),
				},
			})
			.then(() => new OKDto());
	}
}
