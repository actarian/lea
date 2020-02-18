/* jshint esversion: 6 */


export function NotInFilter($filter) {
	return (array, filters, element) => {
		if (filters) {        
			return $filter('filter')(array, (item) => {
				for (var i = 0; i < filters.length; i++) {
                    const filter = filters[i];
                    if (typeof filter === 'object') {
    					if (filter[element] === item[element]) return false;
                    } else {
                        if (filter === item[element]) return false;
                    }
				}
				return true;
			});
		}
	};
}
