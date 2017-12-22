import { EventEmitter } from 'events';
import { GameStatesModule } from 'game/states/states.module';
import { Container } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
import { PhaserModule } from 'lib/phaser/phaser.module';
import { ReactRenderer } from 'lib/renderer/react-renderer';
import { StateManager } from 'lib/state-manager';
import { StateManagerModule } from 'lib/state-manager/state-manager.module';
import { Reducer } from 'redux';
import { IAppDataState, reducer } from './reducer';
import { UIStatesModule } from './ui-states.module';

import 'styles/main.scss';

export class AppModule extends Container {
	constructor() {
		super();

		// event manager
		this.bind<EventEmitter>('event-manager').toConstantValue(new EventEmitter());

		// phaser
		this.load(PhaserModule());

		// state management
		this.load(StateManagerModule());
		this.load(UIStatesModule());
		this.load(GameStatesModule());

		// rendering DOM
		this.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);
		this.bind<ReactRenderer>('ui:renderer').to(ReactRenderer).inSingletonScope();

		// setup data store
		this.bind<IAppDataState>('data-store:initial-state').toConstantValue({});
		this.bind<Reducer<IAppDataState>>('data-store:action-reducer').toConstantValue(reducer);
		if (process.env.NODE_ENV !== 'production') {
			this.bind<Reducer<IAppDataState>>('data-store:store-enhancer')
				.toConstantValue(
					window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
				);
		}
		this.bind<DataStore<IAppDataState>>('data-store').to(DataStore).inSingletonScope();
	}

	public boot() {
		const uiStateManager = this.get<StateManager>('state:state-manager');

		uiStateManager.boot();
	}
}
