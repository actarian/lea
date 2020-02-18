/* jshint esversion: 6 */

import { filter, map, shareReplay } from 'rxjs/operators';
import DragListener from "../shared/drag.listener";

export default class SliderDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const slider = attributes.slider !== undefined ? node.querySelector(attributes.slider) : null;
		const sliderInner = attributes.sliderInner !== undefined ? node.querySelector(attributes.sliderInner) : null;
		const sliderLeft = attributes.sliderLeft !== undefined ? node.querySelector(attributes.sliderLeft) : null;
		const sliderRight = attributes.sliderRight !== undefined ? node.querySelector(attributes.sliderRight) : null;
		const sliderBullets = attributes.sliderBullets !== undefined ? node.querySelector(attributes.sliderBullets) : null;
		let index = 0,
			slides = 1,
			outerWidth = 1,
			innerWidth = 1,
			itemWidth = 1,
			itemOuterWidth = 1,
			gutter = 0,
			x_ = 0;
		const toggleStates = () => {
			const first = index === 0;
			const last = index === slides - 1;
			if (first) {
				sliderLeft.classList.add('disabled');
			} else {
				sliderLeft.classList.remove('disabled');
			}
			if (last) {
				sliderRight.classList.add('disabled');
			} else {
				sliderRight.classList.remove('disabled');
			}
			if (sliderBullets) {
				Array.from(sliderBullets.children).forEach((x, i) => {
					if (i === index) {
						x.classList.add('active');
					} else {
						x.classList.remove('active');
					}
				});
			}
		};
		const slideToIndex = (index) => {
			const x = -(outerWidth + gutter) * index;
			if (x_ !== x) {
				const distance = Math.abs(x_ - x);
				const time = Math.min(1.4, distance / (outerWidth + gutter) * 0.7);
				x_ = x;
				// console.log(outerWidth, innerWidth, slides, index);
				TweenMax.to(sliderInner, time, {
					x: x,
					ease: Power2.easeInOut,
					onComplete: () => {
						toggleStates();
					}
				});
			} else {
				toggleStates();
			}
		};
		const onResize = (event) => {
			const firstChild = sliderInner.firstElementChild;
			itemOuterWidth = this.domService.getOuterWidth(firstChild); // this.domService.getOuterWidth(sliderInner.lastElementChild);
			itemWidth = firstChild.offsetWidth;
			gutter = itemOuterWidth - itemWidth;
			innerWidth = sliderInner.lastElementChild.offsetLeft + itemWidth;
			outerWidth = this.domService.getOuterWidth(slider);
			slides = Math.ceil(innerWidth / (outerWidth + gutter));
			index = Math.max(0, Math.min(slides - 1, index));
			// console.log('itemWidth', itemWidth, itemOuterWidth);
			if (sliderBullets) {
				while (sliderBullets.childElementCount > slides) {
					sliderBullets.removeChild(sliderBullets.firstElementChild);
				}
				while (sliderBullets.childElementCount < slides) {
					const div = document.createElement('div');
					sliderBullets.appendChild(div);
				}
			}
			slideToIndex(index);
		};
		const onLeft = (event) => {
			index = Math.max(0, index - 1);
			slideToIndex(index);
		};
		const onRight = (event) => {
			index = Math.min(slides - 1, index + 1);
			slideToIndex(index);
		};
		const onBullet = (event) => {
			index = Array.from(sliderBullets.children).indexOf(event.target);
			slideToIndex(index);
		};
		const onSnap = () => {
			const children = [...sliderInner.children];
			const newIndex = children.reduce((p, c, i) => {
				const x = x_ * -1;
				const prevLeft = children[index].offsetLeft;
				const currLeft = c.offsetLeft;
				const newDist = Math.abs(currLeft - x);
				const prevDist = Math.abs(prevLeft - x);
				if (newDist < prevDist) {
					return i;
				} else {
					return p;
				}
			}, index);
			index = newIndex;
			slideToIndex(newIndex);
		};
		let down;
		const draglistener = new DragListener(node, (e) => {
			down = x_;
		}, (e) => {
			if (window.innerWidth < 1024 && down !== undefined && Math.abs(e.distance.x) > Math.abs(e.distance.y)) {
				const x = e.distance.x;
				x_ = down + x;
				TweenMax.set(sliderInner, { x: x_ });
			}
		}, (e) => {
			down = undefined;
			if (window.innerWidth < 1024) {
				onSnap();
			}
		});
		const addListeners = () => {
			window.addEventListener('resize', onResize);
			sliderLeft.addEventListener('click', onLeft);
			sliderRight.addEventListener('click', onRight);
			if (sliderBullets) {
				sliderBullets.addEventListener('click', onBullet);
			}
		};
		const removeListeners = () => {
			window.removeEventListener('resize', onResize);
			sliderLeft.removeEventListener('click', onLeft);
			sliderRight.removeEventListener('click', onRight);
			if (sliderBullets) {
				sliderBullets.removeEventListener('click', onBullet);
			}
		};
		if (slider && sliderInner && sliderLeft && sliderRight) {
			addListeners();
			onResize();
			/*
			const subscription = this.slider$(node, slider, sliderInner, sliderLeft, sliderRight).subscribe(() => {

			});
			*/
			scope.$on('destroy', () => {
				removeListeners();
				draglistener.destroy();
				// subscription.unsubscribe();
			});
		}
	}

	slider$(node, slider, sliderInner, sliderLeft, sliderRight, friction = 10) {
		// const pow$ = new BehaviorSubject(0);
		let pow = 0,
			down, move = 0,
			x = 0,
			target,
			offset = parseInt(sliderRight.offsetLeft);
		const onMove = ($move) => {
			console.log('onMove', $move);
			const width = sliderLeft.offsetWidth - offset * 2;
			move = Math.max(0, Math.min(width, $move));
			TweenMax.set(sliderRight, { x: move });
			pow = move / width;
			// pow$.next(pow);
		};

		const draglistener = new DragListener(node, (e) => {
			// console.log('down', e);
			target = e.target;
			down = move;
		}, (e) => {
			// console.log('move', e);
			let distance = e.distance.x;
			// console.log(target === sliderRight);
			if (target !== sliderRight) {
				const width = sliderLeft.offsetWidth - offset * 2;
				distance = -distance / slider.offsetWidth * width;
				if (window.innerWidth < 1024) {
					distance /= sliderInner.children.length;
				}
			}
			onMove(down + distance);
		}, (e) => {
			// console.log('up', e.originalEvent);
		});

		/*
		node.addEventListener('mousewheel', (e) => {
			const direction = e.deltaY / Math.abs(e.deltaY);
			if (direction < 0 && pow > 0 || direction > 0 && pow < 1) {
				e.stopPropagation();
				e.preventDefault();
				onMove(move + direction * 100);
			}
		}, this.domService.hasPassiveEvents ? { passive: false } : false);
		*/

		return this.domService.raf$().pipe(
			map(() => {
				const outerWidth = this.domService.getOuterWidth(slider);
				const innerWidth = sliderInner.lastElementChild.offsetLeft + this.domService.getOuterWidth(sliderInner.lastElementChild);
				const endx = (outerWidth - innerWidth) * pow;
				let newx = x + (endx - x) / friction;
				newx = Math.round(newx * 1000) / 1000;
				if (x !== newx) {
					x = newx;
					// TweenMax.set(sliderInner, { x: x });
					sliderInner.style.transform = `translateX(${x}px)`;
					return x;
				} else {
					return null;
				}
			}),
			filter(x => x !== null),
			shareReplay()
		);
	}

	static factory(DomService) {
		return new SliderDirective(DomService);
	}

}

SliderDirective.factory.$inject = ['DomService'];
