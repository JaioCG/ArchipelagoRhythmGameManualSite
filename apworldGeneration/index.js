// Import functions from generated files
import { initpy } from './base/__init__.py.js';
import { archipelagojson } from './base/archipelago.json.js';
import { itemspy } from './base/items.py.js';
import { locationspy } from './base/locations.py.js';
import { optionspy } from './base/options.py.js';
import { rgCollectionspy } from './base/rgCollections.py.js';
import { songdatapy } from './base/SongData.py.js';

// Other imports
import fs from 'fs';
import AdmZip from 'adm-zip';


// Import file and make new temp folder
const file = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
let folderName = file.gameName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

// Check for too many filler items
if (file.fillerItems.length > 8) {
	console.error('Error: Too many filler items. Maximum allowed is 8.');
}

try {
	await fs.mkdirSync(folderName);
	makeApworld();
} catch (err) {
	console.error('Error creating directory:', err);
}


// Generate data for importing on the website
let webData = {
	diffColors: file.difficulties.map((diff) => diff.color),
	songs: file.songs
}

webData.songs.forEach((song) => {
	song.title = song.title.replaceAll('"', "'");
});

fs.writeFileSync(`${file.gameName}.json`, JSON.stringify(webData, null, 4));


// Function to copy and generate apworld
function makeApworld() {
	// Copy and set up files
	fs.writeFileSync(`${folderName}/__init__.py`, initpy(file.gameName));
	fs.writeFileSync(`${folderName}/archipelago.json`, archipelagojson(file.gameName));
	fs.writeFileSync(`${folderName}/items.py`, itemspy(file.gameName));
	fs.writeFileSync(`${folderName}/locations.py`, locationspy(file.gameName));
	fs.writeFileSync(`${folderName}/options.py`, optionspy(file.difficulties, file.useTenths, file.diffFloor, file.diffCeiling));
	fs.writeFileSync(`${folderName}/rgCollections.py`, rgCollectionspy(file.sheetName, file.fillerItems, file.difficulties, file.useTenths));
	fs.writeFileSync(`${folderName}/SongData.py`, songdatapy(file.songs, file.difficulties));

	// Zip and create apworld
	const zip = new AdmZip();
	zip.addLocalFolder(folderName, folderName);
	zip.writeZip(`${folderName}.apworld`);

	// Delete temp folder
	try {
		fs.rmSync(folderName, { recursive: true, force: true });
	} catch (err) {
		console.error('Error deleting directory:', err);
	}
}