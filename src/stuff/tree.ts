// 나무 클래스

import Stuff from "./stuff";

type fruits = 'apple' | 'blueberry' | 'peach' | 'orange' | 'lemon' | 'none';

class Tree extends Stuff {
	fruits: Stuff[] = [];
	constructor(name: fruits, x: number, y: number) {
		super('tree', 350, 480, x, y);
		this.ele.classList.add(name);
		if (name === 'none') return;
		this.fruits = [
			new Stuff('fruit', 84, 84, 130, 20, {parent: this, random: 30}),
			new Stuff('fruit', 84, 84, 50, 120, {parent: this, random: 30}),
			new Stuff('fruit', 84, 84, 200, 140, {parent: this, random: 30}),
		];
	}
}
export default Tree;
export type {fruits};
