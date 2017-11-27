import { Container } from 'inversify';
import { EmptyState } from './state';
import { StateManager } from './state-manager';
import { StateTransitionManager } from './state-transition';

describe('StateManager', () => {
	const container = new Container();
	container.bind<StateTransitionManager>(StateTransitionManager).toSelf();
	container.bind<StateManager>(StateManager).toSelf();
	container.bind<EmptyState>('initial-state').toConstantValue(new EmptyState());

	beforeEach(() => {
		container.snapshot();
	});

	afterEach(() => {
		container.restore();
	});

	describe('changeState', () => {
		it('should run', () => {
			const sm: StateManager = container.get<StateManager>(StateManager);
			let result: any = 'no one expects spanish inquisition';
			const nextState = new EmptyState();

			sm.changeState(nextState).subscribe((value) => result = value);

			expect(result.next).toBe(nextState);
		});
	});
});
