/* jshint esversion: 6 */

export default class AbstractDirective {

	constructor() {
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		node.setAttribute('data-abstract', node.innerHTML);
	}

	static factory() {
		return new AbstractDirective();
	}

}

AbstractDirective.factory.$inject = [];
