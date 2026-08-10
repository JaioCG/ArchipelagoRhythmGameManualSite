export function elementFromHTML(html) {
	const template = document.createElement('template');
	template.innerHTML = html.trim();
	return template.content.firstChild;
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


export function formatDifficulties(song, colors) {
	let html = ''

	song.sheets.forEach((sheet, index) => {
		const color = colors[index] || '#FFFFFF'; // Default to white if no color is specified
		html += `<span style="color: ${color};">${sheet.difficulty}</span>, `;
	});
	
	return html.slice(0, -2); // Remove the last comma and space
}


export function formatVersions(song) {
	let versions = [...new Set(song.sheets.map(sheet => sheet.version))];
	return versions.join(', ');
}


export function hasVersions(song) {
	return song.sheets.some(sheet => sheet.version);
}

export function hasCategories(song) {
	return song.categories && song.categories.length > 0;
}