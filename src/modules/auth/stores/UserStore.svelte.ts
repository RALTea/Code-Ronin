import type { User } from '$auth/entities/User';

class _UserStore {
	private _user: User | null = $state(null);

	get user () {
		return this._user;
	}
	set user (user: User | null) {
		this._user = user;
	}
}
export const UserStore = new _UserStore();