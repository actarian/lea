/* jshint esversion: 6 */


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class RootCtrl {

	constructor(
		$scope,
		$timeout,
		DomService,
		ApiService,
		WishlistService
	) {
		this.$scope = $scope;
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
		this.$timeout(() => {
			this.init = true;
			const view = document.querySelector('.view');
			TweenMax.set(view, { opacity: 1 });
		}, 1);
		this.$scope.$on('onCoverEnd', (scope) => {
			this.$timeout(() => {
				this.ready = true;
				this.domService.ready = true;
				/*
				TweenMax.to(view, 0.6, {
					opacity: 1,
					delay: 0,
					overwrite: 'all'
				});
				*/
			}, 100);
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
		console.log('RootCtrl.onPrimaryDroppedOut', node, dropdown);
		if (dropdown === this.primary) {
			document.querySelector('body').classList.remove('droppin-in');
			document.querySelector('.section--header').classList.remove('opened');
		}
	}

	onSecondaryDroppedIn(node, dropdown) {
		console.log('RootCtrl.onSecondaryDroppedIn', node, dropdown);
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
		// console.log(event.scroll.direction, event.intersection);
		const scrolled = event.scroll.scrollTop > 40;
		if (this.scrolled !== scrolled || this.direction !== event.scroll.direction) {
			this.$timeout(() => {
				this.scrolled = scrolled;
				this.direction = event.scroll.direction;
			});
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
		if (this.droppinIn) {
			classes['droppin-in'] = true;
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

RootCtrl.$inject = ['$scope', '$timeout', 'DomService', 'ApiService', 'WishlistService'];

export default RootCtrl;
