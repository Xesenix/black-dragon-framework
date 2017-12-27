import 'phaser-ce';

export class Game extends Phaser.Game {
	public mount(parent: any): void {
		parent.appendChild(this.canvas);
		this.parent = parent;
	}
}
