import { elementFromHTML, sortTable } from "./utils.js";
import { Client } from "https://unpkg.com/archipelago.js/dist/archipelago.min.js";
const client = new Client();
let slotData = null;
let songsData = null;
let musicSheetCount = 0;
let locationsTable = null;
let listEntries = {};
let unlockedSongs = [];
let missingLocations = null;


// Get songs data for selected game
export async function getSongsData() {
	let json = `data/${sessionStorage.getItem('game')}.json`;
	try {
		const response = await fetch(json);
		songsData = await response.json();
		console.log("Songs data loaded successfully!", songsData);
	} catch (error) {
		console.error("Error loading songs data!", error);
		alert("Error loading songs data! See console for details.");
	}
}


// Attempt to connect to Archipelago and set up tracker, goal, and locations table if successful
export async function attemptConnect() {
	try {
		// Attempt to connect to Archipelago
		slotData = await client.login(
			`${sessionStorage.getItem('server')}:${sessionStorage.getItem('port')}`,
			sessionStorage.getItem('slot'),
			sessionStorage.getItem('game'),
			{
				password: sessionStorage.getItem('password'),
				slotData: true,
				tags: ["AP"]
			}
		);

		// Set up tracker
		document.getElementById('tracker').textContent = `${musicSheetCount} / ${slotData.sheetWinCount} ${slotData.sheetName}s to Goal.`;

		// Set up goal song at top of song list
		document.getElementById('goal-title').innerHTML = `<b>Goal:</b> ${slotData.victoryLocation}`;
		document.getElementById('goal-title').addEventListener('click', () => {
			sendLocation(slotData.victoryLocation);
		});
		if (songsData != null) {
			document.getElementById('goal-difficulty').textContent = songsData[slotData.victoryLocation].difficulties;
			document.getElementById('goal-version').textContent = songsData[slotData.victoryLocation].version;
			document.getElementById('goal-category').textContent = songsData[slotData.victoryLocation].category;
		}


		// Set up rest of locations table
		locationsTable = client.package.findPackage(sessionStorage.getItem('game')).locationTable;
		missingLocations = client.room.missingLocations;
		const songsList = document.getElementById('songs-list');
		slotData.finalSongIDs.forEach((song) => {
			if (missingLocations.includes(locationsTable[`${song}-0`]) && 
				missingLocations.includes(locationsTable[`${song}-1`])) {
					const element = elementFromHTML(`
						<tr data-row="${song}">
							<th scope="row">
								<button ${!unlockedSongs.includes(song) ? 'disabled' : ''}>${song}</button>
							</th>
						</tr>
					`);
					listEntries[song] = element;
					element.querySelector('button').addEventListener('click', () => {
						sendLocation(song);
					});
					songsList.appendChild(element);
				}
		});

		// Sort list after adding all songs
		sortTable(document.getElementById('songs-list'));

		// Notify player and update UI
		console.log("Connection successful!", slotData);
		return true;
	} catch (error) {
		console.error("Connection failed!", error);
		alert("Connection failed! See console for details.");
		return false;
	}
}


// Chat functionality
const chatForm = document.getElementById('chat-form');
const log = document.getElementById('log');

chatForm.addEventListener('submit', (e) => {
	e.preventDefault();
	client.messages.say(e.target.querySelector('input[type="text"]').value);
	e.target.querySelector('input[type="text"]').value = '';
});

client.messages.on('message', (message) => {
	log.textContent = `${log.textContent}\n${message}`;
	log.scrollTop = log.scrollHeight;
});


// Handle newly received items (also runs for all past items upon connection)
client.items.on('itemsReceived', (items) => {
	// For some reason, itemsReceived runs before the connection is fully established, so we need to wait a bit before processing the items if slotData is not yet available 
	if (slotData == null) {
		setTimeout(() => itemsReceived(items), 100);
	} else {
		itemsReceived(items);
	}
});

function itemsReceived(items) {
	items.forEach((item) => {
		console.log(`Received item: ${item.name} from ${item.sender.name}`);

		// If item is a music sheet, update tracker and check for goal song unlock
		if (item.name == slotData.sheetName) {
			musicSheetCount++;
			document.getElementById('tracker').textContent = `${musicSheetCount} / ${slotData.sheetWinCount} ${slotData.sheetName}s to Goal.`;

			if (musicSheetCount >= slotData.sheetWinCount) {
				document.getElementById('goal-title').disabled = false;
			}
		}

		// Handle newly unlocked songs
		unlockedSongs.push(item.name);
		const songRow = listEntries[item.name];
		if (songRow) {
			songRow.querySelector('button').disabled = false;
		}
		sortTable(document.getElementById('songs-list'));
	});
}


// Handle sending locations based on button presses
async function sendLocation(song) {
	if (locationsTable == null) return;

	if (song == slotData.victoryLocation) {
		client.goal();
		document.getElementById('songs-list').children[0].innerHTML = '';
		document.getElementById('tracker').textContent = `Goal reached!`;
		return;
	}

	const locationID = locationsTable[`${song}-0`];
	await client.check(locationID, locationID + 1);
	listEntries[song].remove();
}