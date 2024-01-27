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

const characters: Map<symbol, Character> = new Map();
const fieldEggs: Set<Egg> = new Set();

export { APP, FEILD, CONTROLLER, keyboard, checkKey, characters, fieldEggs };
