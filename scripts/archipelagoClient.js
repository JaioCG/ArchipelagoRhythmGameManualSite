import { elementFromHTML, sortTable, formatDifficulties, formatVersions } from "./utils.js";
import { Client } from "https://unpkg.com/archipelago.js/dist/archipelago.min.js";
const client = new Client();
let slotData = null;
let gameData = null;
let musicSheetCount = 0;
let locationsTable = null;
let listEntries = {};
let unlockedSongs = [];
let missingLocations = null;


// Get songs data for selected game
export async function getGameData() {
	let json = `data/${sessionStorage.getItem('game')}.json`;
	try {
		const response = await fetch(json);
		gameData = await response.json();
		console.log("Games data loaded successfully!", gameData);
	} catch (error) {
		console.error("Error loading games data!", error);
		alert("Error loading games data! See console for details.");
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
		if (gameData != null) {
			document.getElementById('goal-difficulty').innerHTML = formatDifficulties(gameData.songs.find(item => item.title == slotData.victoryLocation), gameData.diffColors);
			document.getElementById('goal-category').textContent = gameData.songs.find(item => item.title == slotData.victoryLocation).categories.join(', ');
			document.getElementById('goal-version').textContent = formatVersions(gameData.songs.find(item => item.title == slotData.victoryLocation));
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
								<td>${formatDifficulties(gameData.songs.find(item => item.title == song), gameData.diffColors)}</td>
								<td>${gameData.songs.find(item => item.title == song).categories.join(', ')}</td>
								<td>${formatVersions(gameData.songs.find(item => item.title == song))}</td>
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

client.messages.on('message', (message, nodes) => {
	let text = '';
	nodes.forEach((node) => {
		console.log(node);
		let textColor = '#C2C7D0';
		switch (node.type) {
			case 'player':
				if (node.text == sessionStorage.getItem('slot')) {
					textColor = '#EE00EE';
				} else {
					textColor = '#FAFAD2';
				}
				break;
			case 'text':
				break;
			case 'item':
				switch (node.part.flags) {
					case 0:
						textColor = '#00EEEE'; // Filler item
						break;
					case 1:
						textColor = '#AF99EF'; // Progression item
						break;
					case 2:
						textColor = '#5972BE'; // Useful item
						break;
					case 4:
						textColor = '#E4766A'; // Trap item
						break;
				}
				break;
			case 'location':
				textColor = '#00FF7F';
				break;
		}

		text += `<span style="color: ${textColor};">${node.text}</span>`;
	});

	log.innerHTML = `${log.innerHTML}<span>${text}</span>`;
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