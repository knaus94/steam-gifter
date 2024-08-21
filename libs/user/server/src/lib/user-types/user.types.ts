import { Prisma } from '@prisma/client';

export const UserSelectedFields = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	email: true,
	hashedPassword: true,
});

export type UserType = Prisma.UserGetPayload<{
	select: typeof UserSelectedFields;
}>;
