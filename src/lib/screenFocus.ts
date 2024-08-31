import { MAP_WIDTH, MAP_HEIGHT } from '../constant';
import type Character from "../characters/character";
import { FEILD, screenWidth, screenHeight, Scale } from '../global';

function screenFocus(character: Character | {x: number, y: number, width?: number, height?: number}) { // 캐릭터에 초점을 맞춰 이동(맵 끝으로 가면 고정)
	if (!character.width) character.width = 0;
	if (!character.height) character.height = 0;
	const scale = Scale.get();
	let focusX = screenWidth / 2 - character.x * scale - (character.width / 2);
	let focusY = screenHeight / 2 - character.y * scale - (character.height / 2);
	focusX = focusX >= 0 ? 0 : focusX <= screenWidth - MAP_WIDTH * scale ? FEILD.offsetLeft : focusX;
	focusY = focusY >= 0 ? 0 : focusY <= screenHeight - MAP_HEIGHT * scale ? FEILD.offsetTop : focusY;
	FEILD.style.left = focusX  + "px";
	FEILD.style.top = focusY + "px";
}

export default screenFocus;
