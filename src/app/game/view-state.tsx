import { IAppDataState } from 'app/reducer';
import { EventEmitter } from 'events';
import { PHASER_BOOT_STATE_INIT_EVENT } from 'game/states/boot';
import { inject, injectable } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
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
import { TweenObservable } from 'xes-rx-tween';
import { GameView } from './view';

import 'phaser-ce';

@injectable()
export class GameViewState extends EmptyState implements IState {
	public containerRef$: BehaviorSubject<any> = new BehaviorSubject(null);

	private game: Phaser.Game;

	public constructor(
		@inject('data-store') private dataStore: DataStore<IAppDataState>,
		@inject('event-manager') private eventManager: EventEmitter,
		@inject('phaser:phaser-provider') private phaserProvider: IPhaserProvider,
		@inject('ui:renderer') private renderer: ReactRenderer,
	) { super(); }

	public enterState(previousState: IState, manager: StateManager): IStateTransition {
		console.debug('GameViewState:enterState');
		return concat(
			defer(() => this.createPreloader(manager)),
			defer(() => this.loadState(manager)),
			defer(() => this.cleanPreloader(manager)),
			defer(() => this.create(manager)),
		).pipe(
			last(),
			mapTo({ prev: previousState, next: this, manager }),
		);
	}

	public leaveState(nextState: IState, manager: StateManager): IStateTransition {
		console.debug('WelcomeState:leaveState');
		return concat(
			defer(() => this.unloadState(manager)),
			defer(() => this.cleanState(manager)),
			of(true),
		).pipe(
			last(),
			mapTo({ prev: this, next: nextState, manager }),
		);
	}

	public createPreloader(manager: StateManager) {
		console.debug('GameViewState:createPreloader');
		this.renderer.setOutlet(<div>preloading...</div>, 'enter').render();
		return TweenObservable.create(2000, 0, 100);
	}

	public cleanPreloader(manager: StateManager) {
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

	public create(manager: StateManager) {
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

	public loadState(manager: StateManager) {
		console.debug('GameViewState:loadState');
		return TweenObservable.create(1000, 0, 100);
	}

	private unloadState(manager: StateManager) {
		console.debug('GameViewState:unloadState');

		this.game.paused = true;
		this.game.parent.removeChild(this.game.canvas);

		this.renderer
			.setOutlet(null)
			.setOutlet(<GameView state={this} stateManager={manager} dataStore={this.dataStore} />, 'exit')
			.render();

		return empty();
	}

	private cleanState(manager: StateManager) {
		console.debug('GameViewState:cleanState');

		this.renderer
			.setOutlet(null, 'exit')
			.render();

		this.dataStore.dispatch({
			type: 'PRELOAD:COMPLETE',
		});

		return empty();
	}
}
