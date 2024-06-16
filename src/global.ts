// 전역 변수 및 함수

import Character from "./characters/character";
import Egg from "./stuff/egg";

const APP = document.getElementById("app"); //앱
const FEILD = document.getElementById("field"); //전체 맵
const CONTROLLER = document.getElementById("controller"); //조작부

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

let fps = (() => {
	let fps = 0;
	return {
		get: () => fps,
		set: (value: number) => fps = value,
	}
})();

const characters: Map<symbol, Character> = new Map();
const fieldEggs: Set<Egg> = new Set();

export { APP, FEILD, CONTROLLER, keyboard, checkKey, screenWidth, screenHeight, fps, characters, fieldEggs };
