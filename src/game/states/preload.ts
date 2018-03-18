import { BaseState } from 'lib/phaser/state';

import { inject, injectable } from 'lib/di';

import 'phaser-ce';

@injectable()
export class PreloadState extends BaseState {
	private asset: any;

	@inject('debug:console') private console: Console;

	public init() {
		this.console.debug('Phaser:PreloadState:init');

		this.asset = null;
	}

	public preload() {
		this.console.debug('Phaser:PreloadState:preload');
		this.asset = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.load.image('game-logo', 'assets/ui/logo.png');
		this.load.image('button', 'assets/ui/button.png');

		this.load.atlas('assets', 'assets/assets.png', 'assets/assets.json',
			Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('landscape', 'assets/landscape.png', 'assets/landscape.json',
			Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('demon', 'assets/characters/demon.png', 'assets/characters/demon.json',
			Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('observer', 'assets/characters/observer.png', 'assets/characters/observer.json',
			Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('soul', 'assets/characters/soul.png', 'assets/characters/soul.json',
			Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
		this.load.atlas('minion', 'assets/characters/minion.png', 'assets/characters/minion.json',
			Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

		this.load.image('fire_rock_tileset', 'assets/map/rock_tileset.png');
		this.load.image('fire_rock_tileset_ground', 'assets/map/fire_rock_tileset_ground.png');
		this.load.image('fire_rock_tileset_background', 'assets/map/fire_rock_tileset_background.png');
		this.load.image('fire_rock_tileset_sky', 'assets/map/fire_rock_tileset_sky.png');
		this.load.image('minimap_tileset', 'assets/map/minimap_tileset.png');

		this.load.spritesheet('mute', 'assets/ui/mute.png', 64, 64);

		this.load.audio('dark_world', 'assets/music/dark_world.ogg');
		this.load.audio('sadness', 'assets/music/sadness.ogg');
		this.load.audio('down_the_cave', 'assets/music/down_the_cave.ogg');

		this.load.audio('crush_fx', 'assets/sounds/crush_rocks_in_cave_00.wav');
		this.load.audio('dirt_fx', 'assets/sounds/dirt_fx.wav');
		this.load.audio('lava_fx', 'assets/sounds/lava_in_cave_00.wav');
		this.load.audio('brick_fx', 'assets/sounds/brick_in_cave_00.wav');
		this.load.audio('light_fx', 'assets/sounds/light_fx.wav');
		this.load.audio('build_fx', 'assets/sounds/build_fx.ogg');

		this.load.audio('dig_rock_fx', 'assets/sounds/dig_rock.wav');
		this.load.audio('dig_plant_fx', 'assets/sounds/dig_plant.wav');
		this.load.audio('dig_thorns_fx', 'assets/sounds/dig_thorns.wav');
		this.load.audio('dig_crystal_fx', 'assets/sounds/dig_crystal.wav');
		this.load.audio('dig_low_energy_fx', 'assets/sounds/dig_low_energy.wav');

		this.game.renderer.setTexturePriority([
			'bookstand00',
			'bookcase00',
			'den00',
			'throne00',
			'window00',
			'dungeon_heart00',
			'rocks00',
			'rocks01',
			'rocks02',
			'rocks03',
			'rocks04',
			'rocks05',
			'rocks06',
			'crystal00',
			'crystal01',
			'pebble00',
			'pebble01',
			'pebble02',
			'grass00',
			'bush00',
			'thorns00',
			'thorns01',
			'tentacles00',
			'tentacles01',
			'tentacles02',
			'court',
			'claudron',
		]);
	}

	public create() {
		this.console.debug('Phaser:PreloadState:create');
		this.asset.cropEnabled = false;
	}

	public onLoadComplete() {
		this.console.debug('Phaser:PreloadState:onLoadComplete');
		this.game.state.start('intro');
	}
}
