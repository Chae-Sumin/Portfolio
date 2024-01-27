// 메인 함수

import init from './lib/init';
import getMove from './lib/getMove';
import Player from './characters/player';
import Goose from './characters/goose';
import { FEILD, characters, checkKey, fieldEggs } from './global';
import screenFocus from './lib/screenFocus';
import Scenario from './lib/scenario';

// 메인 캐릭터 생성
const goose = new Goose({x: 2000, y: 400}, true);
const player = new Player({x: 600, y: 700});

// 시나리오 생성
const scenario = new Scenario(player, goose);

const main = () => {
	let time = 0;
	const loop = () => {
		time++;
		// 플레이어 움직임 설정
		const {isMove, deg} = getMove();
		player.isMove = isMove;
		isMove && (player.deg = deg);

		// 시나리오 체크
		scenario.checkStep();

		// 액티브 버튼 체크
		if (checkKey(' ', 'F', 'f', 'ㄹ')) {
			fieldEggs.forEach(egg => {
				// 필드 달걀 클릭
				const dist = player.getDistance(egg);
				if (dist < 100) egg.ele.click();
			});

			// 메인 거위 클릭
			const dist = player.getDistance(goose);
			if (dist < 100) goose.ele.click();
		}

		// 캐릭터 업데이트
		characters.forEach(character => character.update());

		// 화면 포커스 설정
		screenFocus(player);

		// 루프 재귀
		requestAnimationFrame(loop);
	}

	requestAnimationFrame(loop);
}

// 메인 배경(대용량 이미지) 로딩
const mapImg = document.createElement("img");
mapImg.setAttribute("src", "./assets/map.png");
mapImg.setAttribute("alt", "배경 이미지");
mapImg.setAttribute("id", "mapImg");

// 최초 설정 함수
init();
FEILD?.appendChild(mapImg);
// 메인 배경 로딩 완료 후 메인 함수 실행
mapImg.onload = main;
