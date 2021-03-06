/* jshint esversion: 6 */

import { combineLatest, fromEvent, merge, range, Subject } from 'rxjs';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { auditTime, distinctUntilChanged, filter, first, map, shareReplay, startWith, tap } from 'rxjs/operators';
import Rect from '../shared/rect';

export function tween(from, to, friction) {
	if (from === to || Math.abs(to - from) < 0.02) {
		return to;
	}
	return from + (to - from) / friction;
}

export default class DomService {

	constructor() {
		const hasPassiveEvents = () => {
			let has = false;
			try {
				const options = Object.defineProperty({}, 'passive', {
					get: function() {
						has = true;
					}
				});
				const noop = function() {};
				window.addEventListener('testPassiveEventSupport', noop, options);
				window.removeEventListener('testPassiveEventSupport', noop, options);
			} catch (e) {}
			return has;
		};
		this.hasPassiveEvents = hasPassiveEvents();
	}

	get ready() {
		return this.ready_;
	}

	set ready(ready) {
		this.ready_ = ready;
	}

	get scrollTop() {
		return DomService.getScrollTop(DomService.DEFAULT_SCROLL_TARGET);
	}

	get scrollLeft() {
		return DomService.getScrollLeft(DomService.DEFAULT_SCROLL_TARGET);
	}

	scrollTo(left, top) {
		DomService.DEFAULT_SCROLL_TARGET.scrollTo(0, top);
	}

	scroll(options) {
		DomService.DEFAULT_SCROLL_TARGET.scroll(options);
	}

	hasWebglSupport() {
		if (this.isIE()) {
			return false;
		}
		if (!this.hasWebgl()) {
			return false;
		}
		return true;
	}

	isIE() {
		const ua = window.navigator.userAgent;
		const msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}
		const trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			const rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}
		const edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}
		// other browser
		return false;
	}

	hasWebgl() {
		let gl, debugInfo, vendor, renderer, has = false;
		try {
			const canvas = document.createElement('canvas');
			if (!!window.WebGLRenderingContext) {
				gl = canvas.getContext('webgl', {
						failIfMajorPerformanceCaveat: true
					}) ||
					canvas.getContext('experimental-webgl', {
						failIfMajorPerformanceCaveat: true
					});
			}
		} catch (e) {
			console.log('no webgl');
		}
		if (gl) {
			debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
			vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
			renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
			has = true;
		}
		console.log(`WebGLCapabilities debugInfo: ${debugInfo} vendor: ${vendor} renderer: ${renderer} `);
		return has;
	}

	getOuterHeight(node) {
		let height = node.clientHeight;
		const computedStyle = window.getComputedStyle(node);
		height += parseInt(computedStyle.marginTop, 10);
		height += parseInt(computedStyle.marginBottom, 10);
		height += parseInt(computedStyle.borderTopWidth, 10);
		height += parseInt(computedStyle.borderBottomWidth, 10);
		return height;
	}

	getOuterWidth(node) {
		let width = node.clientWidth;
		const computedStyle = window.getComputedStyle(node);
		width += parseInt(computedStyle.marginLeft, 10);
		width += parseInt(computedStyle.marginRight, 10);
		width += parseInt(computedStyle.borderLeftWidth, 10);
		width += parseInt(computedStyle.borderRightWidth, 10);
		return width;
	}

	raf$() {
		return DomService.raf$;
	}

	windowRect$() {
		return DomService.windowRect$;
	}

	rafAndRect$() {
		return DomService.rafAndRect$;
	}

	scroll$() {
		return DomService.scroll$;
	}

	secondaryScroll$(target) {
		return DomService.secondaryScroll$(target);
	}

	scrollAndRect$() {
		return DomService.scrollAndRect$;
	}

	smoothScroll$(selector, friction = 6) {
		const target = document.querySelector('.smooth-scroll');
		const node = document.querySelector(selector);
		let down = false;
		return this.raf$().pipe(
			map(() => {
				// const outerHeight = this.getOuterHeight(node);
				const innerHeight = node.lastElementChild.offsetTop + node.lastElementChild.offsetHeight;
				if (parseInt(target.style.height) !== innerHeight) {
					target.style.height = `${innerHeight}px`;
				}
				const nodeTop = node.top || 0;
				const top = down || DomService.IMMEDIATE_SCROLL ? -this.scrollTop : tween(nodeTop, -this.scrollTop, (DomService.IMMEDIATE_SCROLL ? 1 : friction));
				const left = (node.parentNode.offsetWidth - node.offsetWidth) / 2;
				if (node.left !== left) {
					node.left = left;
					node.style.left = `${left}px`;
				}
				if (node.top !== top) {
					node.top = top;
					// node.style.transform = `translateX(-50%) translateY(${top}px)`;
					// node.style.top = `${top}px`;
					node.scrollTop = -top;
					// console.log(DomService.IMMEDIATE_SCROLL);
					DomService.IMMEDIATE_SCROLL = false;
					return top;
				} else {
					return null;
				}
			}),
			filter(y => y !== null),
			distinctUntilChanged((a, b) => Math.round(a * 100) === Math.round(b * 100)),
			tap(y => DomService.smoothScroll$_.next(y)),
			shareReplay()
		);
	}

	getStyleSheet() {
		for (let i = 0; i < document.styleSheets.length; i++) {
			const sheet = document.styleSheets[i];
			return sheet;
		}
	}

	virtualScroll$(selector, friction = 10) {
		const style = this.getStyleSheet();
		const ruleIndex = style.insertRule(`.virtual-scroll:after { content: ''; display:block; width: 100%; height: 1px; }`, style.cssRules.length);
		const rule = style.cssRules[ruleIndex];
		// console.log('rule', style.cssRules.length, rule.cssText);
		let outerHeight_ = 0;
		const node = document.querySelector(selector);
		node.addEventListener('wheel', (event) => {
			// console.log('wheel', event);
			this.scrollTo(0, this.scrollTop + event.deltaY);
		});
		let down = false;
		return this.raf$().pipe(
			map(() => {
				const outerHeight = this.getOuterHeight(node);
				if (outerHeight_ !== outerHeight) {
					outerHeight_ = outerHeight;
					rule.style.height = `${outerHeight_}px`;
					// console.log(rule.style.height);
				}
				const nodeTop = node.top || 0;
				const top = down ? -this.scrollTop : tween(nodeTop, -this.scrollTop, (DomService.IMMEDIATE_SCROLL ? 1 : friction));
				if (node.top !== top) {
					node.top = top;
					node.style.transform = `translateX(-50%) translateY(${top}px)`;
					// node.style = `position: fixed; top: 0; transform: translateX(-50%) translateY(${top}px)`;
					DomService.IMMEDIATE_SCROLL = false;
					return top;
				} else {
					return null;
				}
			}),
			filter(y => y !== null),
			distinctUntilChanged((a, b) => Math.round(a * 100) === Math.round(b * 100)),
			tap(y => DomService.virtualScroll$_.next(y)),
			shareReplay()
		);
	}

	rafIntersection$(node) {
		return this.rafAndRect$().pipe(
			map(datas => {
				// const scrollTop = datas[0];
				const windowRect = datas[1];
				const rect = Rect.fromNode(node);
				if (rect.height) {
					const intersection = rect.intersection(windowRect);
					const response = DomService.rafIntersection_;
					response.scroll = datas[0];
					response.windowRect = datas[1];
					response.rect = rect;
					response.intersection = intersection;
					return response;
				}
			}),
			filter(response => response !== undefined)
		);
	}

	scrollIntersection$(node) {
		const o = this.scrollAndRect$().pipe(
			map(datas => {
				// const scrollTop = datas[0];
				const windowRect = datas[1];
				const rect = Rect.fromNode(node);
				if (rect.height) {
					const intersection = rect.intersection(windowRect);
					const response = DomService.scrollIntersection_;
					response.scroll = datas[0];
					response.windowRect = datas[1];
					response.rect = rect;
					response.intersection = intersection;
					return response;
				}
			}),
			filter(response => response !== undefined)
		);
		DomService.secondaryScroll$_.next({ target: window });
		return o;
	}

	appearOnLoad$(node, value = 0.0) { // -0.5
		const isCover = node.hasAttribute('cover');
		return this.rafIntersection$(node).pipe(
			filter(x => (this.ready || isCover) && x.intersection.y > value && x.intersection.x > 0),
			first()
		);
	}

	appear$(node, value = 0.0) { // -0.5
		return this.rafIntersection$(node).pipe(
			filter(x => x.intersection.y > value),
			first()
		);
	}

	visibility$(node, value = 0.5) {
		return this.scrollIntersection$(node).pipe(
			map(x => x.intersection.y > value),
			distinctUntilChanged()
		);
	}

	firstVisibility$(node, value = 0.5) {
		return this.visibility$(node, value).pipe(
			filter(visible => visible),
			first()
		);
	}

	addCustomRules() {
		const sheet = this.addCustomSheet();
		const body = document.querySelector('body');
		const node = document.createElement('div');
		node.style.width = '100px';
		node.style.height = '100px';
		node.style.overflow = 'auto';
		node.style.visibility = 'hidden';
		node.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
		const inner = document.createElement('div');
		inner.style.width = 'auto';
		inner.style.height = '200px';
		node.appendChild(inner);
		body.appendChild(node);
		const scrollBarWidth = (node.offsetWidth - inner.offsetWidth);
		body.removeChild(node);
		/*
		const sheet = this.addCustomSheet();
		const body = document.querySelector('body');
		const scrollBarWidth = window.innerWidth - body.clientWidth;
		let rule = `body.droppin-in { padding-right: ${scrollBarWidth}px; }`;
		sheet.insertRule(rule, 0);
		rule = `body.droppin-in header { width: calc(100% - ${scrollBarWidth}px); }`;
		sheet.insertRule(rule, 1);
		rule = `body.droppin-in menu--product { width: calc(100% - ${scrollBarWidth}px); }`;
		sheet.insertRule(rule, 2);
		*/
	}

	addCustomSheet() {
		const style = document.createElement('style');
		style.appendChild(document.createTextNode(''));
		document.head.appendChild(style);
		return style.sheet;
	}

	isDescendantOf(node, target) {
		return DomService.isDescendantOf(node, target);
	}

	get agent() {
		return DomService.agent || DomService.detect();
	}

	static factory() {
		return new DomService();
	}

	static getScrollTop(node) {
		if (!node) {
			return 0;
		}
		if (node === document || node === window) {
			return this.getScrollTop(document.scrollingElement || document.documentElement || document.body);
		}
		return node.pageYOffset || node.scrollY || node.scrollTop || 0;
	}

	static getScrollLeft(node) {
		if (!node) {
			return 0;
		}
		if (node === document || node === window) {
			return this.getScrollLeft(document.scrollingElement || document.documentElement || document.body);
		}
		return node.pageXOffset || node.scrollX || node.scrollLeft || 0;
	}

	static detect() {
		const userAgent = navigator.userAgent.toLowerCase();
		const msie = userAgent.indexOf('msie') > -1;
		const trident = userAgent.indexOf('trident') > -1;
		const explorer = msie || trident;
		const firefox = userAgent.indexOf('firefox') > -1;
		const opera = userAgent.toLowerCase().indexOf('op') > -1;
		let chrome = userAgent.indexOf('chrome') > -1;
		let safari = userAgent.indexOf('safari') > -1;
		if ((chrome) && (safari)) {
			safari = false;
		}
		if ((chrome) && (opera)) {
			chrome = false;
		}
		const android = userAgent.match(/android/i);
		const blackberry = userAgent.match(/blackberry/i);
		const ios = userAgent.match(/iphone|ipad|ipod/i);
		const operamini = userAgent.match(/opera mini/i);
		const iemobile = userAgent.match(/iemobile/i) || navigator.userAgent.match(/wpdesktop/i);
		const mobile = android || blackberry || ios || operamini || iemobile;
		const overscroll = navigator.platform === 'MacIntel' && typeof navigator.getBattery === 'function';
		const agent = this.agent = {
			chrome,
			msie,
			trident,
			explorer,
			firefox,
			safari,
			opera,
			android,
			blackberry,
			ios,
			operamini,
			iemobile,
			mobile,
			overscroll,
		};
		// Object.assign(DomService, agent);
		const html = document.querySelector('html');
		Object.keys(agent).forEach(x => {
			if (agent[x]) {
				html.classList.add(x);
			}
		});
		return this.agent;
	}

	static isDescendantOf(node, target) {
		if (node === document) {
			return false;
		}
		if (node === target) {
			return true;
		} else if (node.parentNode) {
			return this.isDescendantOf(node.parentNode, target);
		}
	}

	static secondaryScroll$(target) {
		return fromEvent(target, 'scroll').pipe(
			tap(event => DomService.secondaryScroll$_.next(event))
		);
	}

}

DomService.IMMEDIATE_SCROLL = true;
DomService.DEFAULT_SCROLL_TARGET = window;
DomService.factory.$inject = [];
DomService.rafIntersection_ = {};
DomService.scrollIntersection_ = {};
DomService.raf$ = range(0, Number.POSITIVE_INFINITY, animationFrame);
DomService.windowRect$ = function() {
	const windowRect = new Rect({
		width: window.innerWidth,
		height: window.innerHeight
	});
	return fromEvent(window, 'resize').pipe(
		map(originalEvent => {
			windowRect.width = window.innerWidth;
			windowRect.height = window.innerHeight;
			return windowRect;
		}),
		startWith(windowRect),
		shareReplay()
	);
}();
DomService.rafAndRect$ = combineLatest(DomService.raf$, DomService.windowRect$).pipe(
	shareReplay()
);
DomService.mainScroll$ = function() {
	const target = DomService.DEFAULT_SCROLL_TARGET;
	return fromEvent(target, 'scroll').pipe(
		shareReplay()
	);
}();
DomService.smoothScroll$_ = new Subject();
DomService.virtualScroll$_ = new Subject();
DomService.secondaryScroll$_ = new Subject();
DomService.scroll$ = function() {
	const target = DomService.DEFAULT_SCROLL_TARGET;
	let previousTop = DomService.getScrollTop(target);
	const event = {
		scrollTop: previousTop,
		scrollLeft: DomService.getScrollLeft(target),
		direction: 0,
		originalEvent: null,
	};
	return merge(DomService.smoothScroll$_, DomService.secondaryScroll$_).pipe(
		auditTime(1000 / 60),
		map((originalEvent) => {
			event.scrollTop = DomService.getScrollTop(originalEvent.target);
			event.scrollLeft = DomService.getScrollLeft(originalEvent.target);
			const diff = event.scrollTop - previousTop;
			event.direction = diff ? diff / Math.abs(diff) : 0;
			previousTop = event.scrollTop;
			event.originalEvent = originalEvent;
			return event;
		}),
		startWith(event),
		shareReplay()
	);
}();
DomService.scrollAndRect$ = combineLatest(DomService.scroll$, DomService.windowRect$).pipe(
	shareReplay()
);
