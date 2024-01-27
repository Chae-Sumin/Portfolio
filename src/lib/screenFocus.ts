import { MAP_WIDTH, MAP_HEIGHT, CHAR_SPEED, GOOSE_MOVE_PX, ANI_MOVE_PX, MAP_RATIO } from '../constant';
import type Character from "../characters/character";
import { FEILD } from '../global';


let screenWidth = window.innerWidth; // 스크린 너비
let screenHeight = window.innerHeight; // 스크린 높이

function screenFocus(character: Character) { // 캐릭터에 초점을 맞춰 이동(맵 끝으로 가면 고정)
	if (!FEILD) return;
	let focusX = screenWidth / 2 - character.x * MAP_RATIO - (character.width / 2);
	let focusY = screenHeight / 2 - character.y * MAP_RATIO - (character.height / 2);
	focusX = focusX >= 0 ? 0 : focusX <= screenWidth - MAP_WIDTH * MAP_RATIO ? FEILD.offsetLeft : focusX;
	focusY = focusY >= 0 ? 0 : focusY <= screenHeight - MAP_HEIGHT * MAP_RATIO ? FEILD.offsetTop : focusY;
	FEILD.style.left = focusX  + "px";
	FEILD.style.top = focusY + "px";
}

export default screenFocus;
