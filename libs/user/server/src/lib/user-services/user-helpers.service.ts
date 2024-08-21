import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';
import { UserSelectedFields } from '../user-types/user.types';

@Injectable()
export class UserHelpersService {
	constructor(private readonly sdkPrismaService: SdkPrismaService) {}

	async getUserByEmail(email: string) {
		return this.sdkPrismaService.user.findUnique({
			where: {
				email,
			},
			select: {
				...UserSelectedFields,
			},
		});
	}

	async getUserById(id: number) {
		return this.sdkPrismaService.user.findUnique({
			where: {
				id,
			},
			select: {
				...UserSelectedFields,
			},
		});
	}
}
