// Tool to generate apworldGeneration-formatted songs list from SDVX data
// Data sourced from https://sdvxindex.com/
import fs from 'fs';

// Import file and make new temp folder
const file = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));

const VERSIONS = {
	1: "BOOTH",
	2: "Infinite Infection",
	3: "Gravity Wars",
	4: "Heavenly Haven",
	5: "Vivid Wave",
	6: "Exceed Gear",
	7: "Nabla"
}

let songs = [];
file.forEach((song) => {
	let sheets = [];
	song.difficulties.forEach((difficulty) => {
		sheets.push({
			difficulty: difficulty.level,
			version: VERSIONS[song.version],
		});
	});

	songs.push({
		title: song.title,
		sheets: sheets,
		exclusivities: [],
		categories: song.genres
	});

	console.log(`Added ${song.title} (${song.difficulties.length} sheets)`);
});

fs.writeFileSync('output.json', JSON.stringify(songs, null, 4));