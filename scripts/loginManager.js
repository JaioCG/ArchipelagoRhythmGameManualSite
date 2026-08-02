import { attemptConnect, getSongsData } from "./archipelagoClient.js";


// Load saved info on page load, if any
window.addEventListener('DOMContentLoaded', () => {
	if (sessionStorage.getItem('server')) {
		document.getElementsByName('server')[0].value = sessionStorage.getItem('server');
		document.getElementsByName('port')[0].value = sessionStorage.getItem('port');
		document.getElementsByName('slot')[0].value = sessionStorage.getItem('slot');
		// Require password to be entered every time
		document.getElementsByName('game')[0].value = sessionStorage.getItem('game');
	}
});


// Attempt connection
document.getElementById('login-container').addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);

	// Set new values in session storage
	sessionStorage.setItem('server', formData.get('server'));
	sessionStorage.setItem('port', formData.get('port'));
	sessionStorage.setItem('slot', formData.get('slot'));
	sessionStorage.setItem('password', formData.get('password'));
	sessionStorage.setItem('game', formData.get('game'));

	// Temporarily disable button to prevent multiple clicks
	e.target.querySelector('input[type="submit"]').disabled = true;

	// Get songs data for selected game
	await getSongsData();

	// Attempt connection to Archipelago
	attemptConnect().then((success) => {
		if (success) {
			// Update UI to show main content
			document.getElementById('login-container').classList.add('hidden');
			document.getElementById('main-ui').classList.remove('hidden');
		} else {
			// Re-enable button on failure
			e.target.querySelector('input[type="submit"]').disabled = false;
		}
	});
});