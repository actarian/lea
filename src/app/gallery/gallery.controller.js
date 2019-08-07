/* jshint esversion: 6 */

import { GALLERY_TYPES } from '../directives/gallery-item.directive';
// import Rect from '../shared/rect';

class GalleryCtrl {

	constructor(
		$scope,
		$timeout,
		$element
	) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.$element = $element;
		this.types = GALLERY_TYPES;
		const node = $element[0];
		TweenMax.set(node, {
			// opacity: 0,
			// overflow: 'hidden',
			height: 0
		});
		TweenMax.to(node, 0.6, {
			// opacity: 1,
			height: '100%',
			delay: 0.1,
			ease: Power2.easeInOut,
			onComplete: () => {
				node.setAttribute('style', '');
				setTimeout(() => {
					// video ???
					/*
					const items = [...node.querySelectorAll('.picture')];
					const item = items[$scope.$root.galleryIndex];
					// console.log(items, item, $scope.$root.galleryIndex);
					if (item) {
						const rect = Rect.fromNode(item);
						node.scrollTo(0, rect.top - 70);
					}
					*/
				}, 1500);
			}
		});
	}

	onClose() {
		const node = this.$element[0];
		TweenMax.set(node, {
			// opacity: 1,
			// overflow: 'hidden',
			height: '100%'
		});
		TweenMax.to(node, 0.6, {
			// opacity: 0,
			height: 0,
			delay: 0.1,
			ease: Power2.easeInOut,
			onComplete: () => {
				this.$timeout(() => {
					this.$scope.$root.gallery = null;
				});
			}
		});
	}

}

GalleryCtrl.$inject = ['$scope', '$timeout', '$element'];

export default GalleryCtrl;
