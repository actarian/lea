/* jshint esversion: 6 */

const IS_DEV = window.location.pathname.match(/\.html$/i);
const QUERYSTRING_KEY = 'q';

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
		if (this.$location.search() && this.$location.search()[QUERYSTRING_KEY]) {
			this.model.search = this.$location.search()[QUERYSTRING_KEY];
			this.onSubmit();
		}
	}

	onSubmit() {
		console.log('SearchCtrl.onSubmit', this.model);
		this.results = [];
		if (this.state.busy()) {
			(IS_DEV ? this.$http.get('./data/search-results.json') : this.$http.post(`${window.location.pathname}?${QUERYSTRING_KEY}=${encodeURIComponent(this.model.search)}`)).then(
				success => {
					const results = success.data;
					console.log(results);
					this.results = results;
					this.state.success();
					this.$location.search(QUERYSTRING_KEY, this.model.search)
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
		window.location.href = `${this.searchHref}?${QUERYSTRING_KEY}=${this.model.search}`;
	}

	onInvalid() {
		this.$scope.$broadcast('onInvalid');
	}

}

SearchCtrl.$inject = ['$scope', '$location', '$timeout', '$http', 'StateService'];

export default SearchCtrl;
