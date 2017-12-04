import * as React from 'react';

export interface IAppProps { x?: string; }

export class App extends React.Component<IAppProps, {}> {
	public componentDidMount() {
		console.debug('App:componentDidMount');
	}

	public render(): any {
		const { x = null } = this.props;

		return (<div>{ !!x ? `Loading: ${x}` : 'APP REACT READY'}</div>);
	}
}
