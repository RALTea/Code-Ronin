type _LastRun = {
	time: string | undefined;
	update: () => void;
}

let time: string | undefined = $state<string | undefined>(undefined);

export const LastRun: _LastRun = {
	get time() : string | undefined {
		return time;
	},
	update: function () {
		time = new Date().toLocaleString();
	}
}