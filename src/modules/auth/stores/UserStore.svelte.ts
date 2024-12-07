import type { AuthTokenPayload } from '$auth/entities/JwtPayload';

class _UserStore {
	private _user: AuthTokenPayload | null = $state(null);

	get user () {
		return this._user;
	}
	set user (user: AuthTokenPayload | null) {
		this._user = user;
	}
}
export const UserStore = new _UserStore();
