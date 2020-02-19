/* jshint esversion: 6 */

import { BehaviorSubject, of , Subject } from 'rxjs';
import { filter, finalize, first, map, switchMap } from 'rxjs/operators';

export default class IntersectionService {

	constructor() {
		this.readySubject_ = new BehaviorSubject(false);
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
		let init = false;
		if ('IntersectionObserver' in window) {
			return this.readySubject_.pipe(
				filter(value => {
					if (value && !init) {
						this.observer.observe(node);
						init = true;
					}
					return value;
				}),
				switchMap(() => this.observerSubject_),
				// tap(entries => console.log(entries.length)),
				map(entries => entries.find(entry => entry.target === node)),
				filter(entry => entry !== undefined && entry.isIntersecting), // entry.intersectionRatio > 0),
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
