/* jshint esversion: 6 */

import DomService from '../services/dom.service';

const VIRTUAL_SCROLL_ENABLED = false;

export default class VirtualScrollDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		if (!this.domService.agent.mobile && VIRTUAL_SCROLL_ENABLED) {
			const node = element[0];
			node.classList.add('virtual-scroll');
			DomService.DEFAULT_SCROLL_TARGET = node;
			const target = node.querySelector(attributes.virtualScroll);
			target.classList.add('virtual-scroll-target');
			if (node !== document.body) {
				document.querySelector('html').classList.add('virtual-scrolled');
			}
			const subscription = this.domService.virtualScroll$(attributes.virtualScroll).subscribe(top => {

			});
			element.on('$destroy', () => {
				subscription.unsubscribe();
			});
		}
	}

	static factory(DomService) {
		return new VirtualScrollDirective(DomService);
	}

}

VirtualScrollDirective.factory.$inject = ['DomService'];
