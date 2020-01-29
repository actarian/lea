/* jshint esversion: 6 */

export default class FaqDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const abstract = node.querySelector('.abstract');
		const content = node.querySelector('.content');
		const more = node.querySelector('.btn--discover');
		TweenMax.set(content, { height: 0 });
		const onAbstractClicked = () => {
			if (node.classList.contains('active')) {
				node.classList.remove('active');
				if (more) more.classList.remove('active');
				TweenMax.to(content, 0.7, {
					height: 0,
					ease: Power2.easeInOut,
					onComplete: () => {
						// content.removeAttribute('style');
					}
				});
			} else {
				node.classList.add('active');
				TweenMax.set(content, { height: 'auto' });
				const height = content.offsetHeight;
				TweenMax.set(content, { height: 0 });
				TweenMax.to(content, 0.7, {
					height: height,
					ease: Power2.easeInOut,
					onComplete: () => {
						content.removeAttribute('style');
					}
				});
			}
		};
		const onMoreClicked = () => {
			if (more.classList.contains('active')) {
				more.classList.remove('active');
			} else {
				more.classList.add('active');
			}
		};
		const addListeners = () => {
			abstract.addEventListener('click', onAbstractClicked);
			// more.addEventListener('click', onMoreClicked);
		};
		const removeListeners = () => {
			abstract.removeEventListener('click', onAbstractClicked);
			// more.removeEventListener('click', onMoreClicked);
		};
		addListeners();
		scope.$on('destroy', () => {
			removeListeners();
		});
	}

	static factory(DomService) {
		return new FaqDirective(DomService);
	}

}

FaqDirective.factory.$inject = ['DomService'];
