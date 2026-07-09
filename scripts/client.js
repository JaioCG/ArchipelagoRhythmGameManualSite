import { createSongEntry, sortTable } from "./utils.js";


// Import archipelago.js and set up client variables
import { Client } from "https://unpkg.com/archipelago.js/dist/archipelago.min.js";
const client = new Client();
let slotData = null;
let songsData = null;
let musicSheetCount = 0;
let unlockedSongs = [];
let locationsTable = null;
let tableEntries = {};


const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", (event) => {
	event.preventDefault();
	client.messages.say(event.target.querySelector("input[type=text]").value);
	event.target.querySelector("input[type=text]").value = "";
});


client.messages.on("message", (content) => {
	const logBox = document.getElementById("log");
	log.textContent = `${log.textContent}\n${content}`;
	log.scrollTop = log.scrollHeight;
});


client.socket.on("connected", async () => {
	// Update slot data with more accurate info from server
	slotData = await client.players.self.fetchSlotData();

	// Set up tracker
	document.getElementById("tracker").textContent = `${musicSheetCount} / ${slotData.sheetWinCount} ${slotData.sheetName}s to Goal.`;

	// Set up goal song at top of locations table
	document.getElementById("goal-title").innerHTML = `<b>Goal:</b> ${slotData.victoryLocation}`;
	document.getElementById("goal-row").dataset.row = slotData.victoryLocation;
	if (songsData != null) {
		console.log(songsData);
		document.getElementById("goal-difficulty").innerText = songsData[slotData.victoryLocation].difficulties;
		document.getElementById("goal-version").innerText = songsData[slotData.victoryLocation].version;
		document.getElementById("goal-category").innerText = songsData[slotData.victoryLocation].category;
	}

	// Set up rest of locations table
	locationsTable = client.package.findPackage(sessionStorage.getItem('game')).locationTable;
	const missingLocations = client.room.missingLocations;
	const locationsRows = document.getElementById("locations");
	slotData.finalSongIDs.forEach((song) => {
		if (missingLocations.includes(locationsTable[`${song}-0`]) &&
			missingLocations.includes(locationsTable[`${song}-1`])) {
		let entry = createSongEntry(song, songsData, unlockedSongs);
				tableEntries[song] = entry;

				entry.querySelector("button").addEventListener("click", () => {
					sendLocation(song);
				});
				locationsRows.appendChild(entry);
		}
	});

	// Sort the table after adding all entries
	sortTable(document.getElementById("locations"));
});


async function sendLocation(song) {
	if (confirm(`Are you sure you want to check the location for ${song}? This action cannot be undone.`)) {
		if (locationsTable == null) return;

		if (song == slotData.victoryLocation) {
			goal();
			return;
		}

		const locationId = locationsTable[`${song}-0`];
		console.log(`Attempting to check location: ${locationId} for song: ${song}`);
		await client.check(locationId, locationId + 1);
		tableEntries[song].remove();
	}
}

function goal() {
	client.goal();
}


client.items.on("itemsReceived", (items) => {
	items.forEach((item) => {
		console.log(`Receiving: ${item.name} ${item.flags}`);

		// Filter out music sheets
		if (item.name == "Map Progress" ||
			item.name == "Maimile" ||
			item.name == "Reverse Point"
		) {
			musicSheetCount++;
			if (slotData != null) {
				document.getElementById("tracker").textContent = `${musicSheetCount} / ${slotData.sheetWinCount} ${slotData.sheetName}s to Goal.`;

				if ((musicSheetCount >= slotData.sheetWinCount) && (
						missingLocations.includes(locationsTable[`${slotData.victoryLocation}-0`]) &&
						missingLocations.includes(locationsTable[`${slotData.victoryLocation}-1`])
				)) {
					document.getElementById("goal-title").disabled = false;
				}
			}

			return;
		}

		// Now handle newly unlocked songs
		unlockedSongs.push(item.name);
		const entry = tableEntries[item.name];
		if (entry) {
			entry.querySelector("button").disabled = false;
		}

		sortTable(document.getElementById("locations"));
	})
});


export async function attemptConnect() {
	return await client.login(
		`${sessionStorage.getItem('server')}:${sessionStorage.getItem('port')}`,
		sessionStorage.getItem('slot'),
		sessionStorage.getItem('game'),
		{
			password: sessionStorage.getItem('password'),
			slotData: true,
			tags: ["AP"]
		}
	);
}


export async function getSongsData(game) {
	let json = `data_old/${game}.json`;

	try {
		const fetched = await fetch(json);
		songsData = await fetched.json();
		console.log(`Songs data for ${game} loaded successfully.`);
	} catch (error) {
		console.error(`Failed to load songs data:`, error);
		alert(`Failed to load songs data for ${game}! See console for details.`);
	}
}