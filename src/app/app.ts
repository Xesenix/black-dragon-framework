import { GameViewState } from 'app/game/view-state';
import { WelcomeViewState } from 'app/welcome/view-state';
import { Container } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { IStateTransitionProvider, StateManager } from 'lib/state-manager';
import { IState } from 'lib/state-manager/state';
import { IStateProvider, StateProvider } from 'lib/state-manager/state-provider';
import { TransitionProvider } from 'lib/state-manager/transition-provider';
// import { ConcatTransition } from 'lib/state-manager/transitions/concat';
import { ParallelTransition } from 'lib/state-manager/transitions/parallel';
import { Reducer } from 'redux';
import { IAppDataState, reducer } from './reducer';

export const containerFactory = () => {
	const container = new Container();

	// state management
	container.bind<IStateProvider>('state:state-provider').toProvider(StateProvider);
	container.bind<IStateTransitionProvider>('state:transition:default-transition').toConstantValue(ParallelTransition);
	container.bind<IStateTransitionProvider>('state:transition:provider').toFactory(TransitionProvider);
	container.bind<StateManager>('ui:state-manager').to(StateManager);

	// app view states
	container.bind<IState>('state:initial').to(WelcomeViewState);
	container.bind<IState>('state:game').to(GameViewState);

	// rendering DOM
	container.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);
	container.bind<ReactRenderer>('ui:renderer').to(ReactRenderer).inSingletonScope();

	// setup data store
	container.bind<IAppDataState>('data-store:initial-state').toConstantValue({});
	container.bind<Reducer<IAppDataState>>('data-store:action-reducer').toConstantValue(reducer);
	if (process.env.NODE_ENV !== 'production') {
		container.bind<Reducer<IAppDataState>>('data-store:store-enhancer')
		.toConstantValue(
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
		);
	}
	container.bind<DataStore<IAppDataState>>('data-store').to(DataStore).inSingletonScope();

	return container;
};
