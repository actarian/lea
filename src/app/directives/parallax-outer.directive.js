/* jshint esversion: 6 */

import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import Rect from '../shared/rect';

function tween(from, to, friction) {
	if (from === to || Math.abs(to - from) < 0.02) {
		return to;
	}
	return from + (to - from) / friction;
}

const mx = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
	// const x = e.clientX / window.innerWidth * 2 - 1;
	// const y = e.clientY / window.innerHeight * 2 - 1;
	mx.x = e.clientX;
	mx.y = e.clientY;
});

let i = 0;

export default class ParallaxOuterDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		scope.$on('onCoverEnd', ($scope) => {
			this.init(scope, element, attributes, controller);
		});
	}

	init(scope, element, attributes, controller) {
		const node = element[0];
		node.top = 0;
		node.rx = 0;
		node.ry = 0;
		// const childNode = node.querySelector('img, video');
		// if (childNode) {
		const style = window.getComputedStyle(node);
		const position = style.position;
		const parallax = (parseInt(attributes.parallaxOuter) || 5) * 2;
		const subscription = this.parallax$(node, parallax, i).subscribe(top => {
			/*
			node.top = tween(node.top, top, 10);
			if (node.top !== top) {
				node.setAttribute('style', `transform: translateY(${node.top}%);`);
			}
			*/
			this.parallaxAndSkew(node, node.rect, top);
		});
		element.on('$destroy', () => {
			subscription.unsubscribe();
		});
		// }
		i++;
	}

	parallaxAndSkew(node, rect, top) {
		node.rect = rect;
		const angle = 300 / rect.width;
		const maxAngle = 300 / rect.width;
		const dx = (mx.x - rect.center.x);
		const dy = (mx.y - rect.center.y);
		let ex, ey;
		if (Math.abs(dx) < rect.width * 0.6 && Math.abs(dy) < rect.height * 0.6) {
			ey = Math.min(maxAngle, Math.max(-maxAngle, angle * 2 * dx / rect.width));
			ex = Math.min(maxAngle, Math.max(-maxAngle, -angle * dy / rect.height));
		} else {
			ey = 0;
			ex = 0;
		}
		node.top = tween(node.top, top, 10);
		node.rx = tween(node.rx, ex, 20);
		node.ry = tween(node.ry, ey, 20);
		if (node.top !== top || node.rx !== ex || node.ry !== ey) {
			// console.log(node.top, top, node.rx, ex, node.ry, ey);
			node.setAttribute('style', `transform: translateY(${node.top}%) rotateX(${node.rx}deg) rotateY(${node.ry}deg);`);
		}
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
				this.parallaxAndSkew(node, rect, 0);
				return null;
			}),
			filter(y => y !== null && this.domService.ready),
			distinctUntilChanged(),
			map(y => 0)
		);
	}

	parallax$___(node, parallax, i) {
		return this.domService.rafAndRect$().pipe(
			map(datas => {
				const windowRect = datas[1];
				const rect = Rect.fromNode(node);
				this.parallaxAndSkew(node, rect, node.top);
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
