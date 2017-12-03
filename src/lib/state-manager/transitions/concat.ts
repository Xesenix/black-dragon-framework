import { concat } from 'rxjs/observable/concat';
import { defer } from 'rxjs/observable/defer';
import { IState } from './../state';
import { IStateTransition, IStateTransitionStep, StateManager } from './../state-manager';

export function ConcatTransition(manager: StateManager, previousState: IState, nextState: IState): IStateTransition {
	return concat<IStateTransitionStep>(
		previousState.leaveState(nextState, manager),
		defer(() => nextState.enterState(previousState, manager)),
	);
}
