import { Container } from 'inversify';
import { DataStore } from 'lib/data-store/data-store';
import { Reducer } from 'redux';
import { DataStoreModule } from './data-store.module';

interface IMockAppDataState {
	[key: string]: any;
}

describe('DataStore', () => {
	const container = new Container();
	const reducer = (state = {}, action) => {
		switch (action.type) {
			case 'SET':
				const { key, value } = action.payload;
				state = { ...state, [key]: value };
				break;
		}
		return state;
	};
	container.load(DataStoreModule<IMockAppDataState>({}, reducer));

	beforeEach(() => {
		container.snapshot();
	});

	afterEach(() => {
		container.restore();
	});

	describe('dispatch', () => {
		it('should run reducer on dispatch', () => {
			const initialState = { };
			const reducerSpy = jasmine.createSpy('reducer', reducer);
			container.rebind<Reducer<IMockAppDataState>>('data-store:action-reducer').toConstantValue(reducerSpy);
			container.rebind<IMockAppDataState>('data-store:initial-state').toConstantValue(initialState);
			const dataStore = container.get<DataStore<IMockAppDataState>>('data-store');
			const action = {
				type: 'SET',
				payload: { key: 'test', value: '' },
			};

			dataStore.dispatch(action);

			expect(reducerSpy.calls.mostRecent().args).toEqual([initialState, action]);
		});
	});
});
