import { Container } from 'inversify';
import {
	EmptyState,
	IState,
	StateManager,
	StateTransitionManager
} from '../lib/state-manager';
import { PreloadState } from './states/preload';

export interface IAppState extends IState {
	update(): void;
}

const Symbols = {
	StateTransitionManager: Symbol('state-transition-manager'),
	StateManager: Symbol('state-manager'),
	CanvasView: Symbol('canvas-view'),
	DataStoreManager: Symbol('data-store-manager'),
	DOMView: Symbol('dom-view'),
};

export const container = new Container();

container.bind<StateTransitionManager>(Symbols.StateTransitionManager);
container.bind<StateManager>(Symbols.StateManager);
container.bind<any>(Symbols.DOMView);
container.bind<any>(Symbols.CanvasView);
container.bind<any>(Symbols.DataStoreManager);
container.bind<IState>('empty-state').toConstantValue(new EmptyState());
container.bind<IState>('preload-state').toConstantValue(new PreloadState());
container.bind<IState>('preload-state-provider').toProvider((context) => () => {
	const state = context.container.get<IState>('preload-state');
	return new Promise<IState>((resolve: (state: IState) => void) => resolve(state));
});
container.bind<IState>('menu-state');
container.bind<IState>('game-state');
container.bind<IState>('configuration-state');
container.bind<IState>('help-state');
