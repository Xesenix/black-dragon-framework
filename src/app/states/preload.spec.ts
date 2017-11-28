import { EmptyState } from './../../lib/state-manager/state';
import { PreloadState } from './preload';

describe('PreloadState', () => {
	const emptyState = new EmptyState();
	let state: PreloadState;

	beforeEach(() => {
		state = new PreloadState();
	});

	describe('enterState', () => {
		it('should reference previous state', () => {
			return state.enterState(emptyState).toPromise().then((value) => {
				expect(value.prev).toBe(emptyState);
			});
		});
	});
});
