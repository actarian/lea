/* jshint esversion: 6 */

export default class ShareDirective {

	constructor(
		$timeout
	) {
		this.$timeout = $timeout;
		this.restrict = 'A';
		this.template = (element, attributes) => {
			let template = `
			<div class="btn btn--facebook" ng-click="onFacebook()">
				<svg class="icon icon--facebook"><use xlink:href="#icon--facebook"></use></svg>
			</div>
			<div class="btn btn--twitter" ng-click="onTwitter()">
				<svg class="icon icon--twitter"><use xlink:href="#icon--twitter"></use></svg>
			</div>
			<div class="btn btn--pinterest" ng-click="onPinterest()">
				<svg class="icon icon--pinterest"><use xlink:href="#icon--pinterest"></use></svg>
			</div>`;
			if (attributes.shareToggle !== undefined) {
				template += `
				<div class="btn btn--remove">
					<svg class="icon icon--remove"><use xlink:href="#icon--remove"></use></svg>
				</div>`
			}
			return template;
		};
		this.scope = {
			item: '=?share',
		};
	}

	link(scope, element, attributes, controller) {
		scope.item = scope.item || {};
		const node = element[0];
		const img = node.querySelector('img');
		let pageSrc = scope.item.src;
		let pageTitle = scope.item.title || document.title;
		if (img) {
			pageSrc = img.src;
			pageTitle = img.title || pageTitle;
		}
		const pageUrl = scope.item.url || `${window.location.href}?imageId=${scope.item.id}`;
		scope.onFacebook = (event) => {
			// console.log('ShareDirective.onFacebook', event);
			const url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
			window.open(url, 'facebookShareWindow', `height=450, width=550, top=${window.innerHeight / 2 - 275}, left=${window.innerWidth / 2 - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
			// event.preventDefault();
		};
		scope.onTwitter = (event) => {
			// console.log('ShareDirective.onTwitter', event);
			const url = `https://twitter.com/intent/tweet?url=${pageUrl}&via=LeaCeramiche&text=${pageTitle}`;
			window.open(url, 'twitterShareWindow', `height=450, width=550, top=${window.innerHeight / 2 - 275}, left=${window.innerWidth / 2 - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
			// event.preventDefault();
		};
		scope.onPinterest = () => {
			const pin = {
				url: pageUrl,
				media: pageSrc,
				description: pageTitle,
			};
			// console.log('ShareDirective.onPin', pin);
			PinUtils.pinOne(pin);
		};
		element.on('$destroy', () => {});
	}

	static factory($timeout) {
		return new ShareDirective($timeout);
	}

}

ShareDirective.factory.$inject = ['$timeout'];
