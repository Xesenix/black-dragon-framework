import { IAppState } from 'app/reducer';
import { inject, injectable } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { IState } from 'lib/state-manager/state';
import { StateManager } from 'lib/state-manager/state-manager';
import { IStateTransition } from 'lib/state-manager/state-manager';
import * as React from 'react';
import { concat } from 'rxjs/observable/concat';
import { of } from 'rxjs/observable/of';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { tap } from 'rxjs/operators/tap';
import { TweenObservable } from 'xes-rx-tween';
import { WelcomeView } from './view';

@injectable()
export class WelcomeState {
	public constructor(
		@inject('ui:renderer') private renderer: ReactRenderer,
		@inject('data-store') private dataStore: DataStore<IAppState>,
	) { }

	public create() {
		this.renderer.render(<WelcomeView dataStore={this.dataStore} />);
		return concat(
			TweenObservable.create(5000, 0, 100),
			// of(100),
		).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { progress, description: 'creating' },
			})),
			// tap((x) => console.log('load:', x)),
		);
	}

	public loadState() {
		console.debug('WelcomeState:loadState');
		return concat(
			TweenObservable.create(5000, 0, 100),
			// of(100),
		).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { progress, description: 'loading' },
			})),
		);
	}

	public cleanState() {
		console.debug('WelcomeState:cleanState');
		return of(true);
	}

	public enterState(previousState: IState, manager: StateManager): IStateTransition {
		console.debug('WelcomeState:enterState');
		return concat(
			this.create(),
			this.loadState(),
		).pipe(
			last(),
			mapTo({ prev: previousState, next: this, manager }),
		);
	}

	public leaveState(nextState: IState, manager: StateManager): IStateTransition {
		console.debug('WelcomeState:leaveState');
		return this.cleanState().pipe(
			last(),
			mapTo({ prev: this, next: nextState, manager }),
		);
	}
}
