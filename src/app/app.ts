import { Container } from 'inversify';
import { IStateTransitionProvider, StateManager } from './../lib/state-manager';
import { IState } from './../lib/state-manager/state';
import { IStateProvider, StateProvider } from './../lib/state-manager/state-provider';
import { TransitionProvider } from './../lib/state-manager/transition-provider';
import { ParallelTransition } from './../lib/state-manager/transitions/parallel';
import { PreloadState } from './states/preload';

declare const document: Document;

export const containerFactory = () => {
	const container = new Container();

	container.bind<IStateProvider>('state:state-provider').toProvider(StateProvider);
	container.bind<IStateTransitionProvider>('state:transition:default-transition').toConstantValue(ParallelTransition);
	container.bind<IStateTransitionProvider>('state:transition:provider').toFactory(TransitionProvider);
	container.bind<StateManager>('ui:state-manager').to(StateManager);
	container.bind<IState>('state:initial').to(PreloadState);
	console.log('document', document.getElementById('app'));
	container.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);

	return container;
};
