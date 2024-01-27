// 필드에 놓여있는 계란 클래스

import Stuff from "./stuff";
import { fieldEggs } from "../global";
import eggs from "../lib/egg";

class Egg extends Stuff {
	constructor(x: number, y: number) {
		super('egg', 48, 66, x, y, {noImage: true, tag: 'button'});
		this.ele.addEventListener('click', () => {
			this.ele.remove();
			fieldEggs.delete(this);
			eggs.levelUp();
		});
		fieldEggs.add(this);
	}
}
export default Egg;
