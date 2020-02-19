/* jshint esversion: 6 */

import DomService from '../services/dom.service';
import Rect from '../shared/rect';

class ColorsCtrl {

	constructor(
		$scope,
		$timeout,
		$location,
		DomService
	) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.$location = $location;
		this.domService = DomService;
		this.onWindowResize = this.onWindowResize.bind(this);
		window.addEventListener('resize', this.onWindowResize);
		$scope.$on('$destroy', () => {
			window.removeEventListener('resize', this.onWindowResize);
		});
		const search = this.$location.search();
		// console.log(search);
		if (search.color) {
			window.onload = () => {
				setTimeout(() => {
					const color = document.getElementById(`color-${search.color}`);
					// console.log(color);
					if (color) {
						const colors = [...document.querySelectorAll('.card--color')];
						const index = colors.indexOf(color);
						if (index !== -1) {
							this.active = index;
							this.onOpen(color, true);
						}
						// color.scrollIntoView();
						// this.scrollIntoView(color);
					}
				}, 150);
			}
		}
	}

	scrollIntoView(node) {
		const curtop = (document.body.scrollTop || document.documentElement.scrollTop);
		const top = curtop + node.getBoundingClientRect().top;
		/*
		if (node.offsetParent) {
			do {
				curtop += node.offsetTop;
			} while (node = node.offsetParent);
		}
		*/
		window.scroll(0, top);
		// console.log('scroll-into-view', top);
		DomService.IMMEDIATE_SCROLL = true;
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

	onToggle(active, event) {
		if (this.active === active) {
			return;
			/*
			const colors = [...document.querySelectorAll('.group--colors > .card--color')];
			const color = colors[this.active];
			const detail = color.querySelector('.card__detail');
			if (event.target.classList.contains('btn') || (event.target.parentNode && event.target.parentNode.classList.contains('btn')) || DomService.isDescendantOf(event.target, detail)) {
				return;
			}
			this.onClose();
			this.active = undefined;
			*/
		} else {
			this.active = active;
			// console.log(event.target, event.currentTarget);
			this.onOpen(event.currentTarget);
		}
	}

	onOpen(node, immediate) {
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
			// color.scrollIntoView();
			this.scrollIntoView(color);
			if (immediate) {
				TweenMax.set(color, { marginBottom: rect.height });
				TweenMax.set(detail, { height: rect.height, zIndex: 1 });
			} else {
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
		if (node.id) {
			const search = {};
			const splitted = node.id.split('-');
			search[splitted[0]] = splitted.length > 1 ? splitted[1] : undefined;
			this.$location.search(splitted[0], splitted[1]).replace();
			// console.log(node.id, node);
		}
	}

	onClose(immediate) {
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
			if (immediate) {
				TweenMax.set(color, { marginBottom: 0 });
				TweenMax.set(detail, { height: 0 });
				color.classList.remove('active');
			} else {
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

}

ColorsCtrl.$inject = ['$scope', '$timeout', '$location', 'DomService'];

export default ColorsCtrl;
