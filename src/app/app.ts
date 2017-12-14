import { Container } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
import { IStateTransitionProvider, StateManager } from 'lib/state-manager';
import { IState } from 'lib/state-manager/state';
import { IStateProvider, StateProvider } from 'lib/state-manager/state-provider';
import { TransitionProvider } from 'lib/state-manager/transition-provider';
import { ParallelTransition } from 'lib/state-manager/transitions/parallel';
import { Reducer } from 'redux';
import { IAppState, reducer } from './reducer';
import { WelcomeState } from './welcome/state';

declare const document: Document;

declare const window: any;

export const containerFactory = () => {
	const container = new Container();

	// state management
	container.bind<IStateProvider>('state:state-provider').toProvider(StateProvider);
	container.bind<IStateTransitionProvider>('state:transition:default-transition').toConstantValue(ParallelTransition);
	container.bind<IStateTransitionProvider>('state:transition:provider').toFactory(TransitionProvider);
	container.bind<StateManager>('ui:state-manager').to(StateManager);
	container.bind<IState>('state:initial').to(WelcomeState);
	// rendering DOM
	container.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);
	// setup data store
	container.bind<IAppState>('data-store:initial-state').toConstantValue({});
	// container.bind<Subject<IAction>>('data-store:action-stream').toConstantValue(new Subject());
	container.bind<Reducer<IAppState>>('data-store:action-reducer').toConstantValue(reducer);
	container.bind<Reducer<IAppState>>('data-store:store-enhancer').toConstantValue(
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	);
	container.bind<DataStore<IAppState>>('data-store').to(DataStore);

	return container;
};
