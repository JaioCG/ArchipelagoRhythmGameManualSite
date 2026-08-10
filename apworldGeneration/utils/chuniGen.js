// Tool to generate apworldGeneration-formatted songs list from CHUNITHM data
// Data sourced from https://arcade-songs.zetaraku.dev/chunithm/
import fs from 'fs';

// Import file and make new temp folder
const file = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));

let songs = [];
file.songs.forEach((song) => {
	if (song.category != "WORLD'S END" && song.version != "Mate") {
		let sheets = [];
		song.sheets.forEach((sheet) => {
			sheets.push({
				difficulty: sheet.internalLevelValue,
				version: song.version,
			});
		});

		let exclusivities = [];
		if (song.sheets[0].regions.jp && !song.sheets[0].regions.intl) {
			exclusivities.push("Japan");
		} else if (!song.sheets[0].regions.jp && song.sheets[0].regions.intl) {
			exclusivities.push("Asia");
		}

		songs.push({
			title: song.title,
			sheets: sheets,
			exclusivities: exclusivities,
			categories: [song.category]
		});

		console.log(`Added ${song.title} (${song.sheets.length} sheets)`);
	}
});

fs.writeFileSync('output.json', JSON.stringify(songs, null, 4));