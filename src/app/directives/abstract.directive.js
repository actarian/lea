/* jshint esversion: 6 */

export default class AbstractDirective {

	constructor() {
		this.restrict = 'A';
		this.scope = {
			item: '=?abstract',
		};
	}

	link(scope, element, attributes, controller) {
		scope.item = scope.item || { top: 0.5, left: 0.5 };
		const node = element[0];
		node.setAttribute('style', `left: ${scope.item.left * 100}%; top: ${scope.item.top * 100}%;`);
		element.on('$destroy', () => {});
	}

	static factory() {
		return new AbstractDirective();
	}

}

AbstractDirective.factory.$inject = [];
