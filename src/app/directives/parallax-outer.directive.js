/* jshint esversion: 6 */
/* global window, document, angular, Swiper, TweenMax, TimelineMax */

import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import Rect from '../shared/rect';

let i = 0;

export default class ParallaxOuterDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		node.top = 0;
		// const childNode = node.querySelector('img, video');
		// if (childNode) {
		const style = window.getComputedStyle(node);
		const position = style.position;
		const parallax = (parseInt(attributes.parallaxOuter) || 5) * 2;
		const subscription = this.parallax$(node, parallax, i).subscribe(top => {
			if (node.top !== top) {
				node.top += (top - node.top) / 10;
			}
			node.setAttribute('style', `transform: translateY(${node.top}%);`);
		});
		element.on('$destroy', () => {
			subscription.unsubscribe();
		});
		// }
		i++;
	}

	units(value, decimals = 4) {
		const pow = Math.pow(10, decimals) / 10;
		return Math.round(value * pow) / pow;
	}

	parallax$(node, parallax, i) {
		return this.domService.rafAndRect$().pipe(
			map(datas => {
				const windowRect = datas[1];
				const rect = Rect.fromNode(node);
				const intersection = rect.intersection(windowRect);
				if (intersection.y > 0) {
					return Math.min(1, Math.max(-1, intersection.center.y)); // intersection.center.y;
				} else {
					return null;
				}
			}),
			filter(y => y !== null && this.domService.ready),
			distinctUntilChanged(),
			map(y => {
				const direction = i % 2 === 0 ? 1 : -1;
				const p = y * parallax * direction;
				return this.units(p);
			})
		);
	}

	static factory(DomService) {
		return new ParallaxOuterDirective(DomService);
	}

}

ParallaxOuterDirective.factory.$inject = ['DomService'];
