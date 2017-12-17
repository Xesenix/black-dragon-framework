import { IAppDataState, IPreloadState } from 'app/reducer';
import { DataStore } from 'lib/data-store/data-store';
import { StateManager } from 'lib/state-manager';
import * as React from 'react';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { pluck } from 'rxjs/operators/pluck';
import { Subscription } from 'rxjs/Subscription';

export interface IWelcomeViewProps {
	dataStore: DataStore<IAppDataState>;
	stateManager: StateManager;
}

export interface IWelcomeViewState {
	preload: IPreloadState;
	currentState: any;
}

export class WelcomeView extends React.Component<IWelcomeViewProps, IWelcomeViewState> {
	private subscription: Subscription;

	constructor(props: IWelcomeViewProps, context: any) {
		super(props, context);
		console.log('context', context);
		this.state = {
			currentState: { name: 'none' },
			preload: { progress: 0, description: '', complete: false },
		};
	}

	public componentDidMount() {
		const { stateManager = null, dataStore = null } = this.props;
		this.subscription = new Subscription();

		if (dataStore !== null) {
			this.subscription.add(dataStore.asObservable().pipe(
				pluck('preload'),
				pluck('assets'),
				distinctUntilChanged((x: any, y: any) => !!x && !!y && x.progress === y.progress),
			).subscribe((preload: IPreloadState) => {
				this.setState({ preload });
			}));
		}

		if (stateManager !== null) {
			this.subscription.add(stateManager.currentState$.subscribe((currentState) => {
				this.setState({ currentState });
			}));
		}
	}

	public componentWillUnmount() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	public render(): any {
		const { currentState, preload } = this.state;
		const { stateManager } = this.props;

		const startButton = (<a onClick={ () => stateManager.changeState('game') }>Play</a>);

		return (<div>
			Welcome
			<br/>
			{ currentState.name }
			<br/>
			{ preload.complete ? startButton : `${preload.description} ${preload.progress.toFixed(0)}%` }
		</div>);
	}
}
