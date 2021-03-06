import * as React from 'react';
import { concat } from 'rxjs/observable/concat';
import { defer } from 'rxjs/observable/defer';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { tap } from 'rxjs/operators/tap';
import { TweenObservable } from 'xes-rx-tween';

import { IAppDataState } from 'app/reducer';
import { DataStore } from 'lib/data-store/data-store';
import { inject, injectable } from 'lib/di';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { EmptyState, IState } from 'lib/state-manager/state';
import { IStateTransition, StateManager } from 'lib/state-manager/state-manager';

import WelcomeView from './view';

@inject(['data-store', 'ui:renderer'])
export class WelcomeViewState extends EmptyState implements IState {
	public constructor(
		private dataStore: DataStore<IAppDataState>,
		private renderer: ReactRenderer,
	) { super(); }

	public enterState(previousState: IState, manager: StateManager, context: any): IStateTransition {
		console.debug('WelcomeState:enterState');
		return concat(
			defer(() => this.createPreloader(manager)),
			defer(() => this.loadState(manager)),
			defer(() => this.cleanPreloader(manager)),
			defer(() => this.create(manager)),
			of(true),
		).pipe(
			last(),
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:COMPLETE',
				payload: { namespace: 'welcome:assets', },
			})),
			mapTo({ prev: previousState, next: this, manager, context }),
		);
	}

	public leaveState(nextState: IState, manager: StateManager, context: any): IStateTransition {
		console.debug('WelcomeState:leaveState');
		return concat(
			defer(() => this.unloadState(manager)),
			defer(() => this.cleanState(manager)),
			of(true),
		).pipe(
			last(),
			mapTo({ prev: this, next: nextState, manager, context }),
		);
	}

	private createPreloader(manager: StateManager) {
		console.debug('WelcomeState:createPreloader');
		this.renderer
			.setOutlet(<WelcomeView stateManager={manager} dataStore={this.dataStore} />, 'enter')
			.render();

		return TweenObservable.create(1000, 0, 100).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { namespace: 'welcome:assets', progress, description: 'creating' },
			})),
		);
	}

	private loadState(manager: StateManager) {
		console.debug('WelcomeState:loadState');
		return TweenObservable.create(2000, 0, 100).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { namespace: 'welcome:assets', progress, description: 'loading' },
			})),
		);
	}

	private cleanPreloader(manager: StateManager) {
		console.debug('WelcomeState:cleanPreloader');
		this.renderer.setOutlet(null, 'enter');

		return empty();
	}

	private create(manager: StateManager) {
		console.debug('WelcomeState:create');
		this.renderer
			.setOutlet(<WelcomeView stateManager={manager} dataStore={this.dataStore} />)
			.render();

		return empty();
	}

	private unloadState(manager: StateManager) {
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
				payload: { namespace: 'welcome:assets', progress, description: 'cleaning up' },
			})),
		);
	}

	private cleanState(manager: StateManager) {
		console.debug('WelcomeState:cleanState');

		this.renderer
			.setOutlet(null, 'exit')
			.render();

		this.dataStore.dispatch({
			type: 'PRELOAD:COMPLETE',
			payload: { namespace: 'welcome:assets', },
		});

		return empty();
	}
}
