import { interfaces } from 'inversify';
import { IPhaserState } from './state';

let game: any = null;

export type IPhaserProvider = (parent: any) => Promise<Phaser.Game>;

export function PhaserProvider(context: interfaces.Context) {
	console.debug('PhaserProvider');
	return (parent: any, forceNew: boolean = false): Promise<Phaser.Game> => {
		console.debug('PhaserProvider:provide', parent);

		if (!forceNew && game !== null) {
			console.debug('PhaserProvider:swap parent', game);
			parent.appendChild(game.canvas);

			return Promise.resolve(game);
		}

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

		game = new Phaser.Game({
			antialias,
			width,
			height,
			renderer,// Phaser. AUTO, WEBGL, CANVAS, HEADLESS, WEBGL_MULTI
			parent,
			multiTexture,
			enableDebug,
		});

		try {
			console.debug('PhaserProvider:game', game);
			game.state.add('boot', context.container.get<IPhaserState>('state:game/boot'));
			return Promise.resolve(game);
		} catch (error) {
			console.debug('PhaserProvider:error', parent, error);
			return Promise.reject(error);
		}
	};
}
