/* jshint esversion: 6 */

export class MuuriDirective {

	constructor() {
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		scope.$on('lastItem', (slide) => {
			// console.log('MuuriDirective.lastItem', slide);
			this.onMuuri(scope, element, attributes);
		});
		setTimeout(() => {
			this.onMuuri(scope, element, attributes);
		}, 1);
		element.on('$destroy', () => {
			if (element.muuri) {
				element.muuri.destroy();
			}
			window.removeEventListener('resize', element.onResize);
			if (element.onLoad) {
				// window.removeEventListener('load', element.onLoad);
				const images = [...node.querySelectorAll('img')];
				images.forEach(x => {
					x.onload = null;
				});
			}
		});
	}

	onMuuri(scope, element, attributes) {
		const node = element[0];
		if (element.muuri) {
			// const items = scope.$eval(attributes.muuri);
			const previousItems = element.muuri.getItems().map(x => x.getElement());
			// console.log('MuuriDirective.previousItems', previousItems);
			const items = [...node.querySelectorAll('.listing__item')];
			// console.log('MuuriDirective.newItems', items);
			const newItems = items.filter(x => previousItems.indexOf(x) === -1);
			const removeItems = previousItems.filter(x => items.indexOf(x) === -1);
			element.muuri.remove(removeItems);
			element.muuri.add(newItems);
			element.onResize();
			// element.muuri.refreshItems(items).layout();
		} else {
			// The layout data object. Muuri will read this data and position the items
			// based on it.
			/*
			const layout = {
				// The layout's item slots (left/top coordinates).
				slots: [],
				// The layout's total width.
				width: 0,
				// The layout's total height.
				height: 0,
				// Should Muuri set the grid's width after layout?
				setWidth: false,
				// Should Muuri set the grid's height after layout?
				setHeight: true
			};
			*/
			element.muuri = new Muuri(element[0], {
				layoutDuration: 0, // 400
				layoutEasing: 'ease',
				layout: {
					fillGaps: true,
					horizontal: false,
					alignRight: false,
					alignBottom: false,
					rounding: false
				},
				/*
				sortData: {
					order: function(item, element) {
						const style = window.getComputedStyle(element);
						console.log(style.order);
						return 100 - style.order;
					},
				}
				*/
				/*
				layout: function(items, gridWidth, gridHeight) {
					console.log(items, gridWidth, gridHeight);
					// Calculate the slots.
					let x = 0,
						y = 0,
						w = 0,
						h = 0;
					layout.slots.length = 0;
					for (let i = 0; i < items.length; i++) {
						const item = items[i];
						x += w;
						y += h;
						const m = item.getMargin();
						w = item.getWidth() + m.left + m.right;
						h = item.getHeight() + m.top + m.bottom;
						layout.slots.push(x, y);
					}
					// Calculate the layout's total width and height.
					layout.width = x + w;
					layout.height = y + h;
					return layout;
				}
				*/
			});
			element.onLoad = () => {
				element.muuri.refreshItems().layout();
			};
			// window.addEventListener('load', element.onLoad);
			const images = [...node.querySelectorAll('img')];
			images.forEach(x => {
				x.onload = element.onLoad;
			});
			element.addClass('muuri-init');
			element.onResize = () => {
				return this.onResize(element);
			};
			element.onResize();
			window.addEventListener('resize', element.onResize);
		}
	}

	onResize(element) {
		// element.muuri.refreshSortData();
		// element.muuri.sort('order');
		element.muuri.sort((itemA, itemB) => {
			console.log(itemA);
			const styleA = window.getComputedStyle(itemA._element);
			const styleB = window.getComputedStyle(itemB._element);
			return (styleA.order || itemA._id) - (styleB.order || itemB._id);
		});
	}

	static factory() {
		return new MuuriDirective();
	}

}

MuuriDirective.factory.$inject = [];
