/* jshint esversion: 6 */

export const GALLERY_TYPES = Object.freeze({
	PICTURE: 0,
	VIDEO: 1,
});

export default class GalleryItemDirective {

	constructor(
		$timeout,
		DomService
	) {
		this.$timeout = $timeout;
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		if (node.classList.contains('gallery__item--gallery')) {
			return;
		}
		const onClick = (event) => {
			// Rivisto comportamento gallery: ora apre le immagini si aprono con Flexbox
			return;

			const items = [...document.querySelectorAll('[gallery-item]:not(.gallery__item--gallery)')];
			const index = items.indexOf(node);
			const hero = document.querySelector('[hero]');
			const title = hero.querySelector('.title');
			const abstract = hero.querySelector('.abstract');
			const data = {
				title: title ? title.getAttribute('data-title') : '',
				abstract: abstract ? abstract.getAttribute('data-abstract') : '',
				url: window.location.href,
				items: items.map(x => {
					let item = x.getAttribute('gallery-item');
					// console.log('item', item);
					item = item.trim() !== '' ? JSON.parse(item) : {};
					const type = x.querySelector('video') ? GALLERY_TYPES.VIDEO : GALLERY_TYPES.PICTURE;
					const media = type === GALLERY_TYPES.PICTURE ? x.querySelector('img') : x.querySelector('video');
					item.type = type;
					item.title = media.getAttribute('title');
					item.src = media.getAttribute('src');
					if (type === GALLERY_TYPES.VIDEO) {
						item.cover = media.getAttribute('cover');
					}
					return item;
				})
			};
			this.$timeout(() => {
				scope.$root.gallery = data;
				scope.$root.galleryIndex = index;
				// console.log('GalleryItemDirective', data, index, items, node);
			});
		};
		node.addEventListener('click', onClick);
		scope.$on('destroy', () => {
			node.removeEventListener('click', onClick);
		});
	}

	static factory($timeout, DomService) {
		return new GalleryItemDirective($timeout, DomService);
	}

}

GalleryItemDirective.factory.$inject = ['$timeout', 'DomService'];
