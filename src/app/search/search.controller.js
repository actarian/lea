/* jshint esversion: 6 */

// const IS_DEV = (window.location.hostname === 'localhost' || window.location.hostname === '0.0.0.0');

class SearchCtrl {

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
		this.state = StateService.getState();
		this.state.ready();
		if (this.$location.search() && this.$location.search().search) {
			this.model.search = this.$location.search().search;
			this.onSubmit();
		}
	}

	onSubmit() {
		console.log('SearchCtrl.onSubmit', this.model);
		this.results = [];
		if (this.state.busy()) {
			// (IS_DEV ? this.$http.get('./data/search-results.json') : this.$http.post('/WS/wsUsers.asmx/Search', { data: this.model })).then(
			this.$http.get('./data/search-results.json').then(
				success => {
					const results = success.data;
					console.log(results);
					this.results = results;
					this.state.success();
					this.$location.search('search', this.model.search)
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

	onSearch() {
		console.log('SearchCtrl.onSearch', this.model);
		window.location.href = `${this.searchHref}?search=${this.model.search}`;
	}

	onInvalid() {
		this.$scope.$broadcast('onInvalid');
	}

}

SearchCtrl.$inject = ['$scope', '$location', '$timeout', '$http', 'StateService'];

export default SearchCtrl;
