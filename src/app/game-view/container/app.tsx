import * as React from 'react';

import 'styles/main.scss';

export interface IAppProps { x?: number; }

export class App extends React.Component<IAppProps, {}> {
	public componentDidMount() {
		console.debug('App:componentDidMount');
	}

	public render(): any {
		const { x = null } = this.props;

		const progress: number = x === null ? 100 : +x;

		return (<div className="container">
			<div className="row">
				<div className="panel panel-primary">
					<div className="panel-heading">
						<img src={require('assets/preloader/banner.png')}/>
						<h1>Welcome</h1>
					</div>
					<div className="panel-body">
						<div className="alert alert-info">
							<span className="glyphicon glyphicon-pawn"></span>
							{ !!x ? `Loading: ${progress.toFixed(0)}` : 'APP READY'}
						</div>
					</div>
					<div className="panel-footer">
						<div className="progress">
							<div
								className="progress-bar progress-bar-striped"
								style={ { width: `${progress}%` } }
							>{ progress.toFixed(0) }%</div>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
}
