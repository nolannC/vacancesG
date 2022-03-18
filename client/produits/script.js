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

Date.prototype.addDays = function (days) {
	const dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
};

const getDates = (startDate, stopDate) => {
	var dateArray = new Array();
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(currentDate);
		currentDate = currentDate.addDays(1);
	}
	return dateArray;
};

const params = window.location.search.slice(1, window.location.search.length).split('&');

if (!localStorage.getItem('token')) {
	alert('Vous devez être connecter pour consulter nos locations');
	window.location = '/accueil.html';
}

(async () => {
	const id = params[0].split('=')[1];
	const { data } = await (await fetch('http://localhost:1337/api/houses/' + id + '?populate=*')).json();
	console.log(data);
	document.querySelector('#houseName h1').textContent = data.attributes.name;
	document.querySelector('#productsMedias img').src = 'http://localhost:1337' + data.attributes.picture.data.attributes.url;
	document.getElementById('location').innerHTML = '<img class="icones" src="./produits/images/loc.png"> ' + data.attributes.area;
	document.getElementById('description').textContent = data.attributes.description;
	document.querySelector(
		'#superficie li:nth-child(1)'
	).innerHTML = `<img class="icones" src="./produits/images/house.png"> Superficie : ${data.attributes.m2}m²`;
	document.querySelector(
		'#superficie li:nth-child(2)'
	).innerHTML = `<img class="icones" src="./produits/images/bedroom.png"> Chambres : ${data.attributes.bedroom}`;
	document.querySelector(
		'#superficie li:nth-child(3)'
	).innerHTML = `<img class="icones" src="./produits/images/bathroom.png">Salles de bains : ${data.attributes.bathroom}`;
	document.getElementById('tags').innerHTML = '';
	data.attributes.equipment.data.forEach(equipment => {
		document.getElementById('tags').innerHTML += `<li>#${equipment.attributes.equipment}</li>`;
	});
	const { data: bookings } = await (
		await fetch('http://localhost:1337/api/bookings?populate=*&filters[house][id][$eq]=' + id, {
			headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
		})
	).json();

	const dates = [];
	bookings.forEach((booking, i) => {
		dates.push({
			begin_date: new Date(booking.attributes.begin_date),
			end_date: new Date(booking.attributes.end_date)
		});
		console.log(booking.attributes);
	});

	const datesDisabled = [];
	dates.forEach(date => {
		datesDisabled.push(...getDates(date.begin_date, date.end_date));
	});

	const start = document.getElementById('startDate');
	start.addEventListener('hide', e => {
		console.log(e);
		const date = new Date(e.target.value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2'));
		const month = date.toLocaleString('fr-fr', { month: 'long' });
		console.log(month);

		const m = {
			low: ['septembre', 'octobre', 'novembre'],
			middle: ['avril', 'mai', 'juin'],
			high: ['décembre', 'janvier', 'février', 'mars', 'juillet', 'août']
		};
		const n = {
			low: ['octobre', 'novembre', 'décembre', 'janvier', 'février', 'mars', 'avril'],
			middle: ['mai', 'juin', 'septembre'],
			high: ['juillet', 'août']
		};

		let season;
		if (data.attributes.category.data.attributes.name === 'Montagne') {
			for (const key in m) {
				if (m[key].includes(month)) {
					season = key;
				}
			}
		} else {
			for (const key in n) {
				if (n[key].includes(month)) {
					season = key;
				}
			}
		}

		const priceEl = document.getElementById('price');
		priceEl.textContent = `${data.attributes[season + '_season']}€ / semaine`;
	});

	new Datepicker(start, {
		minDate: new Date(),
		datesDisabled: [...new Set(datesDisabled)]
	});

	const end = document.getElementById('endDate');
	new Datepicker(end, {
		minDate: new Date(),
		datesDisabled: [...new Set(datesDisabled)]
	});
})();

const booking = document.getElementById('btn-resa');
booking.addEventListener('click', async e => {
	console.log(document.getElementById('startDate').value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2'));
	console.log(document.getElementById('endDate').value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2'));
	const startDate = new Date(document.getElementById('startDate').value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2'));
	const endDate = new Date(document.getElementById('endDate').value.replace(/(\d\d)\/(\d\d)\/(\d{4})/, '$3-$1-$2'));
	const chef = document.getElementById('chef').checked;
	const visit = document.getElementById('visit').checked;
	console.log(startDate, endDate, chef, visit);

	const a = new Date(startDate);
	a.setDate(startDate.getDate() + 7);
	const b = new Date(startDate);
	b.setMonth(startDate.getMonth() + 1);

	if (!(a < endDate && endDate < b)) {
		alert('Minimum une semaine, maximum un mois');
	}
	const { id } = await (await fetch('http://localhost:1337/api/users/me', { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })).json();
	console.log(id);
	const body = JSON.stringify({
		data: { begin_date: startDate, end_date: endDate, reserve_chef_cook: chef, visit, house: params[0].split('=')[1], user: id }
	});
	const r = await (
		await fetch('http://localhost:1337/api/bookings', {
			method: 'POST',
			body,
			headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') }
		})
	).json();
	console.log(r);
});
