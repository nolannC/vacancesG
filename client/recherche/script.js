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

if (window.location.search) {
	const search = window.location.search.slice(1, window.location.search.length).split('&');
	search.forEach(params => {
		const [key, value] = params.split('=');
		document.getElementsByName(key)[0].value = value;
	});
	(async () => {
		const begin_date = document.getElementsByName('dep')[0].value;
		const end_date = document.getElementsByName('arr')[0].value;

		if (begin_date > end_date) {
			return alert("Le départ doit être avant l'arrivée");
		}

		const date = new Date(begin_date);
		const end = new Date(end_date);
		const a = new Date(date);
		a.setDate(date.getDate() + 7);
		const b = new Date(date);
		b.setMonth(date.getMonth() + 1);

		if (!(a < end && end < b)) {
			alert('Minimum une semaine, maximum un mois');
		}

		let url = [];

		const city = document.getElementsByName('where')[0].value;
		if (city) {
			url.push('filters[area][$eq]=' + city);
		}

		const bedroom = document.getElementsByName('chambre')[0].value;
		if (bedroom) {
			url.push('filters[bedroom][$eq]=' + bedroom);
		}

		const { data } = await (await fetch('http://localhost:1337/api/houses?' + url.join('&') + '&populate=*')).json();
		const ul = document.querySelector('ul');
		ul.innerHTML = '';
		data.forEach(({ id, attributes }) => {
			ul.innerHTML += `<li id="${id}">
		<div class="biens">
		  <img id="bien2" src="${'http://localhost:1337' + attributes.picture.data.attributes.url}" alt="${attributes.name}">
		  <div class="txt">
			<h2 class="btitle">${attributes.name}</h2>
			<p>${attributes.description}</p>
		  </div>
		  <button id="annonce" data-id="${id}">Voir l'annonce</button>
		</div>
	  </li>`;
		});

		document.querySelectorAll('.biens #annonce').forEach(button => {
			button.addEventListener('click', e => {
				window.location = '/produits.html?id=' + e.target.dataset.id;
			});
		});
	})();
} else {
	(async () => {
		const { data } = await (await fetch('http://localhost:1337/api/houses?populate=*&pagination[pageSize]=30')).json();
		const ul = document.querySelector('ul');
		ul.innerHTML = '';
		data.forEach(({ id, attributes }) => {
			ul.innerHTML += `<li id="${id}">
		<div class="biens">
		  <img id="bien2" src="${'http://localhost:1337' + attributes.picture.data.attributes.url}" alt="${attributes.name}">
		  <div class="txt">
			<h2 class="btitle">${attributes.name}</h2>
			<p>${attributes.description}</p>
		  </div>
		  <button id="annonce" data-id="${id}">Voir l'annonce</button>
		</div>
	  </li>`;
		});
		document.querySelectorAll('.biens #annonce').forEach(button => {
			button.addEventListener('click', e => {
				window.location = '/produits.html?id=' + e.target.dataset.id;
			});
		});
	})();
}

const types = Array.from(document.querySelectorAll('.filtertype .container'));
types.forEach(type => {
	type.firstElementChild.addEventListener('click', e => {
		types.forEach(typeEl => {
			typeEl.firstElementChild.checked = false;
		});
		e.target.checked = true;
	});
});

const categories = Array.from(document.querySelectorAll('.filtercat .container'));
categories.forEach(category => {
	category.firstElementChild.addEventListener('click', e => {
		categories.forEach(categoryEl => {
			categoryEl.firstElementChild.checked = false;
		});
		e.target.checked = true;
	});
});

const searchButton = document.getElementById('btn');
searchButton.addEventListener('click', async e => {
	const minPrice = document.getElementById('pricemi').value;
	const maxPrice = document.getElementById('pricema').value;
	console.log(minPrice, maxPrice);
	if (minPrice > maxPrice) {
		return alert('Le prix minimum doit être inférieur au prix maximum');
	}

	const begin_date = document.getElementsByName('dep')[0].value;
	const end_date = document.getElementsByName('arr')[0].value;

	if (begin_date > end_date) {
		return alert("Le départ doit être avant l'arrivée");
	}

	const date = new Date(begin_date);
	const end = new Date(end_date);
	const a = new Date(date);
	a.setDate(date.getDate() + 7);
	const b = new Date(date);
	b.setMonth(date.getMonth() + 1);

	if (!(a < end && end < b)) {
		alert('Minimum une semaine, maximum un mois');
	}

	let url = [];

	const city = document.getElementsByName('where')[0].value;
	if (city) {
		url.push('filters[area][$eq]=' + city);
	}

	const bedroom = document.getElementsByName('chambre')[0].value;
	if (bedroom) {
		url.push('filters[bedroom][$eq]=' + bedroom);
	}

	if (minPrice !== '') {
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
		const currentDate = new Date();
		const month = currentDate.toLocaleString('fr-fr', { month: 'long' });
		const category = Array.from(document.querySelectorAll('.filtercat .container'))
			.map(category => [category.textContent.trim(), category.firstElementChild.checked])
			.find(category => category[1])[0];
		let saison;
		if (category === 'Montagne') {
			for (const key in m) {
				if (m[key].includes(month)) {
					saison = key;
				}
			}
		} else {
			for (const key in n) {
				if (n[key].includes(month)) {
					saison = key;
				}
			}
		}
		url.push(`filters[$and][0][${saison}_season][$gt]=${minPrice}`);
	}

	if (maxPrice !== '') {
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

		const month = date.toLocaleString('fr-fr', { month: 'long' });
		const category = Array.from(document.querySelectorAll('.filtercat .container'))
			.map(category => [category.textContent.trim(), category.firstElementChild.checked])
			.find(category => category[1])[0];
		let saison;
		if (category === 'Montagne') {
			for (const key in m) {
				if (m[key].includes(month)) {
					saison = key;
				}
			}
		} else {
			for (const key in n) {
				if (n[key].includes(month)) {
					saison = key;
				}
			}
		}
		url.push(`filters[$and][1][${saison}_season][$lt]=${maxPrice}`);
	}

	const type = Array.from(document.querySelectorAll('.filtertype .container'))
		.map(type => [type.textContent.trim(), type.firstElementChild.checked])
		.find(type => type[1])[0];

	if (type) {
		url.push('filters[type][name][$eq]=' + type);
	}

	const equipments = Array.from(document.querySelectorAll('.filtercol .container'))
		.map(equipment => [equipment.textContent.trim(), equipment.firstElementChild.checked])
		.filter(equipment => equipment[1])
		.map(equipment => equipment[0]);

	equipments.forEach((equipment, index) => {
		url.push(`filters[$and][${index}][equipment][equipment]=${equipment}`);
	});

	const category = Array.from(document.querySelectorAll('.filtercat .container'))
		.map(category => [category.textContent.trim(), category.firstElementChild.checked])
		.find(category => category[1])[0];

	if (category) {
		url.push('filters[type][name][$eq]=' + category);
	}

	url.push(
		`filters[$or][0][$and][0][booking][begin_date][$lt]=${date.toISOString().split('T')[0]}&filters[$or][0][$and][1][booking][end_date][$gt]=${
			end.toISOString().split('T')[0]
		}&filters[$or][1][booking][id][$notNull]`
	);
	console.log(url.join('&'));
	const { data } = await (await fetch('http://localhost:1337/api/houses?' + url.join('&') + '&populate=*')).json();
	const ul = document.querySelector('ul');
	ul.innerHTML = '';
	data.forEach(({ id, attributes }) => {
		ul.innerHTML += `<li id="${id}">
		<div class="biens">
		  <img id="bien2" src="${'http://localhost:1337' + attributes.picture.data.attributes.url}" alt="${attributes.name}">
		  <div class="txt">
			<h2 class="btitle">${attributes.name}</h2>
			<p>${attributes.description}</p>
		  </div>
		  <button id="annonce" data-id="${id}">Voir l'annonce</button>
		</div>
	  </li>`;
	});

	document.querySelectorAll('.biens #annonce').forEach(button => {
		button.addEventListener('click', e => {
			window.location = '/produits.html?id=' + e.target.dataset.id;
		});
	});
});
