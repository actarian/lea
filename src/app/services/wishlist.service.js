/* jshint esversion: 6 */

import { BehaviorSubject, from } from "rxjs";

const key = 'pwishList';

export default class WishlistService {

	constructor(
		$http,
		PromiseService,
		//StorageService,
		ApiService
	) {
		this.$http = $http;
		this.promise = PromiseService;
		//this.storage = StorageService;
		this.api = ApiService;
		this.count$ = WishlistService.count$;
		// const count = this.wishlist.length;
		// console.log('WishlistService', this.storage);
	}

	get wishlist() {
		if (!this.wishlist_) {
			//const wishlist = this.storage.get('wishlist');
			//this.wishlist_ = wishlist || [];

			this.wishlist_ = [];
			var str = document.cookie.match(new RegExp("(^|; )" + key + "=([^;]+)"));
			if (str) {
				this.wishlist_ = str[2].match(/([0-9 ]+)/g);
			}

			WishlistService.count$.next(this.wishlist_.length);
		}
		return this.wishlist_;
	}

	set wishlist(wishlist) {
		this.wishlist_ = wishlist || [];
		//this.storage.set('wishlist', this.wishlist_);

		var dt = new Date();
		dt.setDate(dt.getDate() + 30);
		document.cookie = key + '=' + this.wishlist_.join(',') + '; path=/; expires=' + dt.toUTCString();

		WishlistService.count$.next(this.wishlist_.length);
	}

	/*
	indexOf(item) {
		const index = this.wishlist.reduce((p, c, i) => {
			if (p === -1) {
				return c.id* === item.id && c.coId === item.coId ? i : p;
			} else {
				return p;
			}
		}, -1);
		return index;
	}
	*/

	has(item) {
		return this.wishlist.indexOf(item) !== -1;
	}

	add(item) {
		return this.promise.make((promise) => {
			if (!this.has(item)) {
				const wishlist = this.wishlist;
				wishlist.push( /*{ id: item.id, coId: item.coId }*/ item);
				this.wishlist = wishlist;
				promise.resolve(true);
			}
		});
	}

	remove(item) {
		return this.promise.make((promise) => {
			const index = this.wishlist.indexOf(item);
			if (index !== -1) {
				const wishlist = this.wishlist;
				wishlist.splice(index, 1);
				this.wishlist = wishlist;
			}
			promise.resolve(false);
		});
	}

	toggle(item) {
		if (this.has(item)) {
			return this.remove(item);
		} else {
			return this.add(item);
		}
	}

	clearAll() {
		return from(this.promise.make((promise) => {
			const wishlist = [];
			this.wishlist = wishlist;
			promise.resolve(wishlist);
		}));
	}

	get() {
		return from(this.$http.get('data/moodboard.json').then(success => {
			if (success.data) {
				this.wishlist = success.data;
			}
			return success;
		}));
	}

	static factory($http, PromiseService, /*StorageService,*/ ApiService) {
		return new WishlistService($http, PromiseService, /*StorageService,*/ ApiService);
	}

}

WishlistService.count$ = new BehaviorSubject(0);

WishlistService.factory.$inject = ['$http', 'PromiseService', /*'LocalStorageService',*/ 'ApiService'];
