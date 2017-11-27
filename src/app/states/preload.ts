import { injectable } from 'inversify';
import { IState, IStateTransition } from '../../lib/state-manager';
import { last } from 'rxjs/operators/last';
import { mapTo } from 'rxjs/operators/mapTo';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';
import { timer } from 'rxjs/observable/timer';

@injectable()
export class PreloadState {
	public loadState() {
		return timer(0, 100).pipe(
			tap((x) => console.log('Loading StateA: ', x)),
			take(10),
		);
	}

	public cleanState() {
		return timer(0, 100).pipe(
			tap((x) => console.log('Unload StateA: ', x)),
			take(10),
		);
	}

	public enterState(previousState: IState): IStateTransition {
		return this.loadState().pipe(last(), mapTo({ prev: previousState, next: this }));
	}

	public leaveState(nextState: IState): IStateTransition {
		return this.cleanState().pipe(last(), mapTo({ prev: this, next: nextState }));
	}
}
