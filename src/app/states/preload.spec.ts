import { StateManager } from './../../lib/state-manager';
import { EmptyState } from './../../lib/state-manager/state';
import { ConcatTransition } from './../../lib/state-manager/transitions/concat';
import { PreloadState } from './preload';

describe('PreloadState', () => {
	const emptyState = new EmptyState();
	const sm = new StateManager(
		emptyState,
		() => Promise.resolve(emptyState),
		(manager, prev, next) => ConcatTransition(manager, prev, next),
	);
	let state: PreloadState;
	let originalTimeout: number;

	beforeEach(() => {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		state = new PreloadState(document.getElementById('placeholder') as HTMLElement);
	});

	afterEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	describe('enterState', () => {
		it('should reference previous state', () => {
			return state.enterState(emptyState, sm).toPromise().then((value) => {
				expect(value.prev).toBe(emptyState);
			});
		});
	});
});
