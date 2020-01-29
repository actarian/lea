/* jshint esversion: 6 */

class LoginCtrl {

	constructor(
		$window,
		$scope,
		$location,
		$timeout,
		$http,
		StateService
	) {
		this.$window = $window;
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
		console.log('LoginCtrl.onSubmit', this.model);
		if (this.state.busy()) {
			this.$http.post('/ws/wsUsers.asmx/Login', this.model).then(
				success => {
					//console.log(success.data.d.Status);
					//console.log(success.data.d.HTML);
					if (success.data.d.Status) {
						this.state.success();
					}
					else {
						this.state.error(success.data.d.HTML);
					}
				},
				error => {
					this.error = error;
				}
			);

			this.$timeout(() => {
				// this.state.ready();
			}, 2000);
		}
		//console.log(this.state);
		
		this.$timeout(() => {
			// this.state.ready();
			if (this.state.isReady && this.state.isSuccess) {
				this.$window.location.href = '/download';
			}
		}, 2000);
	}

	onInvalid() {
		this.$scope.$broadcast('onInvalid');
	}

}

LoginCtrl.$inject = ['$window', '$scope', '$location', '$timeout', '$http', 'StateService'];

export default LoginCtrl;
