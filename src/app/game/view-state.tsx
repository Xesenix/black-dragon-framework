import { IAppDataState } from 'app/reducer';
import { EventEmitter } from 'events';
import { PHASER_BOOT_STATE_INIT_EVENT } from 'game/states/boot';
import { inject, injectable } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
import { Game } from 'lib/phaser/game';
import { IPhaserProvider } from 'lib/phaser/phaser-provider';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { EmptyState, IState, IStateTransition, StateManager } from 'lib/state-manager';
import * as React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { defer } from 'rxjs/observable/defer';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators/filter';
import { first } from 'rxjs/operators/first';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { tap } from 'rxjs/operators/tap';
import { TweenObservable } from 'xes-rx-tween';
import { GameView } from './view';

import 'phaser-ce';

@injectable()
export class GameViewState extends EmptyState implements IState {
	public containerRef$: BehaviorSubject<any> = new BehaviorSubject(null);

	private context: any;

	private game: Game;

	public constructor(
		@inject('data-store') private dataStore: DataStore<IAppDataState>,
		@inject('event-manager') private eventManager: EventEmitter,
		@inject('phaser:phaser-provider') private phaserProvider: IPhaserProvider,
		@inject('ui:renderer') private renderer: ReactRenderer,
	) { super(); }

	public enterState(previousState: IState, manager: StateManager, context: any): IStateTransition {
		console.debug('GameViewState:enterState');

		// if nothing changed
		if (previousState === this && this.context === context) {
			return of({ prev: previousState, next: this, manager, context });
		}

		this.context = context;

		return concat(
			defer(() => this.createPreloader(manager, context)),
			defer(() => this.loadState(manager, context)),
			defer(() => this.cleanPreloader(manager, context)),
			defer(() => this.create(manager, context)),
			of(true),
		).pipe(
			last(),
			mapTo({ prev: previousState, next: this, manager, context }),
		);
	}

	public leaveState(nextState: IState, manager: StateManager, context: any): IStateTransition {
		this.context = context;
		console.debug('WelcomeState:leaveState');
		if (nextState === this) {
			return of({ prev: this, next: nextState, manager, context });
		}
		return concat(
			defer(() => this.unloadState(manager, context)),
			defer(() => this.cleanState(manager, context)),
			of(true),
		).pipe(
			last(),
			mapTo({ prev: this, next: nextState, manager, context }),
		);
	}

	public createPreloader(manager: StateManager, context: any) {
		console.debug('GameViewState:createPreloader');

		this.dataStore.dispatch({
			type: 'PRELOAD:SET_PROGRESS',
			payload: { namespace: 'game:assets', progress: 0, description: 'creating' },
		});

		this.renderer
			.setOutlet(<GameView state={this} stateManager={manager} dataStore={this.dataStore} />, 'enter')
			.render();

		return TweenObservable.create(2000, 0, 100).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { namespace: 'game:assets', progress, description: 'creating' },
			})),
		);
	}

	public cleanPreloader(manager: StateManager, context: any) {
		console.debug('GameViewState:cleanPreloader');
		this.renderer
			.setOutlet(null, 'enter')
			.setOutlet((<GameView state={this} stateManager={manager} dataStore={this.dataStore} />))
			.render();

		return this.containerRef$.pipe(
			filter((element) => !!element),
			first(),
		);
	}

	public create(manager: StateManager, context: any) {
		console.debug('GameViewState:create');
		console.group('GameViewState:create:get phaser');

		return new Observable((observer) => {
			this.phaserProvider(this.containerRef$.getValue()).then((game) => {
				this.game = game;
				if (!this.game.isBooted) {
					// if game wasen't started yet
					this.game.state.start('state:game/boot');

					this.eventManager.once(PHASER_BOOT_STATE_INIT_EVENT, () => {
						console.groupEnd();
						observer.complete();
					});
				} else {
					// if game was started and we are resuming
					this.game.paused = false;
					observer.complete();
				}
			});
		});
	}

	public loadState(manager: StateManager, context: any) {
		console.debug('GameViewState:loadState');
		return TweenObservable.create(1000, 0, 100).pipe(
			tap((progress) => this.dataStore.dispatch({
				type: 'PRELOAD:SET_PROGRESS',
				payload: { namespace: 'game:assets', progress, description: 'loading' },
			})),
		);
	}

	private unloadState(manager: StateManager, context: any) {
		console.debug('GameViewState:unloadState');

		this.game.paused = true;
		this.game.parent.removeChild(this.game.canvas);

		this.renderer
			.setOutlet(null)
			.setOutlet(<GameView state={this} stateManager={manager} dataStore={this.dataStore} />, 'exit')
			.render();

		return empty();
	}

	private cleanState(manager: StateManager, context: any) {
		console.debug('GameViewState:cleanState');

		this.renderer
			.setOutlet(null, 'exit')
			.render();

		this.dataStore.dispatch({
			type: 'PRELOAD:COMPLETE',
			payload: { namespace: 'game:assets', },
		});

		return empty();
	}
}
