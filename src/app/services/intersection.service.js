/* jshint esversion: 6 */

import { of , Subject } from 'rxjs';
import { filter, finalize, first, map, switchMap, tap } from 'rxjs/operators';

export default class IntersectionService {

	constructor() {
		this.readySubject_ = new Subject();
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
			return this.readySubject_.pipe(
				tap(value => this.observer.observe(node)),
				switchMap(() => this.observerSubject_),
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
