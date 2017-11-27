import { inject, injectable } from 'inversify';
import { IState, IStateTransition, StateTransitionManager } from './index';
import { tap } from 'rxjs/operators/tap';

@injectable()
export class StateManager {
	public constructor(@inject('initial-state') private currentState: IState, private tsm: StateTransitionManager) {}

	public changeState(nextState: IState): IStateTransition {
		return this.tsm.transit(this.currentState, nextState).pipe(
			tap(({ next }) => {
				this.currentState = next;
			}),
		);
	}
}
