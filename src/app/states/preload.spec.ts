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
			let result: any = 'No one expects spanish inquisition.';

			state.enterState(emptyState).subscribe((value) => result = value.prev);

			expect(result).toBe(emptyState);
		});
	});
});
