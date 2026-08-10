function getGroups(songs) {
	let text = '';

	let versions = [...new Set(songs.flatMap(song => song.sheets.map(sheet => sheet.version)))];
	let categories = [...new Set(songs.flatMap(song => song.categories))];
	let exclusivities = [...new Set(songs.flatMap(song => song.exclusivities))];

	versions.forEach(version => {
		text += `\n\t"${version}": {name for name, data in SONG_DATA.items() if any(sheet.version == "${version}" for sheet in data.sheets)},`;
	});
	categories.forEach(category => {
		text += `\n\t"${category}": {name for name, data in SONG_DATA.items() if "${category}" in data.categories},`;
	});
	exclusivities.forEach(exclusivity => {
		text += `\n\t"${exclusivity}": {name for name, data in SONG_DATA.items() if "${exclusivity}" in data.exclusivities},`;
	});

	return text;
}


function getSheets(song, difficulties) {
	let text = '';

	for (let i = 0; i < difficulties.length; i++) {
		if (song.sheets[i] === undefined) {
			text += `DifficultyData(None, None), `;
		} else {
			text += `DifficultyData(${song.sheets[i].difficulty}, "${song.sheets[i].version}"), `;
		}
	}
	text = text.slice(0, -2);
	return text;
}


export const songdatapy = (songs, difficulties) => {
	return `
from typing import Dict
from .items import DifficultyData, SongData

SONG_DATA: Dict[str, SongData] = {
	${songs.map((song, index) => {return `"${song.title.replaceAll('"', "'")}": SongData(${index + 10}, "${song.title.replaceAll('"', "'")}", [${getSheets(song, difficulties)}], ["${song.categories.map((c) => c).join('", "')}"], ["${song.exclusivities.map((e) => e).join('", "')}"]),`}).join("\n\t")}
}

groups = {${getGroups(songs)}
}
	`;
};