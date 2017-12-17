import { IAppDataState } from 'app/reducer';
import { inject, injectable } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { IState } from 'lib/state-manager/state';
import { StateManager } from 'lib/state-manager/state-manager';
import { IStateTransition } from 'lib/state-manager/state-manager';
import * as React from 'react';
import { concat } from 'rxjs/observable/concat';
import { defer } from 'rxjs/observable/defer';
import { empty } from 'rxjs/observable/empty';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { tap } from 'rxjs/operators/tap';
import { TweenObservable } from 'xes-rx-tween';
import { WelcomeView } from './view';

@injectable()
export class WelcomeViewState implements IState {
	public readonly name = 'WelcomeViewState';

	public constructor(
		@inject('ui:renderer') private renderer: ReactRenderer,
		@inject('data-store') private dataStore: DataStore<IAppDataState>,
	) { }

	public enterState(previousState: IState, manager: StateManager): IStateTransition {
		console.debug('WelcomeState:enterState');
		return concat(
			defer(() => this.createPreloader(manager)),
			defer(() => this.loadState()),
			defer(() => this.cleanPreloader(manager)),
			defer(() => this.create(manager)),
		).pipe(
			last(),
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:COMPLETE',
			})),
			mapTo({ prev: previousState, next: this, manager }),
		);
	}

	public createPreloader(manager: StateManager) {
		console.debug('WelcomeState:createPreloader');
		this.renderer
			.setOutlet(<WelcomeView stateManager={manager} dataStore={this.dataStore} />, 'enter')
			.render();

		return TweenObservable.create(1000, 0, 100).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { progress, description: 'creating' },
			})),
		);
	}

	public loadState() {
		console.debug('WelcomeState:loadState');
		return TweenObservable.create(2000, 0, 100).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { progress, description: 'loading' },
			})),
		);
	}

	public cleanPreloader(manager: StateManager) {
		console.debug('WelcomeState:cleanPreloader');
		this.renderer.setOutlet(null, 'enter');

		return empty();
	}

	public create(manager: StateManager) {
		console.debug('WelcomeState:create');
		this.renderer
			.setOutlet(<WelcomeView stateManager={manager} dataStore={this.dataStore} />)
			.render();

		return empty();
	}

	public leaveState(nextState: IState, manager: StateManager): IStateTransition {
		console.debug('WelcomeState:leaveState');
		return concat(
			defer(() => this.unloadState(manager)),
			defer(() => this.cleanState(manager)),
		).pipe(
			last(),
			mapTo({ prev: this, next: nextState, manager }),
		);
	}

	public unloadState(manager: StateManager) {
		console.debug('WelcomeState:unloadState');

		this.renderer
			.setOutlet(null)
			.setOutlet(<WelcomeView stateManager={manager} dataStore={this.dataStore} />, 'exit')
			.render();

		return concat(
			TweenObservable.create(5000, 0, 100),
			defer(() => {
				this.renderer.setOutlet(null, 'exit');
				return empty();
			}),
		).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { progress, description: 'cleaning up' },
			})),
		);
	}

	public cleanState(manager: StateManager) {
		console.debug('WelcomeState:cleanState');

		this.renderer
			.setOutlet(null, 'exit')
			.render();

		this.dataStore.dispatch({
			type: 'PRELOAD:COMPLETE',
		});

		return empty();
	}
}
