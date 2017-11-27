import { container, IAppState } from './app/app';

console.log('Black Dragon Framework');

const emptyState = container.get<IAppState>('empty-state');
const state = container.get<IAppState>('preload-state');
state.enterState(emptyState);
