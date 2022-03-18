if (localStorage.getItem('token')) {
	document.getElementById('group').innerHTML = `<div id="privateClub">
	<p>Club privilèges</p>
</div>
<a href="./profil.html"><div class="icon-profil">
	<div class="BG"></div>
	<img id="icon-co" src="./profil/images/icon.png" alt="icon-connexion">
	<img id="bouton-co" src="./profil/images/1_nZ9VwHTLxAfNCuCjYAkajg.png" alt="led-connecté">
</div></a>`;
}

const form = document.querySelector('form');

form.addEventListener('submit', async e => {
	e.preventDefault();
	const identifier = document.getElementById('identifiant').value;
	const password = document.getElementById('psw').value;

	const body = JSON.stringify({ identifier, password });
	const { jwt } = await (
		await fetch(`http://localhost:1337/api/auth/local`, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
	).json();
	localStorage.setItem('token', jwt);
	window.location = '/accueil.html';
});
