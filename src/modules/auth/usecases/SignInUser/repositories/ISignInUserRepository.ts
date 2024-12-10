import type { CreateUserDto } from '$auth/dtos/CreateUserDto';

export type ThridPartySignInService = () => Promise<void>;
export type CreateUserIfNotExists = (dto: CreateUserDto) => Promise<boolean>;