/* jshint esversion: 6 */

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

const IS_DEV = (window.location.hostname === 'localhost' || window.location.hostname === '0.0.0.0');
const BASEPATH = (window.location.hostname === '0.0.0.0' ? './img/store-locator/' : '/Client/docs/img/store-locator/');

const GTM_CAT = 'store-locator';
const ZOOM_LEVEL = 13;
const SHOW_INFO_WINDOW = false;
const MAX_DISTANCE = 100;
let GOOGLE_MAPS = null;

export const ITEMS_PER_PAGE = 15;

class StoreLocatorCtrl {

	constructor(
		$scope,
		$timeout,
		DomService,
		ApiService
	) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.domService = DomService;
		this.apiService = ApiService;
		if (!window.apiKey && !IS_DEV) {
			throw (`Missing Google Map Api Key`);
		}
		this.apiKey = window.apiKey;
		this.model = {};
		this.busyFind = false;
		this.busyLocation = false;
		this.visibleStores = [];
		this.mapCenter$ = new Subject();
		this.labels = window.labels || {
			approximately: `Approximately`,
			moreInfo: `More Info`,
			reachStore: `Reach Store`,
		};
		if (GOOGLE_MAPS !== null) {
			this.initMap();
		} else {
			window.onGoogleMapsLoaded = () => {
				GOOGLE_MAPS = google.maps;
				this.initMap();
			};
			const script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', `https://maps.googleapis.com/maps/api/js?callback=onGoogleMapsLoaded${this.apiKey ? `&key=${this.apiKey}` : ''}`);
			(document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script);
		}
		this.unsubscribe = new Subject();
		this.mapCenter$.pipe(
			debounceTime(1000),
			takeUntil(this.unsubscribe)
		).subscribe(position => {
			this.findNearStores(this.stores, position);
		});
		$scope.$on('destroy', () => {
			this.unsubscribe.next();
			this.unsubscribe.complete();
		});
	}

	initMap() {
		const mapOptions = {
			zoom: 7,
			center: new google.maps.LatLng(44.5416713, 10.8259022), // prima ricerca vicino a casa madre
			styles: [[{
				"featureType": "administrative",
				"elementType": "geometry.fill",
				"stylers": [{ "visibility": "on" }]
			}, {
				"featureType": "administrative",
				"elementType": "labels.text.fill",
				"stylers": [{ "color": "#414141" }]
			}, {
				"featureType": "landscape",
				"stylers": [{ "color": "#f2f2f2" }]
			}, {
				"featureType": "poi",
				"stylers": [{ "visibility": "off" }]
			}, {
				"featureType": "road",
				"stylers": [{ "saturation": -100 }, { "lightness": 45 }]
			}, {
				"featureType": "road.arterial",
				"elementType": "labels.icon",
				"stylers": [{ "visibility": "off" }]
			}, {
				"featureType": "road.highway",
				"stylers": [{ "visibility": "simplified" }]
			}, {
				"featureType": "transit",
				"stylers": [{ "visibility": "off" }]
			}, {
				"featureType": "water",
				"stylers": [{ "color": "#d6d2ce" }, { "visibility": "on" }]
			}]]
		};
		const mapElement = document.getElementById('map');
		if (!mapElement) {
			return;
		}
		const map = new google.maps.Map(mapElement, mapOptions);
		map.addListener('dragend', () => {
			const position = map.getCenter();
			this.mapCenter$.next(position);
		});
		this.position = mapOptions.center;
		this.$timeout(() => {
			this.map = map;
			this.searchPosition(mapOptions.center);
		});
	}

	calculateDistance(lat1, lon1, lat2, lon2, unit) {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		} else {
			const radlat1 = Math.PI * lat1 / 180;
			const radlat2 = Math.PI * lat2 / 180;
			const theta = lon1 - lon2;
			const radtheta = Math.PI * theta / 180;
			let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180 / Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit == "K") {
				dist = dist * 1.609344;
			}
			if (unit == "N") {
				dist = dist * 0.8684;
			}
			return dist;
		}
	}

	addMarkers(stores) {
		const markers = stores.map((store) => {
			const position = new google.maps.LatLng(store.latitude, store.longitude);
			let content = `<div class="marker__content">
				<div class="title"><span>${store.title}</span></div>
				<div class="group group--info">
					<div class="address">
						${store.address}<br>
						${store.zip} ${store.city} ${store.provinceCode} ${store.country}<br>
						${store.telephone ? `<span>${store.telephone}<br></span>` : ''}
						${store.email ? `<span><a href="mailto:${store.email}">${store.email}</a><br></span>` : ''}
						${store.website ? `<span><a target="_blank" href="${store.website}">${store.website}</a></span>` : ''}
					</div>
					<div class="distance">${this.labels.approximately} <b>${Math.floor(store.distance)} km</b></div>
				</div>
				<div class="group group--cta">
					<a id="locator-marker" href="https://www.google.it/maps/dir/${position.lat()},${position.lng()}/${store.title}/@${store.latitude},${store.longitude}/" target="_blank" class="btn btn--link"><span>${this.labels.reachStore}</span></a>
				</div>
			</div>`;

			const icon = ['pin-showroom.png', 'pin-top-store.png', 'pin-reseller.png'][store.type - 1];

			const marker = new google.maps.Marker({
				position: position,
				// map: this.map,
				icon: `${BASEPATH}${icon}`,
				title: store.title,
				store: store,
				content: content,
			});
			marker.addListener('click', () => {
				this.setMarkerWindow(marker.position, content);
				this.scrollToStore(store);
				// GtmService.push({ event: 'dealerlocator', action: 'marker-click', label: store.title });
			});
			store.marker = marker;
			return marker;
		});

		const markerCluster = new MarkerClusterer(this.map, markers, {
			imagePath: `${BASEPATH}cluster-`,
		});
		const styles = markerCluster.getStyles();
		styles.forEach(style => style.textColor = '#ffffff');
		markerCluster.setStyles(styles);
		this.markers = markers;
		this.markerCluster = markerCluster;
	}

	getGeolocation(map) {
		this.error = null;
		this.busyLocation = true;
		let position = this.map.getCenter();
		// Try HTML5 geolocation.
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((location) => {
				// console.log(location.coords);
				position = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
				this.setInfoWindow(position, 1);
				this.searchPosition(position).finally(() => this.busyLocation = false);
				this.map.setCenter(position);
				this.map.setZoom(ZOOM_LEVEL);
			}, () => {
				this.setInfoWindow(position, 2);
				this.searchPosition(position).finally(() => this.busyLocation = false);
			});
		} else {
			// Browser doesn't support Geolocation
			this.setInfoWindow(position, 3);
			this.searchPosition(position).finally(() => this.busyLocation = false);
		}
	}

	loadStoresByPosition(position) {
		return this.apiService.storeLocator.position(position).then(success => {
			const stores = success.data;
			this.visibleItems = [];
			this.maxItems = ITEMS_PER_PAGE;
			this.$timeout(() => {
				this.stores = stores;
				this.visibleItems = stores.slice(0, this.maxItems);
			}, 50);
			// console.log('StoreLocatorCtrl.loadStoresByPosition', position, stores);
			this.addMarkers(stores);
		});
	}

	loadAllStores() {
		if (this.stores) {
			return Promise.resolve(this.stores);
		}
		// this.loadFakeStores();
		return this.apiService.storeLocator.all().then(success => {
			const stores = success.data;
			stores.forEach(store => store.distance = this.position ? this.calculateDistance(store.latitude, store.longitude, this.position.lat(), this.position.lng(), 'K') : '');
			this.addMarkers(stores);
			this.visibleItems = [];
			this.maxItems = ITEMS_PER_PAGE;
			this.$timeout(() => {
				this.stores = stores;
				this.visibleItems = stores.slice(0, this.maxItems);
			}, 50);
			return stores;
		});
	}

	loadFakeStores() {
		return fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Ceramiche&inputtype=textquery&fields=name,formatted_address,address_components,formatted_phone_number,geometry${this.apiKey ? `&key=${this.apiKey}` : ''}`, { mode: 'cors' }).then(response => {
			return response.json();
		}).then(json => {
			console.log('json', json);
			return json.candidates.map((x, i) => {
				return {
					id: i + 1,
					latitude: x.geometry.location.lat,
					longitude: x.geometry.location.lng,
					title: x.name,
					address: x.formatted_address,
					type: 1 + Math.floor(Math.random() * 3)
				}
			});
			/*
			{
				id: 2,
				latitude: 44.5902807,
				longitude: 10.721454,
				title: 'Lea Ceramiche',
				abstract: 'Negozio di piastrelle ceramiche',
				address: 'Via Statale, 127',
				zip: '42013',
				city: 'Casalgrande',
				province: 'Reggio Emilia',
				provinceCode: 'RE',
				country: 'Italia',
				countryCode: 'IT',
				telephone: '+39 0536 837811',
				email: 'info@ceramichelea.it',
				website: 'https://www.ceramichelea.it/',
				image: './img/store-locator/02@2x.jpg',
				type: 3
			}
			*/
		});
	}

	fitBounds(stores) {
		if (stores.length) {
			const bounds = new google.maps.LatLngBounds();
			stores.forEach((store) => {
				const position = new google.maps.LatLng(store.latitude, store.longitude);
				bounds.extend(position);
			});
			this.map.fitBounds(bounds);
			// console.log('fitBounds');
		}
	}

	findNearStores(stores, position) {
		if (stores) {
			stores.forEach((store) => {
				store.distance = this.calculateDistance(store.latitude, store.longitude, position.lat(), position.lng(), 'K');
				store.visible = (store.cod_stato == window.userCountry || !window.userCountry) && store.distance <= MAX_DISTANCE /* Km */ ;
				if (store.visible) {
					if (store.removed) this.markerCluster.addMarker(store.marker);
					delete store.removed;
				} else {
					this.markerCluster.removeMarker(store.marker);
					store.removed = true;
				}
			});
			stores = stores.slice();
			stores.sort((a, b) => {
				return a.distance * (a.importante ? 0.5 : 1) - b.distance * (b.importante ? 0.5 : 1);
			});
			const visibleStores = stores.filter(store => store.visible).slice(0, 50);
			this.$timeout(() => {
				this.visibleStores = visibleStores;
			}, 1);
			// console.log('findNearStores', visibleStores);
			return visibleStores;
		}
	}

	searchPosition(position) {
		this.position = position;
		this.map.setCenter(position);
		this.map.setZoom(ZOOM_LEVEL);
		this.setInfoWindow(position, 1);
		return this.loadAllStores().then(stores => {
			const visibleStores = this.findNearStores(stores, position);
			/*
			if (visibleStores) {
				this.fitBounds(visibleStores);
			}
			*/
		});
	}

	panTo(store) {
		const position = new google.maps.LatLng(store.latitude, store.longitude);
		this.map.setZoom(ZOOM_LEVEL);
		this.map.panTo(position);
		const marker = this.markers.find(x => x.store === store);
		this.setMarkerWindow(marker.position, marker.content);
	}

	onSubmit() {
		this.error = null;
		this.busyFind = true;
		/*
		const fakeFilter = {
			'': {
				value: this.model.address,
				options: [
					{
						value: this.model.address,
						key: this.model.address
					}
				]
			}
		};
		GtmService.pageViewFilters(GTM_CAT, fakeFilter);
		*/
		const geocoder = this.geocoder || new google.maps.Geocoder();
		this.geocoder = geocoder;
		geocoder.geocode({ address: this.model.address }, (results, status) => {
			this.model = {};
			if (status == 'OK') {
				const position = results[0].geometry.location;
				// console.log('location', location);
				// const position = new google.maps.LatLng(location);
				this.searchPosition(position).finally(() => this.busyFind = false);
			} else {
				this.$timeout(() => {
					const message = 'Geocode was not successful for the following reason: ' + status;
					// console.log('StoreLocatorCtrl.onSubmit.error', message);
					this.error = { message };
					this.busyFind = false;
				});
			}
		});
	}

	setInfoWindow(position, mode) {
		if (SHOW_INFO_WINDOW) {
			const infoWindow = this.infoWindow || new google.maps.InfoWindow();
			this.infoWindow = infoWindow;
			infoWindow.setPosition(position);
			switch (mode) {
				case 1:
					infoWindow.setContent('Current location');
					break;
				case 2:
					infoWindow.setContent('Error: The Geolocation service failed.');
					break;
				default:
					infoWindow.setContent('Error: Your browser doesn\'t support geolocation.');
			}
			infoWindow.open(this.map);
		}
	}

	setMarkerWindow(position, content) {
		if (position) {
			const markerWindow = this.markerWindow || new google.maps.InfoWindow({
				pixelOffset: new google.maps.Size(0, -35)
			});
			this.markerWindow = markerWindow;
			markerWindow.setPosition(position);
			markerWindow.setContent(content);
			markerWindow.open(this.map);
		} else {
			if (this.markerWindow) {
				this.markerWindow.close();
			}
		}
	}

	scrollToStore(store) {
		const storesNode = document.querySelector('.section--stores');
		const storeNode = document.querySelector(`#store-${store.id}`);
		// console.log(storesNode, storeNode);
		storesNode.scrollTo(0, storeNode.offsetTop);
	}

	onScroll(event) {
		if (event.rect.top + event.rect.height < event.windowRect.bottom) {
			if (!this.busy && this.maxItems < this.stores.length) {
				this.$timeout(() => {
					this.busy = true;
					this.$timeout(() => {
						this.maxItems += ITEMS_PER_PAGE;
						this.visibleItems = this.stores.slice(0, this.maxItems);
						this.busy = false;
						// console.log(this.visibleItems.length);
					}, 1000);
				}, 0);
			}
		}
	}

}

StoreLocatorCtrl.$inject = ['$scope', '$timeout', 'DomService', 'ApiService'];

export default StoreLocatorCtrl;
