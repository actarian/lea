/* jshint esversion: 6 */

import GtmService from '../gtm/gtm.service';

class ContactStoreCtrl {

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
		this.model = {
            Collections: []
        };
		if (this.$location.search() && this.$location.search().email) {
			this.model.email = this.$location.search().email;
		}
		this.state = StateService.getState();
		this.state.ready();
	}

	onSubmit() {
		console.log('ContactStoreCtrl.onSubmit', this.model);

		if (this.state.busy()) {
			this.$http.post('/WS/wsUsers.asmx/ContactStore', {data: this.model}).then(
				success => {
					this.state.success();

					GtmService.push({"event": "Action Complete"});
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

	onInvalid() {
		this.$scope.$broadcast('onInvalid');
	}

}

ContactStoreCtrl.$inject = ['$scope', '$location', '$timeout', '$http', 'StateService'];

export default ContactStoreCtrl;
