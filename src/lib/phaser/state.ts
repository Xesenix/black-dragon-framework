import { injectable } from 'inversify';

export type IPhaserState = any;

@injectable()
export class BaseState {
	public add: any;
	public game: Phaser.Game;
	public load: Phaser.Loader;
	public stage: Phaser.Stage;
}
