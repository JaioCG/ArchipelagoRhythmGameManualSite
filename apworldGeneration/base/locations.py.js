export const locationspy = (game) => {
	return `
from BaseClasses import Location

class rgLocation(Location):
	game: str = "${game}"
	`;
};