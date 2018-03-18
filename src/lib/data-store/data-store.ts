import { AnyAction, createStore, Reducer } from 'redux';
import { Observable } from 'rxjs/Observable';

import { inject, optional } from 'lib/di';

@inject(['data-store:initial-state', 'data-store:action-reducer', 'data-store:store-enhancer'])
export class DataStore<T> {
	private store = createStore(
		this.reducer,
		this.state,
		this.enhancer,
	);

	private store$ = new Observable<T>((observer) => {
		this.store.subscribe(() => {
			const state: any = this.store.getState();
			observer.next({ ...state });
		});
	});

	public constructor(
		private state: T,
		public reducer: Reducer<T>,
		@optional() private enhancer: any,
	) { }

	public dispatch(action: AnyAction): AnyAction {
		return this.store.dispatch(action);
	}

	public subscribe(listener: any): () => void {
		return this.store.subscribe(listener);
	}

	public getState(): T {
		return this.store.getState();
	}

	public replaceReducer(reducer: Reducer<T>): void {
		this.store.replaceReducer(reducer);
	}

	public asObservable(): Observable<T> {
		return this.store$;
	}
}
