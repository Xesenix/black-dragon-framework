import { IAppState } from 'app/reducer';
import { DataStore } from 'lib/data-store/data-store';
import * as React from 'react';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { pluck } from 'rxjs/operators/pluck';

export interface IWelcomeViewProps {
	dataStore: DataStore<IAppState>;
}

export interface IPreloadState {
	progress: number;
	description?: string;
}

export interface IWelcomeViewState {
	preload: IPreloadState;
}

export class WelcomeView extends React.Component<IWelcomeViewProps, IWelcomeViewState> {
	private subscription: () => void;

	constructor(props: IWelcomeViewProps, context: any) {
		super(props, context);

		this.state = {
			preload: { progress: 0, description: '' },
		};
	}

	public componentDidMount() {
		const { dataStore = null } = this.props;

		if (dataStore !== null) {
			this.subscription = dataStore.asObservable().pipe(
				pluck('preload'),
				pluck('assets'),
				distinctUntilChanged((x: any, y: any) => !!x && !!y && x.progress === y.progress),
			).subscribe((preload) => {
				this.setState({ preload });
			}).unsubscribe;
		}
	}

	public componentWillUnmount() {
		if (this.subscription) {
			this.subscription();
		}
	}

	public render(): any {
		const { preload } = this.state;

		return (<div>Welcome { preload.progress.toFixed(0) }</div>);
	}
}
