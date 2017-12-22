import { ContainerModule, interfaces } from 'inversify';
import { IStateTransitionProvider, StateManager } from './state-manager';
import { IStateProvider, StateProvider } from './state-provider';
import { TransitionProvider } from './transition-provider';
import { ParallelTransition } from './transitions/parallel';

export const StateManagerModule = () => new ContainerModule((bind: interfaces.Bind) => {
	bind<IStateProvider>('state:state-provider').toProvider(StateProvider);
	bind<IStateTransitionProvider>('state:transition:default-transition').toConstantValue(ParallelTransition);
	bind<IStateTransitionProvider>('state:transition:provider').toFactory(TransitionProvider);
	bind<StateManager>('state:state-manager').to(StateManager);
});
