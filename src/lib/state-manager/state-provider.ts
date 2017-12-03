import { interfaces } from 'inversify/dts/interfaces/interfaces';
import { IState } from './state';

export type IStateProvider = (key: string) => Promise<IState>;

export function StateProvider(context: interfaces.Context) {
	return (key: string): Promise<IState> => {
		console.debug('state:provider:', key);
		const state = context.container.get<IState>(key);
		return Promise.resolve(state);
	};
}
