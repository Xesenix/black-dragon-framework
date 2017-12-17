export class BootState {
	private stage: any;
	private game: any;
	private load: any;

	public constructor() {
		console.log('Phaser:BootState:constructor');
	}

	public init() {
		console.log('Phaser:BootState:init');
	}

	public preload() {
		console.log('Phaser:BootState:preload');

		// so that on first state application will progress regardless if there was player interaction or not
		this.stage.disableVisibilityChange = true;
		this.game.time.advancedTiming = true; // for fps counter
		this.game.time.desiredFps = 30;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE; //SHOW_ALL, NO_SCALE, EXACT_FIT, RESIZE
		this.game.clearBeforeRender = false; // if your game contains full background

		this.load.onLoadStart.add(() => {
			console.log('Phaser:BootState:load start');
		});
		this.load.onFileComplete.add((progress: any, cacheKey: any, success: any, totalLoaded: any, totalFiles: any) => {
			console.log('Phaser:BootState:File load complete', { progress, cacheKey, success, totalLoaded, totalFiles });
		});
		this.load.onLoadComplete.add(() => {
			console.log('Phaser:BootState:Assets load complete');
		});

		this.load.image('preloader', 'assets/ui/preloader.gif');
	}

	public shutdown() {
		console.log('Phaser:BootState:shutdown');
	}
}
