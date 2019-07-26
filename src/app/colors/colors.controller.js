/* jshint esversion: 6 */

import Rect from "../shared/rect";

class ColorsCtrl {

	constructor(
		$scope,
		$timeout
	) {
		this.$scope = $scope;
		this.$timeout = $timeout;

		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener('resize', this.onWindowResize);
		$scope.$on('$destroy', () => {
			window.removeEventListener('resize', this.onWindowResize);
		});
	}

	onWindowResize() {
		const colors = [...document.querySelectorAll('.group--colors > .card--color')];
		/*
		colors.forEach((x, i) => {
			TweenMax.set(x, { marginBottom: 0, height: 'auto' });
		});
		*/
		if (this.active !== undefined) {
			const color = colors[this.active];
			const detail = color.querySelector('.card__detail');
			if (detail) {
				TweenMax.set(detail, { height: 'auto' });
				const rect = Rect.fromNode(detail);
				TweenMax.set(detail, { left: -color.offsetLeft, height: rect.height });
			}
		}
	}

	onToggle(active) {
		if (this.active === active) {
			this.onClose();
			this.active = undefined;
		} else {
			this.active = active;
			this.onOpen();
		}
	}

	onOpen() {
		const colors = [...document.querySelectorAll('.group--colors > .card--color')];
		colors.forEach((x, i) => {
			if (i === this.active) {
				x.classList.add('active');
			} else {
				x.classList.remove('active');
				TweenMax.set(x, { marginBottom: 0, height: 'auto' });
			}
		});
		const color = colors[this.active];
		const detail = color.querySelector('.card__detail');
		if (detail) {
			TweenMax.set(detail, { height: 'auto' });
			const rect = Rect.fromNode(detail);
			TweenMax.set(detail, { left: -color.offsetLeft, height: 0, overflow: 'hidden', zIndex: -1 });
			color.scrollIntoView();
			const from = { value: 0 };
			TweenMax.to(from, 0.6, {
				value: 1,
				overwrite: 'all',
				ease: Power2.easeInOut,
				onUpdate: () => {
					TweenMax.set(color, { marginBottom: rect.height * from.value });
					TweenMax.set(detail, { height: rect.height * from.value });
				},
				onComplete: () => {
					TweenMax.set(detail, { zIndex: 1 });
				}
			});
		}
	}

	onClose() {
		const colors = [...document.querySelectorAll('.group--colors > .card--color')];
		colors.forEach((x, i) => {
			if (i === this.active) {
				x.classList.add('active');
			} else {
				x.classList.remove('active');
				TweenMax.set(x, { marginBottom: 0, height: 'auto' });
			}
		});
		const color = colors[this.active];
		const detail = color.querySelector('.card__detail');
		if (detail) {
			TweenMax.set(detail, { height: 'auto' });
			const rect = Rect.fromNode(detail);
			TweenMax.set(detail, { left: -color.offsetLeft, height: rect.height, overflow: 'hidden', zIndex: -1 });
			const from = { value: 1 };
			TweenMax.to(from, 0.6, {
				value: 0,
				overwrite: 'all',
				ease: Power2.easeInOut,
				onUpdate: () => {
					TweenMax.set(color, { marginBottom: rect.height * from.value });
					TweenMax.set(detail, { height: rect.height * from.value });
				},
				onComplete: () => {
					color.classList.remove('active');
				}
			});
		}
	}

}

ColorsCtrl.$inject = ['$scope', '$location', '$timeout', '$http', 'StateService'];

export default ColorsCtrl;
