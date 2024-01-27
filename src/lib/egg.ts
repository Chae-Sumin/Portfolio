// 주운 계란을 관리하는 클래스

import { CONTROLLER } from '../global';

interface EggInfo {
	level: number,
	href: string,
	text: string,
}

class Eggs {
	ele: HTMLDivElement;
	holder: HTMLDivElement[] = [];
	level: number = 0;
	eggInfo: EggInfo[] = [
		{
			level: 1,
			text: 'vue\nnumeric\nkeypad',
			href: 'https://github.com/Chae-Sumin/vue-numeric-keypad',
		},
		{
			level: 2,
			text: 'advanced\nellipsis',
			href: 'https://github.com/Chae-Sumin/advanced-ellipsis',
		},
		{
			level: 3,
			text: 'profiles',
			href: 'https://career.programmers.co.kr/pr/cotnmin_1303',
		},
		{
			level: 4,
			text: 'blog',
			href: 'https://cotnmin.dev',
		},
		// {
		// 	level: 5,
		// 	text: 'vue-numeric-keypad',
		// 	href: 'https://github.com/Chae-Sumin/vue-numeric-keypad',
		// },
	];
	constructor() {
		this.ele = document.createElement('div');
		this.ele.classList.add('eggPlate');
		CONTROLLER?.appendChild(this.ele);

		for (let i = 0; i < this.eggInfo.length; i++) {
			const holder = document.createElement('div');
			holder.classList.add('eggHolder');
			this.ele.appendChild(holder);
			this.holder.push(holder);
		}
	}
	levelUp() {
		this.level++;
		if (!this.eggInfo[this.level - 1]) return;
		const egg = document.createElement('a');
		const eggText = document.createElement('span');
		eggText.innerText = this.eggInfo[this.level - 1].text;
		egg.appendChild(eggText);
		egg.setAttribute('href', this.eggInfo[this.level - 1].href);
		egg.setAttribute('target', '_blank');
		egg.onclick = e => e.stopPropagation();
		egg.classList.add('egg');
		egg.classList.add(`egg${this.level}`);
		this.holder[this.level - 1].appendChild(egg);
	}
}
const eggs = new Eggs();

export default eggs;
