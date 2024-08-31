// 메인 함수

import getMove from './getMove';
import Player from '../characters/player';
import Goose from '../characters/goose';
import { CONTROLLER, options, characters, Fps, checkKey, fieldEggs } from '../global';
import screenFocus from './screenFocus';
import Scenario from './scenario';

const main = (() => {
	let executed = false;
	return (type: 'play' | 'cheat') => {
		if (executed) return;
		executed = true;
		let time = performance.now();

		// 메인 캐릭터 생성
		const goose = new Goose({x: 2000, y: 400}, true);
		const player = new Player({x: 600, y: 700});

		// 시나리오 생성
		const scenario = new Scenario(player, goose);

		// 테스트용 인디케이터
		const indicator = document.createElement("pre");
		indicator.id = "indicator";
		indicator.classList.add("hide");
		CONTROLLER.appendChild(indicator);

		const loop = (ts: number) => {
			// 시간 간격 계산
			Fps.set(1000 / (ts - time));
			time = ts;

			// 테스트용 인디케이터
			if (options.indicator) {
				indicator.classList.remove("hide");
				indicator.textContent = `FPS: ${Fps.get().toFixed(4)}\nplayer: ${player.x}, ${player.y}\nGoose: ${goose.x}, ${goose.y}`;
			} else {
				indicator.classList.add("hide");
			}

			// 플레이어 움직임 설정
			const {isMove, deg} = getMove();
			player.isMove = isMove;
			isMove && (player.deg = deg);

			// 시나리오 체크
			scenario.checkStep();

			// 액티브 버튼 체크
			if (checkKey(' ', 'F', 'f', 'ㄹ')) {
				fieldEggs.forEach(egg => {
					// 필드 계란 클릭
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
			if (checkKey('g', 'G', 'ㅎ')) {
				screenFocus(goose);
			} else {
				screenFocus(player);
			}

			// 루프 재귀
			requestAnimationFrame(loop);
		}

		requestAnimationFrame(loop);
	};
})();

export default main;
