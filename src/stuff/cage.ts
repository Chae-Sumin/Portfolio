// 동물우리 클래스

import Stuff from "./stuff";

class Cage extends Stuff {
	fences: Stuff[] = [];
	constructor(width: number, x: number, y: number) {
		super('cage', width, 700, x, y, {noImage: true, noZIndex: true});

		this.fences = [
			new Stuff('fence_f', width - 100, 150, 50, 0, {parent: this, addZIndex: -20}),
			new Stuff('fence_f', width - 100, 150, 50, 560, {parent: this}),
			new Stuff('fence_s', 49, 670, 30, 30, {parent: this, addZIndex: -570}),
			new Stuff('fence_s', 49, 670, width - 70, 30, {parent: this, addZIndex: -570}),
		];
	}
}
export default Cage;
