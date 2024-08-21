import { CurrentUser, CurrentUserType } from '@libs/auth/server/lib/auth-decorators/current-user.decorator';
import { AuthGuard } from '@libs/auth/server/lib/auth-guards/auth.guard';
import { OKDto } from '@libs/core/server';
import { UserPanelDto, UserPanelUpdatePasswordArgs } from '@libs/user/server/lib/user-panel/user-panel-dto/user-panel.dto';
import { UserPanelService } from '@libs/user/server/lib/user-panel/user-panel-services/user-panel.service';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(AuthGuard)
export class UserPanelResolver {
	constructor(private readonly userPanelService: UserPanelService) {}

	@Query(() => UserPanelDto, { name: 'me' })
	me(@CurrentUser() currentUser: CurrentUserType): UserPanelDto {
		return currentUser;
	}

	@Mutation(() => OKDto, { name: 'panelUpdatePassword' })
	updatePassword(
		@CurrentUser() { id }: CurrentUserType,
		@Args({
			name: 'args',
			type: () => UserPanelUpdatePasswordArgs,
		})
		args: UserPanelUpdatePasswordArgs,
	): Promise<OKDto> {
		return this.userPanelService.updatePassword(id, args.password);
	}
}
