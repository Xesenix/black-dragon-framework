import { App } from 'app/game-view/container/app';
import { inject, injectable } from 'inversify';
import { EmptyState, IState, IStateTransition } from 'lib/state-manager';
import { StateManager } from 'lib/state-manager/state-manager';
import * as React from 'react';
import { render } from 'react-dom';
import { concat } from 'rxjs/observable/concat';
import { of } from 'rxjs/observable/of';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { tap } from 'rxjs/operators/tap';
import { throttleTime } from 'rxjs/operators/throttleTime';
import { TweenObservable } from 'xes-rx-tween';

@injectable()
export class PreloadState extends EmptyState implements IState {
	public constructor(
		@inject('ui:root') private uiRoot: HTMLElement,
	) {
		super();
	}

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

	public enterState(previousState: IState, manager: StateManager, context: any = {}): IStateTransition {
		console.debug('PreloadState:enterState');
		return concat(
			this.create(),
			this.loadState(),
		).pipe(
			last(),
			mapTo({ prev: previousState, next: this, manager, context }),
		);
	}

	public leaveState(nextState: IState, manager: StateManager, context: any = {}): IStateTransition {
		console.debug('PreloadState:leaveState');
		return this.cleanState().pipe(
			last(),
			mapTo({ prev: this, next: nextState, manager, context }),
		);
	}
}
