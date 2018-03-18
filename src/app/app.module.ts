import { EventEmitter } from 'events';
import { Container } from 'inversify';

import { GameStatesModule } from 'game/states/states.module';
import { DataStoreModule } from 'lib/data-store/data-store.module';
import { IDictionary } from 'lib/dictionary/dictionary.d';
import { FlatDictionary } from 'lib/dictionary/flat-dictionary';
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

		// console
		if (process.env.NODE_ENV === 'dev') {
			this.bind<Console>('debug:console').toConstantValue(console);
		} else {
			// tslint:disable:no-empty
			const noop = () => {};
			this.bind<Console>('debug:console').toConstantValue({
				assert: noop,
				debug: noop,
				error: noop,
				log: noop,
				trace: noop,
				group: noop,
				groupEnd: noop,
			} as Console);
		}

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

		// environment
		this.bind<IDictionary>('player-pref').toConstantValue(new FlatDictionary({
			debug: process.env.NODE_ENV !== 'production',
		}));

		this.bind<IDictionary>('environment').toConstantValue(new FlatDictionary({}));
	}

	public boot() {
		const uiStateManager = this.get<StateManager>('state:state-manager');
		const console = this.get<Console>('debug:console');

		console.trace('Black Dragon Framework');
		uiStateManager.boot();
	}
}
