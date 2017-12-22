import { ContainerModule, interfaces } from 'inversify';
import { IPhaserState } from 'lib/phaser/state';
import { BootState } from './boot';
import { PreloadState } from './preload';

export const GameStatesModule = () => new ContainerModule((bind: interfaces.Bind) => {
	// phaser game states
	bind<IPhaserState>('state:game/boot').to(BootState).whenTargetTagged('engine', 'phaser');
	bind<IPhaserState>('state:game/preload').to(PreloadState).whenTargetTagged('engine', 'phaser');
	// container.bind<IPhaserState>('state:game/menu').to(MenuState).whenTargetTagged('engine', 'phaser');

	bind<string[]>('phaser:states').toConstantValue([
		'state:game/boot',
		'state:game/preload',
	]);
});
