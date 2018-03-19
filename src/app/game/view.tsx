import * as React from 'react';
import { hot } from 'react-hot-loader';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { pluck } from 'rxjs/operators/pluck';
import { Subscription } from 'rxjs/Subscription';

import { IAppDataState, IPreloadState } from 'app/reducer';
import { DataStore } from 'lib/data-store/data-store';
import { StateManager } from 'lib/state-manager/index';
import { GameViewState } from './view-state';

export interface IGameViewProps {
	dataStore: DataStore<IAppDataState>;
	stateManager: StateManager;
	state: GameViewState;
}

export interface IGameViewState {
	preload: IPreloadState;
}

class GameView extends React.Component<IGameViewProps, IGameViewState> {
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
				pluck('game:assets'),
				distinctUntilChanged((x: any, y: any) =>
					!!x && !!y && Math.abs(x.progress - y.progress) < 5 && x.complete === y.complete,
				),
			).subscribe((preload: IPreloadState) => {
				console.log('preload', preload);
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

		const backButton = (<a className="btn btn-primary" onClick={ () => stateManager.changeState('initial') }>Back</a>);
		const resetButton = (<a className="btn btn-primary" onClick={ () => stateManager.changeState('game') }>Reset</a>);
		const progress = (<div className="progress progress-bar-striped">
			<div className="progress-bar" style={ { width: `${preload.progress.toFixed(0)}%` } }>
				{ `${preload.description} ${preload.progress.toFixed(0)}%` }
			</div>
		</div>);

		return (<div className="panel panel-primary">
			<div className="panel-heading">Game</div>
			<div className="panel-body" ref={ (element) => state.containerRef$.next(element) }></div>
			<div className="panel-footer">
				{ backButton }
				{ preload.complete ? resetButton : progress }
			</div>
		</div>);
	}
}

export default hot(module)(GameView);
