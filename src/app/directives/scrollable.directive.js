/* jshint esversion: 6 */

import { filter, map, shareReplay } from 'rxjs/operators';
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
			const subscription = this.scroll$(node, scrollable, scrollableInner, scrollableTrack, scrollableThumb).subscribe(() => {

			});
			scope.$on('destroy', () => {
				// draglistener.destroy();
				subscription.unsubscribe();
			});
		}
	}

	scroll$(node, scrollable, scrollableInner, scrollableTrack, scrollableThumb, friction = 10) {

		// const pow$ = new BehaviorSubject(0);
		let pow = 0,
			down, move = 0,
			x = 0,
			target,
			offset = parseInt(scrollableThumb.offsetLeft);
		const onMove = ($move) => {
			const width = scrollableTrack.offsetWidth - offset * 2;
			move = Math.max(0, Math.min(width, $move));
			TweenMax.set(scrollableThumb, { x: move });
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
			// console.log(target === scrollableThumb);
			if (target !== scrollableThumb) {
				const width = scrollableTrack.offsetWidth - offset * 2;
				distance = -distance / scrollable.offsetWidth * width;
			}
			onMove(down + distance);
		}, (e) => {
			// console.log('up', e);
		});

		node.addEventListener('mousewheel', (e) => {
			const direction = e.deltaY / Math.abs(e.deltaY);
			if (direction < 0 && pow > 0 || direction > 0 && pow < 1) {
				e.stopPropagation();
				e.preventDefault();
				onMove(move + direction * 100);
			}
		}, this.domService.hasPassiveEvents ? { passive: false } : false);

		return this.domService.raf$().pipe(
			map(() => {
				const outerWidth = this.domService.getOuterWidth(scrollable);
				const innerWidth = scrollableInner.lastElementChild.offsetLeft + this.domService.getOuterWidth(scrollableInner.lastElementChild);
				const endx = (outerWidth - innerWidth) * pow;
				const newx = x + (endx - x) / friction;
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
			shareReplay()
		);
	}

	static factory(DomService) {
		return new ScrollableDirective(DomService);
	}

}

ScrollableDirective.factory.$inject = ['DomService'];
