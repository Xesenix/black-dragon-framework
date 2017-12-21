import { tap } from 'rxjs/operators/tap';
import { inject, injectable } from 'inversify';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { concatMap } from 'rxjs/operators/concatMap';
import { finalize } from 'rxjs/operators/finalize';
import { share } from 'rxjs/operators/share';
import { Subject } from 'rxjs/Subject';
import { EmptyState, IState } from './state';
import { IStateTransition, IStateTransitionStep } from './state-manager';
import { IStateProvider } from './state-provider';
export interface IStateTransitionStep { manager: StateManager; next: IState; prev: IState; }
export type IStateTransition = Observable<IStateTransitionStep>;
export type IStateTransitionProvider = (manager: StateManager, next: IState, prev: IState) => IStateTransition;

@injectable()
export class StateManager {
	public currentState$ = new BehaviorSubject<IState>(new EmptyState());
	public transitionQueue$ = new Subject<{
		next: IState,
		error: (err: any) => void,
		complete: (value?: IStateTransitionStep | PromiseLike<IStateTransitionStep>) => void,
	}>();

	public constructor(
		@inject('state:initial') private initialState: IState,
		@inject('state:state-provider') private stateProvider: IStateProvider,
		@inject('state:transition:provider') private stateTransitionProvider: IStateTransitionProvider,
	) {
		this.transitionQueue$.pipe(
			concatMap(({ next, error, complete }) => {
				const prev = this.currentState$.getValue();
				const transitionGroupName = `change state: ${prev.$$key} => ${next.$$key}`;
				console.group(transitionGroupName);
				return this.stateTransitionProvider(
					this,
					this.currentState$.getValue(),
					next,
				).pipe(
					tap({
						error: (err) => {
							console.error('StateManager:changeState:error', err);
							error(err);
						},
						complete: () => {
							this.currentState$.next(next);
							complete({
								next,
								prev,
								manager: this,
							});
						},
					}),
					finalize(() => {
						console.log('StateManager:changeState:finished');
						console.groupEnd();
					}),
					share(),
				);
			}),
		).subscribe((x) => console.log('StateManager === transition', x));
	}

	public boot(): Promise<IStateTransitionStep> {
		const transitionGroupName = `boot state: initial`;
		console.group(transitionGroupName);
		return this.initialState.enterState(this.currentState$.getValue(), this)
			.toPromise()
			.then((transition) => {
				console.log('StateManager:bootState:finish');
				console.groupEnd();
				this.currentState$.next(transition.next);
				return transition;
			}, (err) => {
				console.error('BootStateError', err.message);
				console.groupEnd();
				return err;
			});
	}

	public changeState(nextStateKey: string): Promise<IStateTransitionStep> {
		return new Promise((complete, error) => {
			this.stateProvider(nextStateKey).then((next: IState) => {
				this.transitionQueue$.next({ next, complete, error });
			});
		});
	}
}
