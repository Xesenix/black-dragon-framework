import { inject, injectable } from 'inversify';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { EmptyState, IState, IStateTransition, StateManager } from 'lib/state-manager';
import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/observable/concat';
import { defer } from 'rxjs/observable/defer';
import { empty } from 'rxjs/observable/empty';
// import { of } from 'rxjs/observable/of';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { TweenObservable } from 'xes-rx-tween';

import { BootState } from 'game/states/boot';

@injectable()
export class GameViewState extends EmptyState implements IState {
	public readonly name = 'GameViewState';

	private game: any;
	private gameParent: HTMLElement;

	public constructor(
		@inject('ui:renderer') private renderer: ReactRenderer,
	) { super(); }

	public createPreloader() {
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

	public create() {
		const antialias = false;
		const disableWebAudio = true;
		const width = 600;
		const height = 480;
		const renderer = Phaser.CANVAS;
		const multiTexture = true;
		const enableDebug = true;
		const parent = this.gameParent;

		window.PhaserGlobal = {
			disableWebAudio, // that bit is important for ram consumption (true == less ram consumption)
		};

		this.game = new Phaser.Game({
			antialias,
			width,
			height,
			renderer,// Phaser. AUTO, WEBGL, CANVAS, HEADLESS, WEBGL_MULTI
			parent,
			multiTexture,
			enableDebug,
		});

		this.game.state.add('boot', new BootState());
		this.game.state.start('boot');

		return empty();
	}

	public loadState() {
		return concat(
			TweenObservable.create(1000, 0, 100),
			// of(100),
		);
	}

	public enterState(previousState: IState, manager: StateManager): IStateTransition {
		console.debug('GameViewState:enterState');
		return concat(
			defer(() => this.createPreloader()),
			defer(() => this.loadState()),
			defer(() => this.cleanPreloader(manager)),
			defer(() => this.create()),
		).pipe(
			last(),
			mapTo({ prev: previousState, next: this, manager }),
		);
	}


}
