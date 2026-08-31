// Tool to generate apworldGeneration-formatted songs list from WACCA data
// Data sourced from https://github.com/Stabyourself/mithical/blob/master/assets/wacca/waccaSongsPlus.js
import fs from 'fs';
import { waccaSongs } from './waccaSongsPlus.js';

const VERSIONS = {
	100: "WACCA",
	150: "WACCA S",
	200: "LILY",
	250: "LILY R",
	300: "REVERSE",
	400: "PLUS"
}

let songs = [];
waccaSongs.forEach((song) => {
	let sheets = [];
	song.sheets.forEach((sheet) => {
		sheets.push({
			difficulty: sheet.difficulty,
			version: VERSIONS[sheet.gameVersion],
		});
	});

	let exclusivities = [];
	if (song.dateRemoved > 0) {
		exclusivities.push("Online");
	}

	let fullTitle = song.titleEnglish ? `${song.title} | ${song.titleEnglish}` : song.title;
	fullTitle = fullTitle.replaceAll('\"', "'");

	songs.push({
		title: fullTitle,
		sheets: sheets,
		exclusivities: exclusivities,
		categories: [song.category]
	});

	console.log(`Added ${fullTitle} (${song.sheets.length} sheets)`);
});

fs.writeFileSync('output.json', JSON.stringify(songs, null, 4));