// 제한 영역 설정

import { MAP_WIDTH, MAP_HEIGHT } from '../constant';
import type Character from '../characters/character';

const limitPos = new Set();
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});
const img = new Image();
img.src = "./assets/limits.png";
img.style.display = "none";
img.onload = () => {
	canvas.width = img.width;
	canvas.height = img.height;
	ctx?.drawImage(img, 0, 0);
	document.body.removeChild(img);
}
document.body.appendChild(img);

const MAP_PADDING = 50;
function checkPos(x: number, y: number, character: Character){ // 이동 가능구역인지 확인
	const cX = x + character.width / 2;
	const cY = y + character.height;
	if (character.cage) {
		if (x < 50 || x > character.cage.width - character.width - 50 || y < 50 || y > character.cage.height - character.height - 50) return false;
		return true;
	}
	if (x > MAP_PADDING && x + character.width < MAP_WIDTH - MAP_PADDING && y > MAP_PADDING && y + character.height < MAP_HEIGHT - MAP_PADDING) {
		if (limitPos.has(`${cX},${cY}`)) return false;
		if (ctx?.getImageData(cX, cY, 1, 1).data[3]) {
			limitPos.add(`${cX},${cY}`);
			return false;
		}
		return true;
	} else return false
}

export default checkPos;
