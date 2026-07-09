export function elementFromHTML(html) {
	const template = document.createElement("template");
	template.innerHTML = html.trim();
	return template.content.firstChild;
}


export function createSongEntry(song, songsData, unlockedSongs) {
	const element = elementFromHTML(`
		<tr data-row="${song}">
			<th scope="row">
				<button ${!unlockedSongs.includes(song) ? 'disabled' : ''}>${song}</button>
			</th>
			<td>${songsData[song].difficulties}</td>
			<td>${songsData[song].version}</td>
			<td>${songsData[song].category}</td>
		</tr>
	`);
	return element;
}


export function sortTable(table) {
	// Sort the table rows based on whether the button is disabled or not, and then by song name
	const rows = Array.from(table.rows).slice(1); // Skip the header row
	rows.sort((a, b) => {
		const aButton = a.querySelector('button');
		const bButton = b.querySelector('button');
		if (aButton.disabled && !bButton.disabled) return 1;
		if (!aButton.disabled && bButton.disabled) return -1;
		return aButton.textContent.localeCompare(bButton.textContent);
	});

	// Append the sorted rows back to the table
	rows.forEach(row => table.appendChild(row));
}