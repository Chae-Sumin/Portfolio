// 키보드 입력을 받아서 이동 방향을 반환하는 함수

import { checkKey } from "../global";

const keycode = {
	w: 1,
	a: 2,
	s: 4,
	d: 8,
};
const codeDirection: {[key: number]: number} = {
	1: 270, // up
	2: 180, // left
	4: 90, // down
	8: 0, // right
	3: 225,
	6: 135,
	9: 315,
	12: 45,
}

const getMove = () => {
	let keycodeSum = 0;
	if (checkKey('ArrowUp', 'w', 'W', 'ㅈ', 'ㅉ')) keycodeSum += keycode.w;
	if (checkKey('ArrowDown', 's', 'S', 'ㄴ')) keycodeSum += keycode.s;
	if (checkKey('ArrowLeft', 'a', 'A', 'ㅁ')) keycodeSum += keycode.a;
	if (checkKey('ArrowRight', 'd', 'D', 'ㅇ')) keycodeSum += keycode.d;
	const isMove = !!keycodeSum;
	const deg = codeDirection[keycodeSum] || 0;

	return {
		isMove,
		deg,
	}
};

export default getMove;
