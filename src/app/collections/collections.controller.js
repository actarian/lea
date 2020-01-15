/* jshint esversion: 6 */
import GtmService from '../gtm/gtm.service';
const GTM_CAT = 'collections';

class CollectionsCtrl {

	constructor(
		$scope,
		$timeout,
		LocationService
	) {
		this.$scope = $scope;
		this.$timeout = $timeout;
		this.locationService = LocationService;
		this.filters = window.filters || {};
		this.collections = window.collections || [];
		this.selectedFilters = [];
		// this.initData__();
		this.deserializeFilters();
		this.applyFilters();
	}

	deserializeFilters() {
		const locationFilters = this.locationService.deserialize('filters') || {};
		Object.keys(this.filters).forEach(x => {
			const filter = this.filters[x];
			switch (x) {
				default:
					filter.doFilter = (item, value) => {
						const features = item[x];
						return features.indexOf(value) !== -1;
					};
			}
			filter.options.unshift({
				label: this.filters[x].placeholder,
				value: null,
			});
			const selectedOption = filter.options.find(o => Boolean(o.value === (locationFilters[x] || null)));
			filter.value = selectedOption.value;
			filter.placeholder = selectedOption.label;
		});
		return filters;
	}

	serializeFilters() {
		const filters = {};
		Object.keys(this.filters).forEach(x => {
			const filter = this.filters[x];
			if (filter.value !== null) {
				filters[x] = filter.value;
			}
		});
		// console.log('ReferenceCtrl.serializeFilters', filters);
		this.locationService.serialize('filters', filters);
		return filters;
	}

	applyFilters() {
		this.serializeFilters();
		const selectedFilters = Object.keys(this.filters).map((x) => this.filters[x]).filter(x => x.value !== null);
		let filteredItems = this.collections.slice();
		// console.log(filteredItems);
		if (selectedFilters.length) {
			filteredItems = filteredItems.filter(reference => {
				let has = true;
				selectedFilters.forEach(filter => {
					has = has && filter.doFilter(reference, filter.value);
				});
				return has;
			});
		}
		// console.log(filteredItems, selectedFilters);
		this.selectedFilters = selectedFilters;
		this.filteredItems = [];
		this.$timeout(() => {
			this.filteredItems = filteredItems;
			this.updateFilterStates(filteredItems);
			// delayer for image update
		}, 50);
		GtmService.pageViewFilters(GTM_CAT, this.filters);
	}

	updateFilterStates(collections) {
		// console.log('updateFilterStates', collections);
		Object.keys(this.filters).forEach(x => {
			const filter = this.filters[x];
			filter.options.forEach(option => {
				let has = false;
				if (option.value) {
					let i = 0;
					while (i < collections.length && !has) {
						const reference = collections[i];
						has = filter.doFilter(reference, option.value);
						i++;
					}
				} else {
					has = true;
				}
				option.disabled = !has;
			});
			// console.log(filter.options);
		});
	}

	setFilter(item, filter) {
		item = item || filter.options[0];
		filter.value = item.value;
		filter.placeholder = item.label;
		this.applyFilters();
		this.$scope.$broadcast('onCloseDropdown');
	}

	removeFilter(filter) {
		this.setFilter(null, filter);
	}

	removeAll() {
		const removing = {}
		Object.keys(this.filters).forEach(key => {
			removing[key] = this.filters[key];
		});
		Object.keys(removing).forEach(key => {
			const filter = removing[key];
			this.removeFilter(filter);
		});
		this.applyFilters();
	}

	initData__() {
		// options > label, value (id)
		let uid = 1;
		const getStoredValue = (items, label) => {
			return items.find(x => x.label === label);
		};
		const toTitleCase = (text) => {
			return text.replace(/-/g, ' ').replace(/\w\S*/g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		};
		Object.keys(this.filters).forEach(key => {
			const filter = this.filters[key];
			const options = filter.options;
			this.collections.forEach(x => {
				const values = x[key];
				if (values) {
					x[key] = values.map(value => {
						const label = toTitleCase(value);
						const storedValue = getStoredValue(options, label);
						let id;
						if (storedValue !== undefined) {
							id = storedValue.value;
						} else {
							id = uid++;
							options.push({
								label: label,
								value: id
							});
						}
						return id;
					});
				}
			});
		});
		console.log(JSON.stringify(this.filters));
		console.log(JSON.stringify(this.collections));
	}

}

CollectionsCtrl.$inject = ['$scope', '$timeout', 'LocationService'];

export default CollectionsCtrl;
