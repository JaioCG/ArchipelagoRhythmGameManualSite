// Tool to generate apworldGeneration-formatted songs list from maimai DX data
// Data sourced from https://arcade-songs.zetaraku.dev/maimai/
import fs from 'fs';

// Import file and make new temp folder
const file = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));

let songs = [];
file.songs.forEach((song) => {
	if (song.category != "宴会場") {
		let stdSheets = [];
		let dxSheets = [];
		song.sheets.forEach((sheet) => {
			if (sheet.type === "std") {
				stdSheets.push({
					difficulty: sheet.internalLevelValue,
					version: sheet.version,
				});
			} else if (sheet.type === "dx") {
				dxSheets.push({
					difficulty: sheet.internalLevelValue,
					version: sheet.version,
				});
			}
		});

		let exclusivities = [];
		if (song.sheets[0].regions.jp && !song.sheets[0].regions.intl) {
			exclusivities.push("Japan");
		} else if (song.sheets[0].regions.intl && !song.sheets[0].regions.usa) {
			exclusivities.push("Asia");
		}

		if (stdSheets.length > 0 && dxSheets.length > 0) {
			songs.push({
				title: `(STD) ${song.title}`,
				sheets: stdSheets,
				exclusivities: exclusivities,
				categories: [song.category]
			});

			songs.push({
				title: `(DX) ${song.title}`,
				sheets: dxSheets,
				exclusivities: exclusivities,
				categories: [song.category]
			});
		} else {
			songs.push({
				title: `${song.title}`,
				sheets: stdSheets.length > 0 ? stdSheets : dxSheets,
				exclusivities: exclusivities,
				categories: [song.category]
			});
		}

		console.log(`Added ${song.title} (${song.sheets.length} sheets)`);
	}
});

fs.writeFileSync('output.json', JSON.stringify(songs, null, 4));