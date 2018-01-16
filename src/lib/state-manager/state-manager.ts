import { inject, injectable } from 'inversify';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { concatMap } from 'rxjs/operators/concatMap';
import { finalize } from 'rxjs/operators/finalize';
import { share } from 'rxjs/operators/share';
import { tap } from 'rxjs/operators/tap';
import { Subject } from 'rxjs/Subject';
import { EmptyState, IState } from './state';
import { IStateTransition, IStateTransitionStep } from './state-manager';
import { IStateProvider } from './state-provider';
export interface IStateTransitionStep { manager: StateManager; next: IState; prev: IState; context: any; }
export type IStateTransition = Observable<IStateTransitionStep>;
export type IStateTransitionProvider = (manager: StateManager, next: IState, prev: IState) => IStateTransition;

@injectable()
export class StateManager {
	public currentState$ = new BehaviorSubject<IState>(new EmptyState());
	public transitionQueue$ = new Subject<{
		next: IState,
		error: (err: any) => void,
		complete: (value?: IStateTransitionStep | PromiseLike<IStateTransitionStep>) => void,
		context: any,
	}>();

	public constructor(
		@inject('state:state-provider') private stateProvider: IStateProvider,
		@inject('state:transition:provider') stateTransitionProvider: IStateTransitionProvider,
		@inject('debug:console') private console: Console,
	) {
		this.transitionQueue$
			.pipe(
				concatMap(
					({ next, error, complete, context }) => {
						const prev = this.currentState$.getValue();
						const transitionGroupName = `change state: ${prev.$$key} => ${next.$$key}`;
						this.console.group(transitionGroupName);
						return stateTransitionProvider(
								this,
								this.currentState$.getValue(),
								next,
							)
							.pipe(
								tap({
									error: (err) => {
										this.console.error('StateManager:changeState:error', err);
										error(err);
									},
									complete: () => {
										this.currentState$.next(next);
										complete({
											next,
											prev,
											manager: this,
											context,
										});
									},
								}),
								finalize(() => {
									this.console.log('StateManager:changeState:finished');
									this.console.groupEnd();
								}),
								share(),
							);
					},
				),
			)
			.subscribe();
	}

	public boot(): Promise<IStateTransitionStep> {
		const transitionGroupName = `boot state: initial`;
		this.console.group(transitionGroupName);
		return this.stateProvider('initial')
			.then(
				(state) => state.enterState(this.currentState$.getValue(), this).toPromise(),
			)
			.then(
				(transition) => {
					this.console.log('StateManager:bootState:finish', transition);
					this.console.groupEnd();
					this.currentState$.next(transition.next);
					return transition;
				},
				(err) => {
					this.console.error('BootStateError', err.message);
					this.console.groupEnd();
					return err;
				},
			);
	}

	public changeState(nextStateKey: string, context: any = {}): Promise<IStateTransitionStep> {
		return new Promise((complete, error) => {
			this.stateProvider(nextStateKey).then((next: IState) => {
				this.transitionQueue$.next({ next, complete, error, context });
			});
		});
	}
}
