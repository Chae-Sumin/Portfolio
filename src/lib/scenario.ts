import Character from "../characters/character";
import Egg from "../stuff/egg";

interface ScenarioStep {
	origin?: Character | [number, number];
	distance?: number;
	action: () => void;
}

class Scenario {
	private player: Character;
	private goose: Character;
	private scenario: ScenarioStep[];
	step = 0;
	constructor(player: Character, goose: Character) {
		this.player = player;
		this.goose = goose;
		this.scenario = [
			{
				// 시작
				origin: this.goose,
				distance: 2000,
				action: () => {
					this.player.deg = 0;
					this.goose.moveTo(900, 750);
				},
			},
			{
				// 다리 앞으로 이동
				action: () => {
					new Egg(950, 800);
					this.goose.moveTo(1250, 1300);
				},
			},
			{
				// 다리 건너기
				action: () => {
					this.goose.moveTo(1250, 2000);
				},
			},
			{
				// 당근 밭
				action: () => {
					this.goose.moveTo(500, 2500);
				},
			},
			{
				// 토마토 밭
				action: () => {
					new Egg(550, 2550);
					this.goose.moveTo(500, 3500);
				},
			},
			{
				// 호수 다리 앞
				action: () => {
					this.goose.moveTo(1100, 4500);
				},
			},
			{
				// 호수 다리
				action: () => {
					this.goose.moveTo(1100, 4500);
				},
			},
			{
				// 호수 다리 건너기
				action: () => {
					new Egg(1150, 4550);
					this.goose.moveTo(4500, 4600);
				},
			},
			{
				// 강 다리 앞
				action: () => {
					this.goose.moveTo(5000, 4000);
				},
			},
			{
				// 강 다리 건너기
				action: () => {
					this.goose.moveTo(5000, 3000);
				},
			},
			{
				// 돼지우리
				action: () => {
					this.goose.moveTo(5700, 2600);
				},
			},
			{
				// 외양간
				action: () => {
					this.goose.moveTo(5300, 1900);
				},
			},
			{
				// 숲 속
				action: () => {
					new Egg(5350, 1950);
					this.goose.moveTo(4500, 1500);
				},
			},
			{
				// 깊은 숲
				action: () => {
					this.goose.moveTo(3800, 1200);
				},
			},
			{
				// 언덕 위
				action: () => {
					this.goose.moveTo(5000, 500);
					this.goose.ele.onclick = () => {
						alert('축하합니다! 게임을 클리어 하셨습니다!');
					};
				},
			},
		];
	}
	checkStep() {
		const step = this.scenario[this.step];
		if (!step) return false;
		const {origin = this.goose, distance = 200, action} = step;
		if (Array.isArray(origin)) {
			const dist = this.player.getDistance({x: origin[0], y: origin[1]});
			if (dist < distance) {
				action();
				this.step++;
				return true;
			}
		} else {
			if (origin.isMove) return false;
			const dist = this.player.getDistance(origin);
			if (dist < distance) {
				action();
				this.step++;
				return true;
			}
		}
		return false;
	}
}

export default Scenario;
