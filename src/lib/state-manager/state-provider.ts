import { interfaces } from 'inversify';
import { IState } from './state';

export type IStateProvider = (key: string) => Promise<IState>;

export function StateProvider(context: interfaces.Context) {
	const console: Console = context.container.get<Console>('debug:console');
	return (key: string): Promise<IState> => {
		console.debug('StateProvider:provide', key);
		try {
			key = `state:${key}`;
			const state = context.container.get<IState>(key);
			state.$$key = key;
			return Promise.resolve(state);
		} catch (error) {
			console.debug('StateProvider:error', key, error);
			return Promise.reject(error);
		}
	};
}
