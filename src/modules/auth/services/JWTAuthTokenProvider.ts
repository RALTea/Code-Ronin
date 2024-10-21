import type { AuthTokenPayload } from '$auth/entities/JwtPayload';
import type { IAuthTokenProvider } from '$auth/interfaces/IAuthTokenProvider';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';

export const JWTAuthTokenProvider = (): IAuthTokenProvider => {
	const { JWT_SECRET } = env;
	return {
		generateToken: (payload: AuthTokenPayload) => {
			return jwt.sign(payload, JWT_SECRET ?? 'NoSecret', { expiresIn: '1d' });
		}
	};
};
