/* jshint esversion: 6 */

export default class MediaDirective {

	constructor(
		$timeout,
		WishlistService
	) {
		this.$timeout = $timeout;
		this.wishlistService = WishlistService;
		this.restrict = 'A';
		this.transclude = true;
		this.template = `<div class="media">
	<ng-transclude></ng-transclude>
</div>
<div class="group--share">
	<div class="group--share__label">Share</div>
	<div class="group--actions">
		<div class="btn btn--facebook" ng-click="onFacebook()" ng-if="onFacebook">
			<svg class="icon icon--facebook"><use xlink:href="#icon--facebook"></use></svg>
		</div>
		<div class="btn btn--twitter" ng-click="onTwitter()" ng-if="onTwitter">
			<svg class="icon icon--twitter"><use xlink:href="#icon--twitter"></use></svg>
		</div>
		<div class="btn btn--pinterest" ng-click="onPinterest()" ng-if="onPinterest">
			<svg class="icon icon--pinterest"><use xlink:href="#icon--pinterest"></use></svg>
		</div>
	</div>
</div>
`;
		this.scope = {
			item: '=?media',
		};
	}

	link(scope, element, attributes, controller) {
		scope.item = scope.item || {};
		const node = element[0];
		const img = node.querySelector('img');
		if (img) {
			const pageTitle = document.title;
			const pageUrl = `${window.location.href}?imageId=${scope.item.id}`;
			scope.onFacebook = (event) => {
				console.log('ShareDirective.onFacebook', event);
				const url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
				window.open(url, 'facebookShareWindow', `height=450, width=550, top=${window.innerHeight / 2 - 275}, left=${window.innerWidth / 2 - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
				// event.preventDefault();
			};
			scope.onTwitter = (event) => {
				console.log('ShareDirective.onTwitter', event);
				const url = `https://twitter.com/intent/tweet?url=${pageUrl}&via=LeaCeramiche&text=${pageTitle}`;
				window.open(url, 'twitterShareWindow', `height=450, width=550, top=${window.innerHeight / 2 - 275}, left=${window.innerWidth / 2 - 225}, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0`);
				// event.preventDefault();
			};
			scope.onPinterest = () => {
				const pin = {
					url: pageUrl,
					media: img.src || pageSrc,
					description: img.title || pageTitle,
				};
				console.log('ShareDirective.onPin', pin);
				PinUtils.pinOne(pin);
			};
		}
		/*
		scope.$watch(() => {
			return this.wishlistService.has(scope.item);
		}, (current, previous) => {
			// console.log(current, previous, node);
			if (scope.wishlistActive !== current) {
				scope.wishlistActive = current;
				if (current) {
					scope.wishlistActivated = true;
					this.$timeout(() => {
						scope.wishlistActivated = false;
					}, 2000);
				} else {
					scope.wishlistDeactivated = true;
					this.$timeout(() => {
						scope.wishlistDeactivated = false;
					}, 2000);
				}
			}
		});
		scope.onClickWishlist = (event) => {
			this.wishlistService.toggle(scope.item).then(
				(has) => {
					console.log('MediaDirective.onClickWishlist', has);
				},
				(error) => {
					console.log(error);
				}
			);
			event.preventDefault();
			event.stopPropagation();
		};
		*/
		element.on('$destroy', () => {});
	}

	static factory($timeout, WishlistService) {
		return new MediaDirective($timeout, WishlistService);
	}

}

MediaDirective.factory.$inject = ['$timeout', 'WishlistService'];
