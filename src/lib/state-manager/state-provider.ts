import { interfaces } from 'inversify';
import { IState } from './state';

export type IStateProvider = (key: string) => Promise<IState>;

export function StateProvider(context: interfaces.Context) {
	return (key: string): Promise<IState> => {
		console.debug('StateProvider:provide', key);
		try {
			const state = context.container.get<IState>(`state:${key}`);
			return Promise.resolve(state);
		} catch (error) {
			console.debug('StateProvider:error', key);
			return Promise.reject(error);
		}
	};
}
