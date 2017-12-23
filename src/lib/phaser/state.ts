import { injectable } from 'inversify';

import 'phaser-ce';

export type IPhaserState = any;

@injectable()
export class BaseState {
	public add: Phaser.GameObjectFactory;
	public game: Phaser.Game;
	public load: Phaser.Loader;
	public stage: Phaser.Stage;
}
