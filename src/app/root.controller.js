﻿/* jshint esversion: 6 */

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class RootCtrl {

	constructor(
		$scope,
		$element,
		$timeout,
		DomService,
		ApiService,
		WishlistService
	) {
		this.$scope = $scope;
		this.$element = $element;
		this.$timeout = $timeout;
		this.domService = DomService;
		this.apiService = ApiService;
		this.wishlistService = WishlistService;
		DomService.addCustomRules();
		this.unsubscribe = new Subject();
		this.wishlistService.count$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(count => {
			this.wishlistCount = count;
		});
		this.loadingAnimation();
		this.onPrimaryDroppedIn = this.onPrimaryDroppedIn.bind(this);
		this.onPrimaryDroppedOut = this.onPrimaryDroppedOut.bind(this);
		this.onSecondaryDroppedIn = this.onSecondaryDroppedIn.bind(this);
		this.onScroll = this.onScroll.bind(this);
		// $scope.$on('onDroppinIn', this.onDroppingIn.bind(this));
		$scope.$on('destroy', () => {
			// console.log('destroy');
			this.unsubscribe.next();
			this.unsubscribe.complete();
		});
	}

	loadingAnimation() {
		this.init = true;
		setTimeout(() => {
			const view = document.querySelector('.view');
			TweenMax.set(view, { opacity: 1 });
			this.setClasses();
		}, 1);
		/*
		this.$timeout(() => {

		}, 1);
		*/
		this.$scope.$on('onCoverEnd', (scope) => {
			setTimeout(() => {
				this.ready = true;
				this.domService.ready = true;
				this.setClasses();
			}, 100);
			/*
			this.$timeout(() => {
				this.ready = true;
				this.domService.ready = true;
			}, 100);
			*/
		});
	}

	onPrimaryDroppedIn(node, dropdown) {
		// console.log('RootCtrl.onPrimaryDroppedIn', node, dropdown);
		this.primary = dropdown;
		document.querySelector('body').classList.add('droppin-in');
		document.querySelector('.section--header').classList.add('opened');
		/*
		TweenMax.set(dropdown, { width: 0, overflow: 'hidden' });
		TweenMax.to(dropdown, 0.8, {
			width: '100%',
			ease: Power2.easeInOut,
			overwrite: 'all',
			onComplete: () => {
				delete node.style.overflow;
				TweenMax.set(node, { width: '100%' });

			}
		});
		*/
		const items = [...dropdown.querySelectorAll('li')].filter(x => x.parentNode === dropdown);
		TweenMax.set(items, { opacity: 0 });
		items.forEach((x, i) => {
			const s = x.querySelector('a, span');
			TweenMax.set(s, { x: '-100%', transition: 'none' });
			TweenMax.to(x, 0.8, {
				opacity: 1,
				delay: 0.1 + 0.08 * i,
				ease: Power2.easeInOut,
				onUpdate: () => {
					TweenMax.set(s, { x: `${(1 - x.style.opacity) * -100}%` });
				},
				onComplete: () => {
					s.removeAttribute('style');
				}
			});
		});
	}

	onPrimaryDroppedOut(node, dropdown) {
		// console.log('RootCtrl.onPrimaryDroppedOut', node, dropdown);
		if (dropdown === this.primary) {
			document.querySelector('body').classList.remove('droppin-in');
			document.querySelector('.section--header').classList.remove('opened');
		}
	}

	onSecondaryDroppedIn(node, dropdown) {
		// console.log('RootCtrl.onSecondaryDroppedIn', node, dropdown);
		/*
		TweenMax.set(dropdown, { width: 0, overflow: 'hidden' });
		TweenMax.to(dropdown, 0.8, {
			width: '100%',
			ease: Power2.easeInOut,
			overwrite: 'all',
			onComplete: () => {
				delete node.style.overflow;
				TweenMax.set(node, { width: '100%' });
			}
		});
		*/
		const items = [...dropdown.querySelectorAll('li')].filter(x => x.parentNode === dropdown);
		TweenMax.set(items, { opacity: 0 });
		items.forEach((x, i) => {
			const s = x.querySelector('a, span');
			TweenMax.set(s, { x: '-100%', transition: 'none' });
			TweenMax.to(x, 0.8, {
				opacity: 1,
				delay: 0.1 + 0.08 * i,
				ease: Power2.easeInOut,
				overwrite: 'all',
				onUpdate: () => {
					TweenMax.set(s, { x: `${(1 - x.style.opacity) * -100}%` });
				},
				onComplete: () => {
					s.removeAttribute('style');
				}
			});
		});
	}

	onScroll(event) {
		const scrolled = event.scroll.scrollTop > 40;
		if (this.scrolled !== scrolled || this.direction !== event.scroll.direction) {
			this.scrolled = scrolled;
			this.direction = event.scroll.direction;
			this.setClasses();
			/*
			this.$timeout(() => {
				this.scrolled = scrolled;
				this.direction = event.scroll.direction;
			});
			*/
		}
	}

	setClasses() {
		const node = this.$element[0];
		if (this.init) {
			node.classList.add('init');
		} else {
			node.classList.remove('init');
		}
		if (this.ready) {
			node.classList.add('ready');
		} else {
			node.classList.remove('ready');
		}
		if (this.scrolled) {
			node.classList.add('scrolled');
		} else {
			node.classList.remove('scrolled');
		}
		if (this.direction === -1) {
			node.classList.add('scrolled-up');
		} else {
			node.classList.remove('scrolled-up');
		}
		if (this.direction === 1) {
			node.classList.add('scrolled-down');
		} else {
			node.classList.remove('scrolled-down');
		}
	}

	getClasses() {
		const classes = {};
		if (this.init) {
			classes.init = true;
		}
		if (this.ready) {
			classes.ready = true;
		}
		if (this.direction === -1) {
			classes['scrolled-up'] = true;
		}
		if (this.direction === 1) {
			classes['scrolled-down'] = true;
		}
		return classes;
	}

	pad(index) {
		return index < 10 ? '0' + index : index;
	}

	hasHash(hash) {
		return window.location.hash.indexOf(hash) !== -1;
	}

}

RootCtrl.$inject = ['$scope', '$element', '$timeout', 'DomService', 'ApiService', 'WishlistService'];

export default RootCtrl;
