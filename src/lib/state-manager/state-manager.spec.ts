import { Container } from 'inversify';
import { timer } from 'rxjs/observable/timer';
import { mapTo } from 'rxjs/operators/mapTo';
import { take } from 'rxjs/operators/take';
// import { tap } from 'rxjs/operators/tap';
import { EmptyState, IState } from './state';
import { IStateTransition, IStateTransitionProvider, StateManager } from './state-manager';
import { IStateProvider, StateProvider } from './state-provider';
import { TransitionProvider } from './transition-provider';
import { ParallelTransition } from './transitions/parallel';

class MockState extends EmptyState implements IState {
	constructor(public name: string) {
		super();
	}

	public leaveState(nextState: IState, manager: StateManager, context: any = {}): IStateTransition {
		// console.debug(`MockState:leaveState: ${this.name}`);
		return timer(0, 100).pipe(
			// tap((x) => console.debug(`MockState:leaving ${this.name}: ${x}`)),
			take(10),
			mapTo({ prev: (this as IState), next: nextState, manager, context }),
		);
	}

	public enterState(previousState: IState, manager: StateManager, context: any = {}): IStateTransition {
		// console.debug(`MockState:enterState: ${this.name}`);
		return timer(0, 100).pipe(
			// tap((x) => console.debug(`MockState:entering ${this.name}: ${x}`)),
			take(5),
			mapTo({ prev: previousState, next: (this as IState), manager, context }),
		);
	}
}

describe('StateManager', () => {
	const initialState = new MockState('state:initial');
	const preloadState = new MockState('state:preload');
	const menuState = new MockState('state:menu');

	const container = new Container();
	container.bind<StateManager>(StateManager).toSelf();
	container.bind<IState>('state:initial').toConstantValue(initialState);
	container.bind<IState>('state:preload').toConstantValue(preloadState);
	container.bind<IState>('state:menu').toConstantValue(menuState);
	container.bind<IStateProvider>('state:state-provider').toProvider(StateProvider);

	container.bind<IStateTransitionProvider>('state:transition:default-transition').toConstantValue(ParallelTransition);
	container.bind<IStateTransitionProvider>('state:transition:provider').toFactory(TransitionProvider);

	// tslint:disable:no-empty
	const noop = () => {};
	container.bind<Console>('debug:console').toConstantValue({
		assert: noop,
		debug: noop,
		error: noop,
		log: noop,
		trace: noop,
		group: noop,
		groupEnd: noop,
	} as Console);

	beforeEach(() => {
		container.snapshot();
	});

	afterEach(() => {
		container.restore();
	});

	describe('changeState', () => {
		it('should set current state to next state after finishing', (done) => {
			const sm: StateManager = container.get<StateManager>(StateManager);
			const currentState = sm.currentState$.getValue();
			const nextStateKey = 'preload';
			const nextState = container.get<IState>(`state:${nextStateKey}`);
			spyOn(currentState, 'leaveState').and.callThrough();
			spyOn(nextState, 'enterState').and.callThrough();

			// console.debug('=== async start');
			sm.boot()
			.then(() => sm.changeState(nextStateKey))
			.then(
				(value) => {
					expect(value.prev).toBe(currentState);
					expect(value.next).toBe(nextState);
					expect(sm.currentState$.getValue()).toBe(nextState);
					expect(currentState.leaveState).toHaveBeenCalled();
					expect(nextState.enterState).toHaveBeenCalled();
					done();
					// console.debug('=== async completed');
				},
				(err) => {
					console.error(err.message);
					fail('shouldn\'t throw exception');
				},
			);
		});
	});
});
