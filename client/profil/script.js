if (!localStorage.getItem('token')) {
	window.location = '/';
} else {
	if (localStorage.getItem('token')) {
		document.getElementById('group').innerHTML = `<div id="privateClub">
		<p>Club privilèges</p>
	</div>
	<div id="group" class="dropdown">
            <button class="dropbtn"><img id="icon" src="./profil/images/icon.png"><img id="point-co"
                    src="./profil/images/1_nZ9VwHTLxAfNCuCjYAkajg.png"></button>
            <div class="dropdown-content">
                <a>Se déconnecter</a>
            </div>
        </div>`;
	}
}

let ID;
(async () => {
	const { first_name, last_name, email, id } = await (
		await fetch('http://localhost:1337/api/users/me', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
	).json();
	const first_nameEl = document.getElementsByName('first_name')[0];
	const last_nameEl = document.getElementsByName('last_name')[0];
	const emailEl = document.getElementsByName('email')[0];
	first_nameEl.value = first_name;
	last_nameEl.value = last_name;
	emailEl.value = email;
	ID = id;
})();

const btn = document.getElementById('btn-co');
btn.addEventListener('click', async e => {
	const first_name = document.getElementsByName('first_name')[0].value;
	const last_name = document.getElementsByName('last_name')[0].value;
	const email = document.getElementsByName('email')[0].value;
	const body = JSON.stringify({ first_name, last_name, email });
	await (
		await fetch('http://localhost:1337/api/users/' + ID, {
			method: 'PUT',
			body,
			headers: { Authorization: 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' }
		})
	).json();
	window.location = window.location;
});

const infos = document.querySelector('.container-2-1 h4:nth-child(1)');
infos.addEventListener('click', e => {
	document.getElementsByClassName('container-infos')[0].style.display = 'block';
	document.getElementsByClassName('Historique')[0].style.display = 'none';
	document.getElementsByClassName('container-reclam')[0].style.display = 'none';
	document.getElementsByClassName('container-parrainage')[0].style.display = 'none';
});

const history = document.querySelector('.container-2-1 h4:nth-child(2)');
history.addEventListener('click', e => {
	document.getElementsByClassName('container-infos')[0].style.display = 'none';
	document.getElementsByClassName('Historique')[0].style.display = 'block';
	document.getElementsByClassName('container-reclam')[0].style.display = 'none';
	document.getElementsByClassName('container-parrainage')[0].style.display = 'none';
});

const reclams = document.querySelector('.container-2-1 h4:nth-child(3)');
reclams.addEventListener('click', e => {
	document.getElementsByClassName('Historique')[0].style.display = 'none';
	document.getElementsByClassName('container-infos')[0].style.display = 'none';
	document.getElementsByClassName('container-reclam')[0].style.display = 'block';
	document.getElementsByClassName('container-parrainage')[0].style.display = 'none';
});

const parrainage = document.querySelector('.container-2-1 h4:nth-child(4)');
parrainage.addEventListener('click', e => {
	document.getElementsByClassName('Historique')[0].style.display = 'none';
	document.getElementsByClassName('container-infos')[0].style.display = 'none';
	document.getElementsByClassName('container-reclam')[0].style.display = 'none';
	document.getElementsByClassName('container-parrainage')[0].style.display = 'block';
});

const deconnexion = document.getElementsByClassName('dropdown-content')[0];

deconnexion.addEventListener('click', e => {
	localStorage.removeItem('token');
	window.location = './accueil.html';
});
