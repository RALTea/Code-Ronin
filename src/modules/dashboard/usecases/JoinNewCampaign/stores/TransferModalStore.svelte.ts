class _TransferModalStore {
	private _isOpen = $state(false);
	private _message = $state('');

	get isOpen() {
		return this._isOpen;
	}

	get message() {
		return this._message;
	}

	open(message: string) {
		this._isOpen = true;
		this._message = message;
	}

	close() {
		this._isOpen = false;
		this._message = '';
	}
}

export const TransferModalStore = new _TransferModalStore();