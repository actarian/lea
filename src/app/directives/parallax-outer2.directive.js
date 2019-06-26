/* jshint esversion: 6 */
/* global window, document, angular, Swiper, TweenMax, TimelineMax */

export default class ParallaxOuter2Directive {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		scope.$on('onCoverEnd', ($scope) => {
			const node = element[0];
			const section = this.getSection(node);
			const index = [].slice.call(section.querySelectorAll('[parallax-outer2]')).indexOf(node);
			// console.log('ParallaxOuter2Directive', node, index);
			this.animate(node, index);
		});
		element.on('$destroy', () => {
			this.clear(node, index);
		});
	}

	animate(node, index) {
		// console.log(node);
		const x = 0; // -35 + Math.floor(Math.random() * 3) * 35;
		const y = -35 + Math.floor(Math.random() * 3) * 35;
		TweenMax.to(node, 0.5, {
			x: x,
			y: y,
			delay: 2 + 0.1 * index,
			onComplete: () => {
				if (!node.destroyed) {
					this.animate(node, index);
				}
			}
		});
	}

	clear(node, index) {
		node.destroyed = true;
	}

	getSection(node) {
		let section = node.parentNode;
		let p = node;
		while (p) {
			p = p.parentNode;
			if (p && p.classList && p.classList.contains('section')) {
				section = p;
				p = null;
			}
		}
		return section;
	}

	static factory(DomService) {
		return new ParallaxOuter2Directive(DomService);
	}

}

ParallaxOuter2Directive.factory.$inject = ['DomService'];
