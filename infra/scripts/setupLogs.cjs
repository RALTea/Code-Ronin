// setupLogs.cjs - required with node -r before vitest loads
const globalLogs = [];

// patch console methods
const origLog = console.log.bind(console);
console.log = (...args) => {
	try {
		globalLogs.push({ type: 'log', message: args.map(String).join(' ') });
	} catch {}
	origLog(...args);
};

const origError = console.error.bind(console);
console.error = (...args) => {
	try {
		globalLogs.push({ type: 'error', message: args.map(String).join(' ') });
	} catch {}
	origError(...args);
};

const origWarn = console.warn.bind(console);
console.warn = (...args) => {
	try {
		globalLogs.push({ type: 'warn', message: args.map(String).join(' ') });
	} catch {}
	origWarn(...args);
};

// expose so reporter can read it later
global.__GLOBAL_LOGS__ = globalLogs;

// optional debug so you know the preloader ran
// origLog('[setupLogs] preloaded')
