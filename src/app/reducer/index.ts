import { AnyAction } from 'redux';

export interface IAppState {
	preload?: {
		[key: string]: {
			progress: number;
			description?: string;
		};
	};
}

export const reducer = (state: IAppState = {}, action: AnyAction) => {
	switch (action.type) {
		case 'PRELOAD:SET_PROGRESS': {
			const { namespace = 'assets', progress = 0, description } = action.payload;
			const preload = state.preload || {};
			state.preload = { ...preload, [namespace]: { progress, description } };
			break;
		}
	}
	return state;
};
