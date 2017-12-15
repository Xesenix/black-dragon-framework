import { inject, injectable } from 'inversify';
import * as React from 'react';
import { render } from 'react-dom';

@injectable()
export class ReactRenderer {
	constructor(
		@inject('ui:root') private uiRoot: HTMLElement,
	) { }

	public render(component: any) {

		render((<div>Layout: { component }</div>), this.uiRoot);
	}
}
