import { containerFactory } from './app/app';
import { StateManager } from './lib/state-manager/state-manager';

console.log('Black Dragon Framework');

window.onload = () => {
	const container = containerFactory();

	const uiStateManager = container.get<StateManager>('ui:state-manager');

	uiStateManager.boot();
};
