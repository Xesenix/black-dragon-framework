import { IState } from './../state';
import { IStateTransition, StateManager } from './../state-manager';
import { IStateTransitionStep } from '../state-manager';
import { merge } from 'rxjs/observable/merge';

export function ParallelTransition(manager: StateManager, previousState: IState, nextState: IState): IStateTransition {
	return merge<IStateTransitionStep>(
		previousState.leaveState(nextState, manager),
		nextState.enterState(previousState, manager),
	);
}
