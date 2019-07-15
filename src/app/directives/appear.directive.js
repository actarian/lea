/* jshint esversion: 6 */


// Import Polyfills
// See: https://github.com/w3c/IntersectionObserver/tree/master/polyfill
// import 'intersection-observer';

export default class AppearDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const section = this.getSection(node);
		const index = [].slice.call(section.querySelectorAll('[appear]')).indexOf(node);
		const subscription = this.domService.appearOnLoad$(node, -0.5).subscribe(event => { // -0.05
			// console.log(event.rect.top);
			/*
			const rect = event.rect;
			const x = rect.left;
			const y = 0; // event.rect.top;
			const index = Math.floor(y / 320) * Math.floor(window.innerWidth / 320) + Math.floor(x / 320);
			*/
			const timeout = index * 100;
			setTimeout(() => {
				node.classList.add('appeared');
			}, timeout); // (i - firstVisibleIndex));
			/*
			if (index > 0) {
				setTimeout(() => {
					node.classList.add('appeared');
				}, timeout); // (i - firstVisibleIndex));
			} else {
				node.classList.add('appeared');
			}
			*/
		});
		const img = node.querySelector('img');
		if (img) {
			img.setAttribute('ondragstart', 'return false;');
		}
		element.on('$destroy', () => {
			subscription.unsubscribe();
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
		return new AppearDirective(DomService);
	}

}

AppearDirective.factory.$inject = ['DomService'];
