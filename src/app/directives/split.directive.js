/* jshint esversion: 6 */

// Import Polyfills
// See: https://github.com/w3c/IntersectionObserver/tree/master/polyfill
// import 'intersection-observer';

// import Splitting from "splitting";

export default class SplitDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		node.setAttribute('data-title', node.innerHTML);
		const section = this.getSection(node);
		const index = [].slice.call(section.querySelectorAll('[title]')).indexOf(node);
		const subscription = this.domService.appearOnLoad$(node, -0.5).subscribe(event => {
			const timeout = index * 100;
			setTimeout(() => {
				// node.classList.add('titled');
				this.animate(node);
			}, timeout);
		});
		element.on('$destroy', () => {
			subscription.unsubscribe();
		});
	}

	animate(node) {
		const splitting = Splitting({
			target: node,
			by: 'lines',
			key: null
		})[0];
		// console.log('words', splitting.words);
		const tweens = splitting.words.map(word => {
			const line = getComputedStyle(word).getPropertyValue('--line-index');
			TweenMax.set(word, {
				x: -node.offsetWidth,
			});
			return TweenMax.to(word, 0.9, {
				x: 0,
				delay: 0.5 + 0.2 * line,
				ease: Power2.easeInOut,
			});
		});
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
		return new SplitDirective(DomService);
	}

}

SplitDirective.factory.$inject = ['DomService'];
