import { ContainerModule, interfaces } from 'inversify';
import { IPhaserProvider, PhaserProvider } from './phaser-provider';

export const PhaserModule = () => new ContainerModule((bind: interfaces.Bind) => {
	bind<IPhaserProvider>('phaser:phaser-provider').toProvider(PhaserProvider);
});
