import { GameViewState } from 'app/game/view-state';
import { WelcomeViewState } from 'app/welcome/view-state';
import { ContainerModule, interfaces } from 'inversify';
import { IState } from 'lib/state-manager/state';

export const UIStatesModule = () => new ContainerModule((bind: interfaces.Bind) => {
	// app view states
	bind<IState>('state:initial').to(WelcomeViewState).inSingletonScope();
	bind<IState>('state:game').to(GameViewState).inSingletonScope();
});
