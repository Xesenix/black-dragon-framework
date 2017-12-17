import { inject, injectable } from 'inversify';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';
import { EmptyState, IState } from './state';
import { IStateTransition, IStateTransitionStep } from './state-manager';
import { IStateProvider } from './state-provider';
export interface IStateTransitionStep { manager: StateManager; prev: IState; next: IState; }
export type IStateTransition = Observable<IStateTransitionStep>;
export type IStateTransitionProvider = (manager: StateManager, prev: IState, next: IState) => IStateTransition;

@injectable()
export class StateManager {
	public currentState$ = new BehaviorSubject<IState>(new EmptyState());
	public currentStateName$ = new BehaviorSubject<string>('none');
	public transition$ = new Subject();

	public constructor(
		@inject('state:initial') private initialState: IState,
		@inject('state:state-provider') private stateProvider: IStateProvider,
		@inject('state:transition:provider') private stateTransitionProvider: IStateTransitionProvider,
	) { }

	public boot(): Promise<IStateTransitionStep> {
		const transitionGroupName = `boot state: initial`;
		console.group(transitionGroupName);
		return this.initialState.enterState(this.currentState$.getValue(), this)
			.toPromise()
			.then((transition) => {
				console.log('StateManager:bootState:finish');
				console.groupEnd();
				this.currentState$.next(transition.next);
				this.currentStateName$.next('initial');
				return transition;
			}, (err) => {
				console.error('BootStateError', err.message);
				console.groupEnd();
				return err;
			});
	}

	public changeState(nextStateKey: string): Promise<IStateTransitionStep> {
		const transitionGroupName = `change state: ${this.currentStateName$.getValue()} => ${nextStateKey}`;
		console.group(transitionGroupName);
		return from(this.stateProvider(nextStateKey)).pipe(
				switchMap((nextState: IState): IStateTransition => this.stateTransitionProvider(
					this,
					this.currentState$.getValue(),
					nextState,
				)),
			)
			.toPromise()
			.then((transition) => {
				console.log('StateManager:changeState:finished');
				console.groupEnd();
				this.currentState$.next(transition.next);
				this.currentStateName$.next(nextStateKey);
				return transition;
			}, (err) => {
				console.error('StateManager:changeState:error', err);
				console.groupEnd();
				return err;
			});
	}
}
