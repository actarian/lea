/* jshint esversion: 6 */


import Rect from '../shared/rect';

export default class HeaderDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'E';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		setTimeout(() => {
			this.init(scope, element, attributes, controller);
		}, 1);
		this.addListeners(node);
		scope.$on('destroy', () => {
			this.removeListeners(node);
		});
	}

	init(scope, element, attributes, controller) {
		const node = element[0];
		const brand = node.querySelector('.brand');
		const primary = [...node.querySelectorAll('.nav--primary > li')];
		const secondary = [...node.querySelectorAll('.nav--secondary > li')];
		const tertiary = [...node.querySelectorAll('.nav--tertiary > li')];
		const menus = [primary, secondary, tertiary];
		const scrollTop = this.domService.scrollTop;
		if (scrollTop === 0) {
			TweenMax.set(brand, { opacity: 0 });
			scope.$on('onCoverStart', ($scope) => {
				const rect = Rect.fromNode(brand);
				const x = (window.innerWidth - rect.width) / 2 - rect.left;
				const y = window.innerHeight / 2 - rect.top - 80;
				TweenMax.set(brand, {
					x: x,
					y: y,
					opacity: 1
				});
				TweenMax.to(brand, 0.65, {
					x: 0,
					y: 0,
					delay: 1.5,
					ease: Power2.easeInOut
				});
			});
			scope.$on('onCoverEnd', ($scope) => {
				menus.forEach((m, i) => {
					m.forEach((l, j) => {
						TweenMax.to(l, 0.45, {
							opacity: 1,
							delay: 1 + 0.2 * i + 0.1 * j,
							ease: Power2.easeInOut
						});
					});
				});
			});
		} else {
			TweenMax.set(brand, {
				opacity: 1
			});
			menus.forEach((m, i) => {
				m.forEach((l, j) => {
					TweenMax.set(l, {
						opacity: 1
					});
				});
			});
		}
	}

	onOver(event) {
		TweenMax.to(event.currentTarget, 0.3, {
			x: 15,
			ease: Power2.easeOut,
		});
	}

	onOut(event) {
		TweenMax.to(event.currentTarget, 0.3, {
			x: 0,
			ease: Power2.easeOut,
		});
	}

	addListeners(node) {
		const lis = [...node.querySelectorAll('.nav--submenu li > a, .nav--submenu li > span')];
		lis.forEach(li => {
			li.addEventListener('mouseover', this.onOver);
			li.addEventListener('mouseout', this.onOut);
		});
	}

	removeListeners(node) {
		const lis = [...node.querySelectorAll('.nav--submenu li > a, .nav--submenu li > span')];
		lis.forEach(li => {
			li.removeEventListener('mouseover', this.onOver);
			li.removeEventListener('mouseout', this.onOut);
		});
	}

	static factory(DomService) {
		return new HeaderDirective(DomService);
	}

}

HeaderDirective.factory.$inject = ['DomService'];
