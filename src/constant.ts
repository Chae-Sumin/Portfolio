// 상수 정의

const MAP_WIDTH = 6000; // 맵 전체 너비
const MAP_HEIGHT = 5000; // 맵 전체 높이
const CHAR_SPEED = 9; // max(9) (CHAR_SPEED * CHAR_MOVE_SPEED px/s)
const GOOSE_MOVE_PX = 10.5;
const ANI_MOVE_PX = 5;
const MAP_RATIO = 0.7; // 맵 비율

const STANDARD_FPS = 60; // 기준 FPS
const AUTOMOVE_OPTIONS = {
	DEG_LATENCY: 200, // 각도 변경 주기
	DEG_PROBABILITY: 0.1, // 각도 변경 확률
	IS_MOVE_LATENCY: 200, // 움직임 여부 변경 주기
	IS_MOVE_PROBABILITY: 0.05, // 움직임 여부 변경 시도 확률
};

export {
	MAP_WIDTH,
	MAP_HEIGHT,
	CHAR_SPEED,
	GOOSE_MOVE_PX,
	ANI_MOVE_PX,
	MAP_RATIO,
	STANDARD_FPS,
	AUTOMOVE_OPTIONS,
}
