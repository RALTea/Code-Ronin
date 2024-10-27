import type { AuthTokenPayload } from '$auth/entities/JwtPayload';

export type IAuthTokenProvider = {
	generateToken: (payload: AuthTokenPayload) => string;
};
