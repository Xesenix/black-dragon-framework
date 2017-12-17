import { interfaces } from 'inversify';
import { IPhaserState } from './state';

export type IPhaserProvider = (parent: any) => Promise<IPhaserState>;

export function PhaserProvider(context: interfaces.Context) {
	console.debug('PhaserProvider');
	return (parent: any): Promise<IPhaserState> => {
		console.debug('PhaserProvider:provide', parent);
		const antialias = false;
		const disableWebAudio = true;
		const width = 600;
		const height = 480;
		const renderer = Phaser.CANVAS;
		const multiTexture = true;
		const enableDebug = true;

		window.PhaserGlobal = {
			disableWebAudio, // that bit is important for ram consumption (true == less ram consumption)
		};

		const game = new Phaser.Game({
			antialias,
			width,
			height,
			renderer,// Phaser. AUTO, WEBGL, CANVAS, HEADLESS, WEBGL_MULTI
			parent,
			multiTexture,
			enableDebug,
		});

		try {
			game.state.add('boot', context.container.get<IPhaserState>('state:game/boot'));
			return Promise.resolve(game);
		} catch (error) {
			console.debug('PhaserProvider:error', parent, error);
			return Promise.reject(error);
		}
	};
}
