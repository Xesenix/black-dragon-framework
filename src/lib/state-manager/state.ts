import { of } from 'rxjs/observable/of';
import { IStateTransition, StateManager } from './index';

import { injectable } from 'lib/di';

export interface IState {
	$$key: string;
	leaveState(nextState: IState, manager: StateManager, context?: any): IStateTransition;
	enterState(previousState: IState, manager: StateManager, context?: any): IStateTransition;
}

@injectable()
export class EmptyState implements IState {
	public $$key: string = 'empty';

	public enterState(previousState: IState, manager: StateManager, context: any = {}): IStateTransition {
		return of({ prev: previousState, next: this, manager, context });
	}

	public leaveState(nextState: IState, manager: StateManager, context: any = {}): IStateTransition {
		return of({ prev: this, next: nextState, manager, context });
	}
}
