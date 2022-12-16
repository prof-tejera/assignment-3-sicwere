// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.
export function calcTotalSeconds(time, rounds = 1) {
	return parseInt(time) * parseInt(rounds)
}
