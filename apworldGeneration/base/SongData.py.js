function getGroups(songs) {
	let text = '';

	let versions = [...new Set(songs.flatMap(song => song.sheets.map(sheet => sheet.version)))];
	let categories = [...new Set(songs.flatMap(song => song.categories))];

	versions.forEach(version => {
		text += `\n\t"${version}": {name for name, data in SONG_DATA.items() if any(sheet.version == "${version}" for sheet in data.sheets)},`;
	});
	categories.forEach(category => {
		text += `\n\t"${category}": {name for name, data in SONG_DATA.items() if "${category}" in data.categories},`;
	});

	return text;
}

export const songdatapy = (songs) => {
	return `
from typing import Dict
from .items import DifficultyData, SongData

SONG_DATA: Dict[str, SongData] = {
	${songs.map((song, index) => {return `"${song.title.replaceAll('"', "'")}": SongData(${index + 10}, "${song.title.replaceAll('"', "'")}", [${song.sheets.map((s) => `DifficultyData(${s.difficulty}, "${s.version}")`).join(", ")}], ["${song.categories.map((c) => c).join('", "')}"]),`}).join("\n\t")}
}

groups = {${getGroups(songs)}
}
	`;
};