import { injectable, inject } from 'inversify';
import { concat } from 'rxjs/observable/concat';
import { of } from 'rxjs/observable/of';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { IState, IStateTransition } from './../../lib/state-manager';
import { StateManager } from './../../lib/state-manager/state-manager';

import { App } from './../game-view/container/app';

import * as React from 'react';
import { render } from 'react-dom';
import { timer } from 'rxjs/observable/timer';
import { tap } from 'rxjs/operators/tap';
import { take } from 'rxjs/operators/take';

@injectable()
export class PreloadState {
	public constructor(
		@inject('ui:root') private uiRoot: HTMLElement,
	) { }

	public create() {
		console.debug('PreloadState:create');
		return timer(0, 1000).pipe(
			tap((x) => console.debug('PreloadState:create:timer', x)),
			take(10),
			tap((x) => {
				render(<App x={x.toString()}/>, this.uiRoot);
			}),
			last(),
			tap((x) => {
				render(<App/>, this.uiRoot);
			}),
		);
	}

	public loadState() {
		console.debug('PreloadState:loadState');
		return of(true);
	}

	public cleanState() {
		console.debug('PreloadState:cleanState');
		return of(true);
	}

	public enterState(previousState: IState, manager: StateManager): IStateTransition {
		console.debug('PreloadState:enterState');
		return concat(
			this.create(),
			this.loadState(),
		).pipe(
			last(),
			mapTo({ prev: previousState, next: this, manager }),
		);
	}

	public leaveState(nextState: IState, manager: StateManager): IStateTransition {
		console.debug('PreloadState:leaveState');
		return this.cleanState().pipe(
			last(),
			mapTo({ prev: this, next: nextState, manager }
		));
	}
}
