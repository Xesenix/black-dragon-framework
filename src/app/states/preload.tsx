import { injectable, inject } from 'inversify';
import * as React from 'react';
import { render } from 'react-dom';
import { concat } from 'rxjs/observable/concat';
import { of } from 'rxjs/observable/of';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { tap } from 'rxjs/operators/tap';
import { TweenObservable } from 'xes-rx-tween';

import { IState, IStateTransition } from './../../lib/state-manager';
import { StateManager } from './../../lib/state-manager/state-manager';
import { App } from './../game-view/container/app';

@injectable()
export class PreloadState {
	public constructor(
		@inject('ui:root') private uiRoot: HTMLElement,
	) { }

	public create() {
		console.debug('PreloadState:create');
		return concat(
			TweenObservable.create(5000, 0, 100).pipe(throttleTime(100)),
			of(100),
		).pipe(
			tap((x) => console.debug('PreloadState:progress', x)),
			tap((x) => {
				render(<App x={x}/>, this.uiRoot);
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
			mapTo({ prev: this, next: nextState, manager }),
		);
	}
}
