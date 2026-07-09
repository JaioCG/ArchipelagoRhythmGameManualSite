import { attemptConnect, getSongsData } from "./client.js";


// Load saved info on page load
window.addEventListener('DOMContentLoaded', () => {
	if (sessionStorage.getItem('server')) {
		document.getElementsByName('server')[0].value = sessionStorage.getItem('server');
		document.getElementsByName('port')[0].value = sessionStorage.getItem('port');
		document.getElementsByName('slot')[0].value = sessionStorage.getItem('slot');
		document.getElementsByName('game')[0].value = sessionStorage.getItem('game');
	}
});


// Attempt connection upon login
document.getElementById('login-container').addEventListener('submit', async function(event) {
	event.preventDefault();
	const formData = new FormData(event.target);

	// Set session storage for server info
	sessionStorage.setItem('server', formData.get('server'));
	sessionStorage.setItem('port', formData.get('port'));
	sessionStorage.setItem('slot', formData.get('slot'));
	sessionStorage.setItem('game', formData.get('game'));

	event.target.querySelector('input[type="submit"]').disabled = true;

	// Get songs data for the selected game
	await getSongsData(formData.get('game'));

	// Attempt connection
	try {
		let result = await attemptConnect();
		console.log('Connection successful!', result);
		updateUI();
	} catch (error) {
		console.error('Connection failed:', error);
		alert('Connection failed! See console for details.');
		event.target.querySelector('input[type="submit"]').disabled = false;
	}
});


// If connection successful, update UI to show main UI
function updateUI() {
	document.getElementById('login-container').classList.add('hidden');
	document.getElementById('main-ui').classList.remove('hidden');
}