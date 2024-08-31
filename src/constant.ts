// 상수 정의

const MAP_WIDTH = 6000; // 맵 전체 너비
const MAP_HEIGHT = 5000; // 맵 전체 높이
const MAP_PADDING = 50; // 맵 가장자리 여백
const CAGE_PADDING = 50; // 울타리 너비
const CHAR_SPEED = 9; // max(9) (CHAR_SPEED * CHAR_MOVE_SPEED px/s)
const GOOSE_MOVE_PX = 10.5;
const ANI_MOVE_PX = 5;

const STANDARD_FPS = 60; // 기준 FPS
const AUTOMOVE_OPTIONS = {
	DEG_LATENCY: 200, // 각도 변경 주기
	DEG_PROBABILITY: 0.1, // 각도 변경 확률
	MOVE_LATENCY: 400, // 움직임 변경 주기
	MOVE_PROBABILITY: 0.02, // 움직임 변경 확률
	STOP_LATENCY: 200, // 정지 변경 주기
	STOP_PROBABILITY: 0.01, // 정지 변경 확률
};

export {
	MAP_WIDTH,
	MAP_HEIGHT,
	MAP_PADDING,
	CAGE_PADDING,
	CHAR_SPEED,
	GOOSE_MOVE_PX,
	ANI_MOVE_PX,
	STANDARD_FPS,
	AUTOMOVE_OPTIONS,
}
