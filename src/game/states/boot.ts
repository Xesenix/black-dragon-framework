import { EventEmitter } from 'events';
import { inject, injectable } from 'inversify';
import { BaseState } from 'lib/phaser/state';
import { ITheme } from 'lib/theme/theme';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { never } from 'rxjs/observable/never';
import { timer } from 'rxjs/observable/timer';
import { share } from 'rxjs/operators/share';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { Subscription } from 'rxjs/Subscription';

import 'phaser-ce';

export const PHASER_BOOT_STATE_INIT_EVENT = Symbol('BootState:init:event');
export const PHASER_BOOT_STATE_PRELOAD_EVENT = Symbol('BootState:preload:event');
export const PHASER_BOOT_STATE_SHUTDOWN_EVENT = Symbol('BootState:shutdown:event');

@injectable()
export class BootState extends BaseState {
	private countLabel: Phaser.Text;

	private subscriptions = new Subscription();

	private timer$ = timer(0, 100).pipe(
		share(),
		tap((x) => console.log('base running', x)),
	);
	private pause$ = new BehaviorSubject(false);

	private lifeTime$ = this.pause$.pipe(
		switchMap((pause) => pause ? never<number>() : this.timer$),
		tap((x) => console.log('running', x)),
		share(),
	);

	private counter$ = new BehaviorSubject(0);

	private counter = 0;

	private start = 0;
	private last = 0;

	public constructor(
		@inject('event-manager') private eventEmiter: EventEmitter,
		@inject('theme:default') private theme: ITheme,
	) {
		super();
		console.debug('Phaser:BootState:constructor');
	}

	public init() {
		console.debug('Phaser:BootState:init');

		this.start = Date.now();
		this.last = Date.now();

		this.eventEmiter.emit(PHASER_BOOT_STATE_INIT_EVENT, this.game, this);
	}

	public preload() {
		console.debug('Phaser:BootState:preload');

		this.load.onLoadStart.add(() => {
			console.debug('Phaser:BootState:load start');
		});
		this.load.onFileStart.add((progress: any, cacheKey: any, success: any, totalLoaded: any, totalFiles: any) => {
			console.debug('Phaser:BootState:File load start', { progress, cacheKey, success, totalLoaded, totalFiles });
		});
		this.load.onFileComplete.add((progress: any, cacheKey: any, success: any, totalLoaded: any, totalFiles: any) => {
			console.debug('Phaser:BootState:File load complete', { progress, cacheKey, success, totalLoaded, totalFiles });
		});
		this.load.onLoadComplete.add(() => {
			console.debug('Phaser:BootState:Assets load complete');
		});

		this.load.image('preloader', 'assets/landscape/background.png');

		this.eventEmiter.emit(PHASER_BOOT_STATE_PRELOAD_EVENT, this.game, this);
	}

	public create() {
		console.debug('Phaser:BootState:create');
		const sprite = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
		sprite.anchor.set(0.5, 0.5);

		this.countLabel = this.add.text(this.game.world.centerX, this.game.world.centerY, '-', {
			font: '32px ' + this.theme.primaryFont,
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 8,
			align: 'center',
		});
		this.countLabel.anchor.set(0.5, 0);

		this.subscriptions.add(this.lifeTime$.subscribe(this.counter$));
	}

	public update() {
		console.debug('Phaser:BootState:update');
		this.counter += Date.now() - this.last;
		this.last = Date.now();

		this.countLabel.text = `counter$: ${this.counter$.getValue()}
counter: ${Math.floor(this.counter / 100)}
real: ${Math.floor((Date.now() - this.start) / 100)}`;
	}

	public shutdown() {
		console.debug('Phaser:BootState:shutdown');

		this.subscriptions.unsubscribe();

		this.eventEmiter.emit(PHASER_BOOT_STATE_SHUTDOWN_EVENT, this.game, this);
	}

	public paused() {
		console.debug('Phaser:BootState:paused');
		this.pause$.next(true);
	}

	public resumed() {
		console.debug('Phaser:BootState:resumed');
		this.pause$.next(false);
		this.last = Date.now();
	}
}
