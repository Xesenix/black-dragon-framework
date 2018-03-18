import 'phaser-ce';

import { injectable } from 'lib/di';

export type IPhaserState = any;

@injectable()
export class BaseState {
	public add: Phaser.GameObjectFactory;
	public game: Phaser.Game;
	public load: Phaser.Loader;
	public stage: Phaser.Stage;
}
