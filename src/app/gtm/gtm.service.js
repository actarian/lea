/* jshint esversion: 6 */

function push_(event) {
	const dataLayer = window.dataLayer || [];
	dataLayer.push(event);
	console.log('GtmService.dataLayer', dataLayer);
}

export default class GtmService {

	static pageView() {
		return push_({
			event: 'PageViewCustomEvent',
			title: document.title,
			href: window.location.href,
			pathname: window.location.pathname,
			hostname: window.location.hostname,
		});
	}

	static pageView(pathname) {
		const obj = {
			event: 'PageViewCustomEvent',
			title: document.title,
			href: window.location.href,
			pathname: pathname || window.location.pathname,
			hostname: window.location.hostname,
		};
		Object.assign(obj, window.dataLayerData);
		return push_(obj);
	}

	static pageViewFilters(cat, filters) {
		const values = [];
		let any = false;
		for (let key in filters) {
			let textValue = '';
			const filterValue = filters[key].value;
			if (filterValue) {
				const selectedOption = filters[key].options.find(option => option.value === filterValue);
				if (selectedOption) {
					textValue = selectedOption.key;
				}
			}
			if (textValue) any = true;
			let name = filters[key].key /* se array di filtri */ || key /* se oggetto filtro */ ;
			if (name) name = encodeURIComponent(name) + '-';
			values.push(name + encodeURIComponent(textValue));
		}
		const pathname = any ? `?cat=${cat}&s=${values.join('_')}` : '';
		GtmService.pageView(window.location.pathname + pathname);
	}

	static push(event) {
		return push_(event);
	}

}
