import { EventEmitter } from 'events';
import { PHASER_BOOT_STATE_INIT_EVENT } from 'game/states/boot';
import { inject, injectable } from 'inversify';
import { IPhaserProvider } from 'lib/phaser/phaser-provider';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { EmptyState, IState, IStateTransition, StateManager } from 'lib/state-manager';
import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { defer } from 'rxjs/observable/defer';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { TweenObservable } from 'xes-rx-tween';

@injectable()
export class GameViewState extends EmptyState implements IState {
	public readonly name = 'GameViewState';

	private gameParent: HTMLElement;

	public constructor(
		@inject('ui:renderer') private renderer: ReactRenderer,
		@inject('phaser:phaser-provider') private phaserProvider: IPhaserProvider,
		@inject('event-manager') private eventManager: EventEmitter,
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

	public createPreloader(manager: StateManager) {
		this.renderer.setOutlet(<div>preloading...</div>, 'enter').render();
		return TweenObservable.create(2000, 0, 100);
	}

	public cleanPreloader(manager: StateManager) {
		return new Observable((observer) => {
			this.renderer
				.setOutlet(null, 'enter')
				.setOutlet((<div>ready <a onClick={() => manager.changeState('initial')}>back</a>
					<div ref={(el) => { this.gameParent = el as any; observer.complete(); }}></div>
				</div>))
				.render();
		});
	}

	public create(manager: StateManager) {
		return new Observable((observer) => {
			this.phaserProvider(this.gameParent).then((game) => {
				game.state.start('boot');

				this.eventManager.once(PHASER_BOOT_STATE_INIT_EVENT, () => {
					observer.complete();
				});
			});
		});
	}

	public loadState(manager: StateManager) {
		return TweenObservable.create(1000, 0, 100);
	}
}
