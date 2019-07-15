/* jshint esversion: 6 */


export default class HasDropdownDirective {

	constructor(
		$timeout
	) {
		this.$timeout = $timeout;
		this.restrict = 'A';
		this.scope = false;
	}

	link(scope, element, attributes, controller) {
		const node = element[0];
		let opened_ = null;
		// const consumer = attributes.hasDropdownConsumer !== undefined ? scope.$eval(attributes.hasDropdownConsumer) : null;
		const trigger = attributes.hasDropdown !== '' ? node.querySelector(attributes.hasDropdown) : node;
		const onClick = (event) => {
			if (opened_ === null) {
				openDropdown();
			} else if (trigger !== node) {
				closeDropdown(true);
			}
		};
		const onDocumentClick = (event) => {
			const clickedInside = node === event.target || node.contains(event.target);
			if (!clickedInside) {
				closeDropdown();
			}
		};
		const openDropdown = () => {
			if (opened_ === null) {
				opened_ = true;
				addDocumentListeners();
				scope.$root.$broadcast('onDroppedIn', node);
				const callback = attributes.droppedIn !== undefined ? scope.$eval(attributes.droppedIn) : () => {};
				callback(node, node.querySelector('[dropdown]'));
			}
		};
		const closeDropdown = () => {
			if (opened_ !== null) {
				opened_ = null;
				removeDocumentListeners();
				scope.$root.$broadcast('onDroppedOut', node);
				const callback = attributes.droppedOut !== undefined ? scope.$eval(attributes.droppedOut) : () => {};
				callback(node, node.querySelector('[dropdown]'));
			}
		};
		scope.$on('onDroppedOut', ($scope, $node) => {
			if ($node === node) {
				node.classList.remove('opened');
			}
		});
		scope.$on('onDroppedIn', ($scope, $node) => {
			const opened = $node === node || node.contains($node);
			if (opened) {
				node.classList.add('opened');
			} else {
				node.classList.remove('opened');
			}
		});
		scope.$on('onCloseDropdown', closeDropdown);
		scope.$on('onNavigateOut', closeDropdown);
		scope.$on('onNavigationTransitionIn', closeDropdown);
		const addListeners = () => {
			trigger.addEventListener('click', onClick);
		};
		const addDocumentListeners = () => {
			document.addEventListener('click', onDocumentClick);
		};
		const removeListeners = () => {
			trigger.removeEventListener('click', onClick);
		};
		const removeDocumentListeners = () => {
			document.removeEventListener('click', onDocumentClick);
		};
		addListeners();
		element.on('$destroy', () => {
			removeListeners();
			removeDocumentListeners();
		});
	}

	static factory($timeout) {
		return new HasDropdownDirective($timeout);
	}

}

HasDropdownDirective.dropDownUid = 0;

HasDropdownDirective.factory.$inject = ['$timeout'];
