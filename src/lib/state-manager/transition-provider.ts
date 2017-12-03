import { interfaces } from 'inversify/dts/interfaces/interfaces';
import { IState } from './state';
import { IStateTransitionProvider, StateManager } from './state-manager';

export function TransitionProvider(context: interfaces.Context) {
	return (manager: StateManager, prev: IState, next: IState) => {
		console.debug('state:transition:provider:', prev, next);
		const transition = context.container.get<IStateTransitionProvider>('state:transition:default-transition');
		return transition(manager, prev, next);
	};
}
