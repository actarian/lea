/* jshint esversion: 6 */

import GtmService from '../gtm/gtm.service';

class ContactsCtrl {

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

	setProvinces() {
		this.$timeout(() => {
			this.provinces = this.data.provinces.filter(x => x.countryId === this.model.Nazione);
		});
	}

	onSubmit() {
		console.log('ContactsCtrl.onSubmit', this.model);
		if (this.state.busy()) {
			this.$http.post('/WS/wsUsers.asmx/Contact', {data: this.model}).then(
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

ContactsCtrl.$inject = ['$scope', '$location', '$timeout', '$http', 'StateService'];

export default ContactsCtrl;
