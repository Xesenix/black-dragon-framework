import { tap } from 'rxjs/operators/tap';
import { IStateTransition, IStateTransitionStep } from './state-manager';
import { inject, injectable } from 'inversify';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { last } from 'rxjs/operators/last';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';
import { EmptyState, IState } from './state';
import { IStateProvider } from './state-provider';

export interface IStateTransitionStep { manager: StateManager; prev: IState; next: IState; }
export type IStateTransition = Observable<IStateTransitionStep>;
export type IStateTransitionProvider = (manager: StateManager, prev: IState, next: IState) => IStateTransition;

@injectable()
export class StateManager {
	public currentState$ = new BehaviorSubject<IState>(new EmptyState());
	public transition$ = new Subject();

	public constructor(
		@inject('state:initial') private initialState: IState,
		@inject('state:state-provider') private stateProvider: IStateProvider,
		@inject('state:transition:provider') private stateTransitionProvider: IStateTransitionProvider,
	) { }

	public boot(): Promise<IStateTransitionStep> {
		return this.initialState.enterState(this.currentState$.getValue(), this).toPromise();
	}

	public changeState(nextStateKey: string): Promise<IStateTransitionStep> {
		return from(this.stateProvider(nextStateKey)).pipe(
			switchMap((nextState: IState): IStateTransition => this.stateTransitionProvider(
				this,
				this.currentState$.getValue(),
				nextState,
			)),
			last(),
			tap(({ next }) => this.currentState$.next(next)),
		).toPromise();
	}
}
