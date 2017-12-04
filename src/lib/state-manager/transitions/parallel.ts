import { merge } from 'rxjs/observable/merge';
import { IState } from './../state';
import { IStateTransition, IStateTransitionStep, StateManager } from './../state-manager';

export function ParallelTransition(
	manager: StateManager,
	previousState: IState,
	nextState: IState,
): IStateTransition {
	return merge<IStateTransitionStep>(
		previousState.leaveState(nextState, manager),
		nextState.enterState(previousState, manager),
	);
}
