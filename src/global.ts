// 전역 변수 및 함수

import Character from "./characters/character";
import Egg from "./stuff/egg";
import { MAP_WIDTH, MAP_HEIGHT } from "./constant";

const APP = document.createElement('div'); //앱
APP.id = 'app';
document.body.appendChild(APP);
const FEILD = document.createElement('div'); //필드
FEILD.id = 'field';
APP.appendChild(FEILD);
const CONTROLLER = document.createElement('div'); //조작부
CONTROLLER.id = 'controller';
APP.appendChild(CONTROLLER);
const INTRO = document.createElement('div'); //인트로
INTRO.id = 'intro';
APP.appendChild(INTRO);

const options = {
	indicator: true,
};
window.addEventListener("keydown", ({key, ctrlKey}) => {
	if (['I', 'i', 'ㅑ'].includes(key) && ctrlKey) return options.indicator = !options.indicator;
});

const keyboard = new Set();
window.addEventListener("keydown", ({key}) => keyboard.add(key));
window.addEventListener("keyup", ({key}) => keyboard.delete(key));
function checkKey(...s: string[]): boolean {
	return s.some(key => {
		return keyboard.has(key);
	});
}
// 창이 비활성화 되면 키보드 입력을 초기화
window.addEventListener("blur", () => keyboard.clear());
window.addEventListener("focus", () => keyboard.clear());
// 우클릭 방지
window.addEventListener('contextmenu', (e) => e.preventDefault());

let screenWidth = window.innerWidth; // 스크린 너비
let screenHeight = window.innerHeight; // 스크린 높이
window.addEventListener("resize", () => {
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;
});


let Scale = (() => {
	let scale = Math.max(screenWidth / MAP_WIDTH, screenHeight / MAP_HEIGHT) * 1.8;
	if (FEILD) {
		FEILD.style.transform = `scale(${scale})`;
	}
	return {
		get: () => scale,
		set: (value: number) => {
			value = value < 0.3 ? 0.3 : value;
			value = value > 0.8 ? 0.8 : value;
			scale = value;
			if (FEILD) {
				FEILD.style.transform = `scale(${scale})`;
			}
		},
	}
})(); // 화면 비율
let Fps = (() => {
	let fps = 0;
	return {
		get: () => fps,
		set: (value: number) => fps = value,
	}
})();

const characters: Map<symbol, Character> = new Map();
const fieldEggs: Set<Egg> = new Set();

export { APP, FEILD, CONTROLLER, INTRO, options, keyboard, checkKey, screenWidth, screenHeight, Scale, Fps, characters, fieldEggs };
