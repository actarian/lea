/* jshint esversion: 6 */

import Rect from '../shared/rect';

let first = true;

export default class HeroDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		// console.log('HeroDirective');
		setTimeout(() => {
			this.init(scope, element, attributes, controller);
		}, 1);
	}

	init(scope, element, attributes, controller) {
		const node = element[0];
		const cover = node.querySelector('.picture--cover');
		if ((cover != null && cover.length) && first && (document.body.scrollTop || document.documentElement.scrollTop) === 0) {
			first = false;
			scope.$root.$broadcast('onCoverInit');
			// const brand = document.querySelector('.section--header .brand');
			cover.classList.add('appeared');
			// TweenMax.set(brand, { opacity: 0 });
			TweenMax.set(cover, { opacity: 0 });
			const img = node.querySelector('img');
			if (img) {
				img.onload = () => {
					this.onLoad(scope, cover);
				};
				img.src = img.src;
			} else {
				this.onLoad(scope, cover);
			}
		} else {
			scope.$root.$broadcast('onCoverEnd');
		}
	}

	onLoad(scope, cover) {
		// this.animateBrand(brand);
		setTimeout(() => {
			scope.$root.$broadcast('onCoverStart');
			this.animateCover(cover, () => {
				scope.$root.$broadcast('onCoverEnd');
			});
		}, 100);
	}

	/*
	animateBrand(node) {
		const rect = Rect.fromNode(node);
		const x = (window.innerWidth - rect.width) / 2 - rect.left;
		const y = window.innerHeight / 2 - rect.bottom - 40;
		TweenMax.set(node, {
			x: x,
			y: y,
			opacity: 1
		});
		TweenMax.to(node, 0.65, {
			x: 0,
			y: 0,
			delay: 1.5,
			ease: Power2.easeInOut
		});
	}
	*/

	animateCover(node, callback) {
		const rect = Rect.fromNode(node);
		const x = (window.innerWidth - rect.width) / 2 - rect.left;
		const y = window.innerHeight / 2 - rect.top + 40 - rect.height * 0.25;
		// console.log('pos', x, y, window.innerWidth, rect.width);
		TweenMax.set(node, {
			x: x,
			y: y,
			scaleX: 0.5,
			scaleY: 0.5,
			opacity: 1
		});
		TweenMax.to(node, 0.5, {
			x: 0,
			y: 0,
			scaleX: 1,
			scaleY: 1,
			delay: 1.5,
			ease: Power2.easeInOut,
			onComplete: () => {
				if (typeof callback === 'function') {
					callback();
				}
			}
		});
	}

	static factory(DomService) {
		return new HeroDirective(DomService);
	}

}

HeroDirective.factory.$inject = ['DomService'];
