/* jshint esversion: 6 */

import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import DragListener from "../shared/drag.listener";

export default class ScrollableDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		const scrollable = attributes.scrollable !== undefined ? node.querySelector(attributes.scrollable) : null;
		const scrollableInner = attributes.scrollableInner !== undefined ? node.querySelector(attributes.scrollableInner) : null;
		const scrollableTrack = attributes.scrollableTrack !== undefined ? node.querySelector(attributes.scrollableTrack) : null;
		const scrollableThumb = attributes.scrollableThumb !== undefined ? node.querySelector(attributes.scrollableThumb) : null;
		if (scrollable && scrollableInner && scrollableTrack && scrollableThumb) {
			const subscription = this.scrollable$(node, scrollable, scrollableInner, scrollableTrack, scrollableThumb).subscribe(() => {

			});
			scope.$on('destroy', () => {
				// draglistener.destroy();
				subscription.unsubscribe();
			});
		}
	}

	scrollable$(node, scrollable, scrollableInner, scrollableTrack, scrollableThumb, friction = 10) {
		// const pow$ = new BehaviorSubject(0);
		const computedStyle = window.getComputedStyle(scrollableThumb);
		let pow = 0,
			down, move = 0,
			x = 0,
			target,
			offset = parseInt(computedStyle.left);
		const onMove = ($move) => {
			const width = scrollableTrack.offsetWidth - offset * 2;
			move = Math.max(0, Math.min(width, $move));
			TweenMax.set(scrollableThumb, { x: move });
			pow = move / width;
			// pow$.next(pow);
		};
		const onSnap = (swipe) => {
			/*
			const firstChild = scrollableInner.firstElementChild;
			const itemOuterWidth = this.domService.getOuterWidth(firstChild);
			const itemWidth = firstChild.offsetWidth;
			const gutter = itemOuterWidth - itemWidth;
			const newx = Math.round(-x / (itemWidth + gutter)) * (itemWidth + gutter);
			*/
			const children = [...scrollableInner.children];
			const newx = children.reduce((p, c, i) => {
				const prevLeft = x * -1;
				const currLeft = c.offsetLeft;
				const newDist = Math.abs(currLeft - prevLeft);
				const prevDist = Math.abs(p - prevLeft);
				if (newDist < prevDist) {
					return currLeft;
				} else {
					return p;
				}
			}, Number.POSITIVE_INFINITY);
			if (newx !== Number.POSITIVE_INFINITY) {
				const outerWidth = this.domService.getOuterWidth(scrollable);
				const innerWidth = scrollableInner.lastElementChild.offsetLeft + this.domService.getOuterWidth(scrollableInner.lastElementChild);
				let ePow = newx / (innerWidth - outerWidth);
				ePow = Math.max(0, Math.min(1, ePow));
				const item = { pow: pow };
				const width = scrollableTrack.offsetWidth - offset * 2;
				TweenMax.to(item, 0.5, {
					pow: ePow,
					onUpdate: () => {
						pow = item.pow;
						const width = scrollableTrack.offsetWidth - offset * 2;
						move = pow * width;
						TweenMax.set(scrollableThumb, { x: width * pow });
					},
					ease: Power2.easeInOut,
				});
			}
			// pow$.next(pow);
		};

		const draglistener = new DragListener(node, (e) => {
			// console.log('down', e);
			target = e.target;
			down = move;
			/*
			e.originalEvent.preventDefault();
			e.originalEvent.stopPropagation();
			e.originalEvent.stopImmediatePropagation();
			*/
		}, (e) => {
			// console.log('move', e);
			let distance = e.distance.x;
			// console.log(target === scrollableThumb);
			if (target !== scrollableThumb) {
				const width = scrollableTrack.offsetWidth - offset * 2;
				distance = -distance / scrollable.offsetWidth * width;
				if (window.innerWidth < 1024) {
					distance /= scrollableInner.children.length;
				}
				onMove(down + distance);
			} else {
				onMove(down + distance);
			}

		}, (e) => {
			// console.log('up', e.originalEvent);
			setTimeout(onSnap, 300);
			/*
			e.originalEvent.preventDefault();
			e.originalEvent.stopPropagation();
			e.originalEvent.stopImmediatePropagation();
			*/
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
				const outerWidth = this.domService.getOuterWidth(scrollable);
				const innerWidth = scrollableInner.lastElementChild.offsetLeft + this.domService.getOuterWidth(scrollableInner.lastElementChild);
				const endx = (outerWidth - innerWidth) * pow;
				let newx = x + (endx - x) / friction;
				newx = Math.round(newx * 1000) / 1000;
				if (x !== newx) {
					x = newx;
					// TweenMax.set(scrollableInner, { x: x });
					scrollableInner.style.transform = `translateX(${x}px)`;
					return x;
				} else {
					return null;
				}
			}),
			filter(x => x !== null),
			distinctUntilChanged((a, b) => Math.round(a * 100) === Math.round(b * 100)),
			shareReplay()
		);
	}

	static factory(DomService) {
		return new ScrollableDirective(DomService);
	}

}

ScrollableDirective.factory.$inject = ['DomService'];
