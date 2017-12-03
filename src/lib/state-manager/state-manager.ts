import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { from } from 'rxjs/observable/from';
import { inject, injectable } from 'inversify';
import { IState, IStateTransition } from './index';
import { IStateProvider } from './state-provider';
import { last } from 'rxjs/operators/last';
import { Observable } from 'rxjs/observable';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { Subject } from 'rxjs/Subject';

export type IStateTransitionStep = { manager: StateManager, prev: IState, next: IState };
export type IStateTransition = Observable<IStateTransitionStep>;
export type IStateTransitionProvider = (manager: StateManager, prev: IState, next: IState) => IStateTransition;

@injectable()
export class StateManager {
	public currentState$ = new BehaviorSubject(this.currentState);
	public transition$ = new Subject();

	public constructor(
		@inject('state:initial') private currentState: IState,
		@inject('state:state-provider') private stateProvider: IStateProvider,
		@inject('state:transition:provider') private stateTransitionProvider: IStateTransitionProvider,
	) {	}

	public changeState(nextStateKey: string): IStateTransition {
		return from(this.stateProvider(nextStateKey)).pipe(
			switchMap((nextState: IState): IStateTransition => this.stateTransitionProvider(this, this.currentState, nextState)),
			last(),
			tap(({ next }) => this.currentState$.next(next)),
		);
	}
}
