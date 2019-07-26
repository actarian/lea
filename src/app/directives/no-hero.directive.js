/* jshint esversion: 6 */

export default class NoHeroDirective {

	constructor(
		DomService
	) {
		this.domService = DomService;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		// console.log('NoHeroDirective');
		setTimeout(() => {
			this.init(scope, element, attributes, controller);
		}, 1);
	}

	init(scope, element, attributes, controller) {
		scope.$root.$broadcast('onCoverEnd');
	}

	static factory(DomService) {
		return new NoHeroDirective(DomService);
	}

}

NoHeroDirective.factory.$inject = ['DomService'];
