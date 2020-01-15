/* jshint esversion: 6 */

const SMOOTH_SCROLL_ENABLED = true;

export default class SmoothScrollDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		if (!this.domService.agent.mobile && !this.domService.agent.explorer && SMOOTH_SCROLL_ENABLED) {
			const node = element[0];
			node.classList.add('smooth-scroll');
			const target = node.querySelector(attributes.smoothScroll);
			target.classList.add('smooth-scroll-target');
			if (node !== document.body) {
				document.querySelector('html').classList.add('smooth-scrolled');
			}
			const subscription = this.domService.smoothScroll$(attributes.smoothScroll).subscribe(top => {

			});
			scope.$on('$destroy', () => {
				subscription.unsubscribe();
			});
		}
	}

	static factory(DomService) {
		return new SmoothScrollDirective(DomService);
	}

}

SmoothScrollDirective.factory.$inject = ['DomService'];
