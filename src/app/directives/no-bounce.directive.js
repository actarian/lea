/* jshint esversion: 6 */

export default class NoBounceDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {

		// Stores the Y position where the touch started
		let startY = 0;

		// Store enabled status
		let enabled = false;

		const supportsPassiveOption = this.supportPassiveOption();

		const handleTouchmove = function(event) {
			// Get the element that was scrolled upon
			let node = event.target;

			// Allow zooming
			var zoom = window.innerWidth / window.document.documentElement.clientWidth;
			if (event.touches.length > 1 || zoom !== 1) {
				return;
			}

			// Check all parent nodes for scrollability
			while (node !== document.body && node !== document) {
				// Get some style properties
				var style = window.getComputedStyle(node);

				if (!style) {
					// If we've encountered an node we can't compute the style for, get out
					break;
				}

				// Ignore range input node
				if (node.nodeName === 'INPUT' && node.getAttribute('type') === 'range') {
					return;
				}

				var scrolling = style.getPropertyValue('-webkit-overflow-scrolling');
				var overflowY = style.getPropertyValue('overflow-y');
				var height = parseInt(style.getPropertyValue('height'), 10);

				// Determine if the node should scroll
				var isScrollable = scrolling === 'touch' && (overflowY === 'auto' || overflowY === 'scroll');
				var canScroll = node.scrollHeight > node.offsetHeight;

				if (isScrollable && canScroll) {
					// Get the current Y position of the touch
					var curY = event.touches ? event.touches[0].screenY : event.screenY;

					// Determine if the user is trying to scroll past the top or bottom
					// In this case, the window will bounce, so we have to prevent scrolling completely
					var isAtTop = (startY <= curY && node.scrollTop === 0);
					var isAtBottom = (startY >= curY && node.scrollHeight - node.scrollTop === height);

					// Stop a bounce bug when at the bottom or top of the scrollable node
					if (isAtTop || isAtBottom) {
						event.preventDefault();
					}

					// No need to continue up the DOM, we've done our job
					return;
				}

				// Test the next parent
				node = node.parentNode;
			}

			// Stop the bouncing -- no parents are scrollable
			event.preventDefault();
		};

		const handleTouchstart = function(event) {
			// Store the first Y position of the touch
			startY = event.touches ? event.touches[0].screenY : event.screenY;
		};

		const enable = function() {
			// Listen to a couple key touch events
			window.addEventListener('touchstart', handleTouchstart, supportsPassiveOption ? { passive: false } : false);
			window.addEventListener('touchmove', handleTouchmove, supportsPassiveOption ? { passive: false } : false);
			enabled = true;
		};

		const disable = function() {
			// Stop listening
			window.removeEventListener('touchstart', handleTouchstart, false);
			window.removeEventListener('touchmove', handleTouchmove, false);
			enabled = false;
		};

		const isEnabled = function() {
			return enabled;
		};

		const supportSmoothScroll = this.supportSmoothScroll();
		if (supportSmoothScroll) {
			// enable();
		}

		// console.log('supportsPassiveOption', supportsPassiveOption, 'supportSmoothScroll', supportSmoothScroll);

	}

	supportPassiveOption() {
		let supportsPassiveOption = false;
		try {
			var opts = Object.defineProperty({}, 'passive', {
				get: function() {
					supportsPassiveOption = true;
				}
			});
			window.addEventListener('test', null, opts);
		} catch (e) {}
		return supportsPassiveOption;
	}

	supportSmoothScroll() {
		// Enable by default if the browser supports -webkit-overflow-scrolling
		// Test this by setting the property with JavaScript on an node that exists in the DOM
		// Then, see if the property is reflected in the computed style
		const testDiv = document.createElement('div');
		document.documentElement.appendChild(testDiv);
		testDiv.style.WebkitOverflowScrolling = 'touch';
		const supportSmoothScroll = 'getComputedStyle' in window && window.getComputedStyle(testDiv)['-webkit-overflow-scrolling'] === 'touch';
		document.documentElement.removeChild(testDiv);
		return supportSmoothScroll;
	}

	static factory(DomService) {
		return new NoBounceDirective(DomService);
	}

}

NoBounceDirective.factory.$inject = ['DomService'];
