/* jshint esversion: 6 */

import Highway from '@dogstudio/highway';
import GtmService from '../gtm/gtm.service';

let first = true,
	destroyFirst = true;

export default class CustomRenderer extends Highway.Renderer {

	update() {
		document.title = this.properties.page.title;
		GtmService.pageView();
		const page = this.properties.page;
		/*
		const body = page.querySelector('body');
		let brand = /(["'])(\\?.)*?\1/.exec(body.getAttribute('ng-init') || '');
		brand = brand ? brand[0].replace(/\'/g, '') : 'lea';
		const $timeout = CustomRenderer.$timeout;
		$timeout(() => {
			const scope = CustomRenderer.scope;
			scope.root.brand = brand;
		});
		*/
	}

	// This method in the renderer is run when the data-router-view is added to the DOM Tree.
	onEnter() {
		// console.log('onEnter');
		if (!first) {
			const $timeout = CustomRenderer.$timeout;
			$timeout(() => {
				const $compile = CustomRenderer.$compile;
				const view = [...document.querySelectorAll('.view')].pop();
				const element = angular.element(view.childNodes);
				const $scope = element.scope();
				$scope.root.menuOpened = false;
				$scope.root.menuProductOpened = false;
				const $newScope = $scope.$new();
				const content = $compile(element)($newScope);
				CustomRenderer.$newScope = $newScope;
				CustomRenderer.content = content;
				element.on('$destroy', (event) => {
					console.log('.view -> $destroy', event);
				});
			});
		}
	}

	// This method in the renderer is run when transition to hide the data-router-view is called.
	onLeave() {
		// console.log('onLeave', first);
		if (first) {
			first = false;
			const view = [...document.querySelectorAll('.view')].shift();
			const element = angular.element(view.childNodes);
			element.on('$destroy', (event) => {
				console.log('.view -> $destroy', event);
			});
		}
	}

	// This method in the renderer is run when the transition to display the data-router-view is done.
	onEnterCompleted() {
		// console.log('onEnterCompleted');
	}

	// This method in the renderer is run when the data-router-view is removed from the DOM Tree.
	onLeaveCompleted() {
		// console.log('onLeaveCompleted');
	}

	static $destroy(from) {
		// console.log('CustomRenderer.destroy', destroyFirst, this.content, this.$newScope);
		if (CustomRenderer.scope && CustomRenderer.scope.$root && CustomRenderer.scope.$root.first) {
			CustomRenderer.$timeout(() => {
				CustomRenderer.scope.$root.first = null;
			});
		} else {
			if (this.content && this.content.parentNode) {
				this.content.parentNode.removeChild(this.content);
				this.content = null;
			}
			if (this.$newScope) {
				this.$newScope.$destroy();
				this.$newScope = null;
			}
			if (from.parentNode) {
				from.parentNode.removeChild(from);
			}
		}
	}

	static collectScopes(scope, scopes) {
		scopes = scopes || [];
		if (scope) {
			let child = scope && scope.$$childHead;
			while (child) {
				scopes.push(child);
				scopes = this.collectScopes(child, scopes);
				child = child.$$nextSibling;
			}
		}
		return scopes;
	}

}
