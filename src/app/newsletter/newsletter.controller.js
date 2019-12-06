/* jshint esversion: 6 */

class NewsletterCtrl {

	constructor(
		$scope,
		$location,
		$timeout,
		$http,
		StateService
	) {
		this.$scope = $scope;
		this.$location = $location;
		this.$timeout = $timeout;
		this.$http = $http;
		this.data = window.data || {};
		this.model = {};
		if (this.$location.search() && this.$location.search().email) {
			this.model.email = this.$location.search().email;
		}
		this.state = StateService.getState();
		this.state.ready();
	}

	onSubmit() {
		console.log('NewsletterCtrl.onSubmit', this.model);
		if (this.state.busy()) {
			this.$http.post('/WS/wsUsers.asmx/Newsletter', { data: this.model }).then(
				success => {
					this.state.success();
				},
				error => {
					this.error = error;
				}
			);
			this.$timeout(() => {
				// this.state.ready();
			}, 2000);
		}
	}

	onNewsletter() {
		console.log('NewsletterCtrl.onNewsletter', this.model);
		window.location.href = `${this.newsletterHref}?email=${this.model.email}`;
	}

	onInvalid() {
		this.$scope.$broadcast('onInvalid');
	}

}

NewsletterCtrl.$inject = ['$scope', '$location', '$timeout', '$http', 'StateService'];

export default NewsletterCtrl;
