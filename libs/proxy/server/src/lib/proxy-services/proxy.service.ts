import { SdkPrismaService } from '@libs/sdk-prisma/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProxyService {
	constructor(private readonly sdkPrismaService: SdkPrismaService) {}
}
