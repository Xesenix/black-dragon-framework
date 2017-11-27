import { injectable } from 'inversify';
import { Observable } from 'rxjs/observable';
import { switchMap } from 'rxjs/operators/switchMap';

import { IState } from './state';

export type IStateTransition = Observable<{ prev: IState, next: IState }>;

@injectable()
export class StateTransitionManager {
	public transit(previousState: IState, nextState: IState): IStateTransition {
		return previousState.leaveState(nextState).pipe(
			switchMap(() => nextState.enterState(previousState)),
		);
	}
}
