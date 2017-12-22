import { injectable } from 'inversify';
import { of } from 'rxjs/observable/of';
import { IStateTransition, StateManager } from './index';

export interface IState {
	$$key: string;
	leaveState(nextState: IState, manager: StateManager): IStateTransition;
	enterState(previousState: IState, manager: StateManager): IStateTransition;
}

@injectable()
export class EmptyState implements IState {
	public $$key: string = 'empty';

	public enterState(previousState: IState, manager: StateManager): IStateTransition {
		return of({ prev: previousState, next: this, manager });
	}

	public leaveState(nextState: IState, manager: StateManager): IStateTransition {
		return of({ prev: this, next: nextState, manager });
	}
}
