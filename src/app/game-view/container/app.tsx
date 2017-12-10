import * as React from 'react';

import 'main.scss';

export interface IAppProps { x?: string; }

export class App extends React.Component<IAppProps, {}> {
	public componentDidMount() {
		console.debug('App:componentDidMount');
	}

	public render(): any {
		const { x = null } = this.props;

		return (<div className="container">
			<div className="row">
				<div className="panel panel-primary">
					<div className="panel-heading">
						<img src={require('assets/preloader/banner.png')}/>
					</div>
					<div className="panel-body">
						<div className="alert alert-info">{ !!x ? `Loading: ${x}` : 'APP READY'}</div>
					</div>
				</div>
			</div>
		</div>);
	}
}
