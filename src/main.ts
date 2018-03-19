import 'p2';
import 'pixi';
import 'phaser';

import { AppModule } from 'app/app.module';

console.log('Black Dragon Framework');

window.onload = () => {
	const app = new AppModule();
	app.boot();
};
