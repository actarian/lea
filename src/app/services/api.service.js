/* jshint esversion: 6 */

import { from } from 'rxjs';

const STATIC = window.location.port === '9966' || window.location.href.indexOf('actarian.github.io/lea/') !== -1;
const API_HREF = STATIC ? 'https://leaconcorde.wslabs.it' : '';

export default class ApiService {

	constructor($http) {
		this.http = $http;
		const api = {
			advancedSearch: {
				get: () => {
					return from($http.get('data/advanced-search.json'));
					// return from($http.get(API_HREF + '/api/advanced-search/json'));
				},
			},
			wishlist: {
				get: () => {
					return from($http.get('data/moodboard.json'));
				},
				toggle: (item) => {
					item.added = !item.added;
					return Promise.resolve(item);
				},
				clearAll: () => {
					return Promise.resolve();
				},
			},
			moodboard: {
				filter: (filters) => {
					// return from($http.post(API_HREF + '/api/moodboard/json', filters));
					return from($http.get('data/moodboard.json'));
				},
			},
			storeLocator: {
				all: () => {
					if (STATIC) {
						return $http.get('data/store-locator.json');
					} else {
						return $http.post('/ws/wsUsers.asmx/StoreList', {});
					}
				},
			},
		};
		Object.assign(this, api);
	}

	static factory($http) {
		return new ApiService($http);
	}

}

ApiService.factory.$inject = ['$http'];
