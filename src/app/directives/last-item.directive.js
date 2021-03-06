/* jshint esversion: 6 */


export class LastItemDirective {

	constructor(
		$timeout
	) {
		this.$timeout = $timeout;
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		if (scope.$last === true) {
			this.$timeout(() => {
				scope.$emit('lastItem', element);
			});
		}
	}

	static factory($timeout) {
		return new LastItemDirective($timeout);
	}

}

LastItemDirective.factory.$inject = ['$timeout'];
