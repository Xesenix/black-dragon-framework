import { IAppDataState, IPreloadState } from 'app/reducer';
import { DataStore } from 'lib/data-store/data-store';
import { StateManager } from 'lib/state-manager/index';
import * as React from 'react';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { pluck } from 'rxjs/operators/pluck';
import { Subscription } from 'rxjs/Subscription';
import { GameViewState } from './view-state';

export interface IGameViewProps {
	dataStore: DataStore<IAppDataState>;
	stateManager: StateManager;
	state: GameViewState;
}

export interface IGameViewState {
	preload: IPreloadState;
}

export class GameView extends React.Component<IGameViewProps, IGameViewState> {
	private subscription: Subscription = new Subscription();

	constructor(props: IGameViewProps, context: any) {
		super(props, context);
		console.log('context', context);
		this.state = {
			preload: { progress: 0, description: '', complete: false },
		};
	}

	public componentDidMount() {
		const { dataStore = null } = this.props;

		if (dataStore !== null) {
			this.subscription.add(dataStore.asObservable().pipe(
				pluck('preload'),
				pluck('assets'),
				distinctUntilChanged((x: any, y: any) => !!x && !!y && x.progress === y.progress),
			).subscribe((preload: IPreloadState) => {
				this.setState({ preload });
			}));
		}
	}

	public componentWillUnmount() {
		this.subscription.unsubscribe();
	}

	public render(): any {
		const { preload } = this.state;
		const { stateManager, state } = this.props;

		const startButton = (<a className="btn btn-primary" onClick={ () => stateManager.changeState('initial') }>Reset</a>);

		return (<div className="panel panel-primary">
			<div className="panel-heading">Game</div>
			<div className="panel-body" ref={ (element) => state.containerRef$.next(element) }></div>
			<div className="panel-footer">
				{ preload.complete ? startButton : `${preload.description} ${preload.progress.toFixed(0)}%` }
			</div>
		</div>);
	}
}
