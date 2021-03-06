import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { IDictionary } from './dictionary.d';

import { injectable } from 'lib/di';

@injectable()
export class ObservableDictionary implements IDictionary {
	private data$ = new BehaviorSubject({});

	public constructor(
		origin$: Observable<{ [key: string]: any }>,
	) {
		origin$.subscribe(this.data$);
	}

	public get<T>(key: string, defaultValue: T): T {
		return this.data$.getValue()[key] || defaultValue;
	}

	public set<T>(key: string, value: T): IDictionary {
		this.data$.next({
			...this.data$.getValue(),
			[key]: value,
		});

		return this;
	}
}
