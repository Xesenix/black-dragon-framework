import { EventEmitter } from 'events';
import { GameStatesModule } from 'game/states/states.module';
import { Container } from 'inversify';
import { DataStoreModule } from 'lib/data-store/data-store.module';
import { PhaserModule } from 'lib/phaser/phaser.module';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { StateManager } from 'lib/state-manager';
import { StateManagerModule } from 'lib/state-manager/state-manager.module';
import { ThemeModule } from 'lib/theme/theme.module';
import { IAppDataState, reducer } from './reducer';
import { UIStatesModule } from './ui-states.module';

import 'styles/main.scss';

/**
 * Main module for application. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @class AppModule
 * @extends {Container}
 */
export class AppModule extends Container {
	constructor() {
		super();

		// event manager
		this.bind<EventEmitter>('event-manager').toConstantValue(new EventEmitter());

		// phaser
		this.load(ThemeModule());
		this.load(PhaserModule());

		// state management
		this.load(StateManagerModule());
		this.load(UIStatesModule());
		this.load(GameStatesModule());

		// rendering DOM
		this.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);
		this.bind<ReactRenderer>('ui:renderer').to(ReactRenderer).inSingletonScope();

		// setup data store
		this.load(DataStoreModule<IAppDataState>({}, reducer, process.env.NODE_ENV !== 'production'));
	}

	public boot() {
		const uiStateManager = this.get<StateManager>('state:state-manager');

		uiStateManager.boot();
	}
}
