import { injectable } from 'inversify';
import { of } from 'rxjs/observable/of';
import { IStateTransition } from './index';

export interface IState {
	leaveState(nextState: IState): IStateTransition;
	enterState(previousState: IState): IStateTransition;
}

@injectable()
export class EmptyState implements IState {
	public enterState(previousState: IState): IStateTransition {
		return of({ prev: previousState, next: this });
	}

	public leaveState(nextState: IState): IStateTransition {
		return of({ prev: this, next: nextState });
	}
}
