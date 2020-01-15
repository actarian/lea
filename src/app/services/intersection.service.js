/* jshint esversion: 6 */

import { of , Subject } from 'rxjs';
import { filter, finalize, first, map } from 'rxjs/operators';

export default class IntersectionService {

	constructor() {
		this.observerSubject_ = new Subject();
	}

	get observer() {
		if (!this.observer_) {
			this.observer_ = new IntersectionObserver(entries => {
				this.observerSubject_.next(entries);
			});
		}
		return this.observer_;
	}

	intersection$(node) {
		if ('IntersectionObserver' in window) {
			this.observer.observe(node);
			return this.observerSubject_.pipe(
				map(entries => entries.find(entry => entry.target === node)),
				filter(entry => entry !== undefined && entry.intersectionRatio > 0),
				first(),
				finalize(() => this.observer.unobserve(node)),
			);
		} else {
			return of({ target: node });
		}
	}

	static factory() {
		return new IntersectionService();
	}

}
