import { EventEmitter } from 'events';
import { inject, injectable } from 'inversify';
import { IPhaserState } from 'lib/phaser/state';

export const PHASER_BOOT_STATE_INIT_EVENT = Symbol('BootState:init:event');
export const PHASER_BOOT_STATE_PRELOAD_EVENT = Symbol('BootState:preload:event');
export const PHASER_BOOT_STATE_SHUTDOWN_EVENT = Symbol('BootState:shutdown:event');

@injectable()
export class BootState implements IPhaserState {
	private stage: any;
	private game: any;
	private load: any;

	public constructor(
		@inject('event-manager') private eventEmiter: EventEmitter,
	) {
		console.debug('Phaser:BootState:constructor');
	}

	public init() {
		console.debug('Phaser:BootState:init');

		this.eventEmiter.emit(PHASER_BOOT_STATE_INIT_EVENT, this.game, this);
	}

	public preload() {
		console.debug('Phaser:BootState:preload');

		// so that on first state application will progress regardless if there was player interaction or not
		this.stage.disableVisibilityChange = true;
		this.game.time.advancedTiming = true; // for fps counter
		this.game.time.desiredFps = 30;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE; //SHOW_ALL, NO_SCALE, EXACT_FIT, RESIZE
		this.game.clearBeforeRender = false; // if your game contains full background

		this.load.onLoadStart.add(() => {
			console.debug('Phaser:BootState:load start');
		});
		this.load.onFileComplete.add((progress: any, cacheKey: any, success: any, totalLoaded: any, totalFiles: any) => {
			console.debug('Phaser:BootState:File load complete', { progress, cacheKey, success, totalLoaded, totalFiles });
		});
		this.load.onLoadComplete.add(() => {
			console.debug('Phaser:BootState:Assets load complete');
		});

		this.load.image('preloader', 'assets/ui/preloader.gif');

		this.eventEmiter.emit(PHASER_BOOT_STATE_PRELOAD_EVENT, this.game, this);
	}

	public shutdown() {
		console.debug('Phaser:BootState:shutdown');

		this.eventEmiter.emit(PHASER_BOOT_STATE_SHUTDOWN_EVENT, this.game, this);
	}
}
