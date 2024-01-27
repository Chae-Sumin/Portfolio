// 캐릭터 기본 클래스

import { FEILD, characters } from '../global';
import checkPos from '../lib/checkPos';
import Stuff from '../stuff/stuff';

interface CharacterProps {
	id?: string,
	x?: number,
	y?: number,
	deg?: number,
	speed?: number,
	isAutoMove?: boolean,
	isMoveSmooth?: boolean,
	baby?: boolean,
	canFly?: boolean,
	cage?: Stuff,
	tag?: string,
};

class Character {
	id: symbol;
	ele: HTMLElement;
	speed: number;
	cage: Stuff | null = null;
	private _width = 140;
	private _height = 200;
	private _x = 0;
	private _y = 0;
	private _deg = 0;
	private _isMove = false;
	private _isAutoMove = false;
	private _autoOptions: {
		degLatency: number, // frame
		degStack: number, // frame
		degProbability: number, // 0 ~ 1
		isMoveLatency: number, // frame
		isMoveStack: number, // frame
		isMoveProbability: number, // 0 ~ 1
	} = {
		degLatency: 200,
		degStack: 0,
		degProbability: 0.5,
		isMoveLatency: 200,
		isMoveStack: 0,
		isMoveProbability: 0.5,
	}
	private _canFly = false;
	private _fly = false;
	private _isMoveSmooth = false;
	private _moveTo: {
		x: number | null,
		y: number | null,
	}

	constructor(img: string, witdh: number, height: number, props: CharacterProps = {}) {
		this.id = Symbol();
		this.ele = document.createElement(props.tag || 'div');
		if (!props.tag) this.ele.style.pointerEvents = 'none';
		this.ele.classList.add('character');
		this.ele.style.backgroundImage = `url(${img})`;
		this.width = witdh;
		this.height = height;
		this.speed = props.speed || 9;
		this._moveTo = {x: null, y: null};
		if (props.id) this.ele.id = props.id;
		if (props.cage) {
			this.cage = props.cage;
			if (!props.x) props.x = this.cage.width / 2;
			if (!props.y) props.y = this.cage.height / 2;
		}
		if (props.x) this.x = props.x;
		if (props.y) this.y = props.y;
		if (props.deg) this.deg = props.deg;


		if (props.isAutoMove) {
			this._isAutoMove = Boolean(props.isAutoMove);
			this.changeDeg();
			this.changeIsMove();
		}
		if (props.canFly) {
			this._canFly = true;
		}
		if (props.isMoveSmooth) {
			if (this._isAutoMove) throw new Error('autoMove와 moveSmooth는 동시에 사용할 수 없습니다.');
			if (this._canFly) throw new Error('canFly와 moveSmooth는 동시에 사용할 수 없습니다.');

			this._isMoveSmooth = true;
		}
		if (this.cage) this.cage.ele.appendChild(this.ele);
		else FEILD?.appendChild(this.ele);
		characters.set(this.id, this);
	}

	set width(width: number) {
		this._width = width;
		this.ele.style.width = `${width}px`;
	}
	get width() {
		return this._width;
	}
	set height(height: number) {
		this._height = height;
		this.ele.style.height = `${height}px`;
	}
	get height() {
		return this._height;
	}
	set x(x: number) {
		this._x = x;
		this.ele.style.left = `${x}px`;
	}
	get x() {
		return this._x;
	}
	set y(y: number) {
		this._y = y;
		this.ele.style.top = `${y}px`;
		let zIndex = y + this.height + 30;
		if (this.cage) zIndex += this.cage.y;
		this.ele.style.zIndex = `${zIndex}`;
	}
	get y() {
		return this._y;
	}
	set deg(deg: number) {
		while (deg <= -180) deg += 360;
		while (deg > 180) deg -= 360;
		this._deg = deg;

		let classname = 'left';
		if (this.fly) {
			if (deg > 45 && deg < 135) classname = 'front';
			else if (deg > -135 && deg < -45) classname = 'back';
			else if (deg >= -45 && deg <= 45) classname = 'right';
		} else {
			if (deg > 45 && deg < 135) classname = 'front';
			else if (deg > -135 && deg < -45) classname = 'back';
			else if (deg >= -45 && deg <= 45) classname = 'right';
		}

		this.ele.classList.remove('back', 'right', 'front', 'left');
		this.ele.classList.add(classname);
	}
	get deg() {
		return this._deg;
	}
	set isMove(isMove: boolean) {
		this._isMove = isMove;
		this.ele.classList.toggle('move', isMove);
	}
	get isMove() {
		return this._isMove;
	}
	set fly(fly: boolean) {
		this.ele.classList.toggle('fly', fly);
		this._fly = fly;
	}
	get fly() {
		return this._fly;
	}

	// 움직임 업데이트
	update() {
		if (this._isAutoMove) this.autoMove();
		if (this._moveTo.x !== null && this._moveTo.y !== null) this.moveTo(this._moveTo.x, this._moveTo.y);
		if (!this.isMove) return;
		const [dx, dy] = this.movement();

		if (!dx && !dy) return;

		const res = this.move(this.x + dx, this.y + dy);
		if (!res && this._isMoveSmooth) {
			this.moveSmooth(this.x + dx, this.y + dy);
		}
	}
	// 캐릭터 삭제
	remove() {
		this.ele.remove();
		characters.delete(this.id);
	}
	// 캐릭터 이동
	moveTo(x: number, y: number) {
		if (this._isAutoMove) return this._moveTo = {x: null, y: null};
		const dx = Math.floor(Math.abs(x - this.x));
		const dy = Math.floor(Math.abs(y - this.y));

		if (dx < this.speed && dy < this.speed) {
			this._moveTo = {x: null, y: null};
			this.isMove = false;
			return;
		}
		this._moveTo = {x, y};
		this.isMove = true;
		this.deg = Math.atan2(y - this.y, x - this.x) * 180 / Math.PI;
	}
	// base와의 거리 반환
	getDistance(base: Character | Stuff | {x: number, y: number}) {
		const thisX = this.x + this.width / 2;
		const thisY = this.y + this.height / 2;
		const baseX = base instanceof Character || base instanceof Stuff
			? base.x + base.width / 2 : base.x;
		const baseY = base instanceof Character || base instanceof Stuff
			? base.y + base.height / 2 : base.y;
		const dx = baseX - thisX;
		const dy = baseY - thisY;
		return Math.sqrt(dx * dx + dy * dy);
	}
	private movement(deg = this.deg) {
		const rad = deg * Math.PI / 180;
		return [Math.floor(Math.cos(rad) * this.speed), Math.floor(Math.sin(rad) * this.speed)];
	}
	private move(x: number, y: number) {
		if (!checkPos(x, y, this)) {
			if (!this._canFly) return false;
			this.fly = true;
		} else if (this._canFly) this.fly = false;
		this.x = x;
		this.y = y;
		return true;
	}
	private moveSmooth(x: number, y: number, maxCount = 30, dDeg = 5) {
		let count = 0;
		while (!checkPos(x, y, this) && count < maxCount) {
			count++;
			const n = Math.floor(count / 2) * (count % 2 ? 1 : -1);
			const [dx, dy] = this.movement(this.deg + dDeg * n);
			x = this.x + dx;
			y = this.y + dy;
		}
		if (count >= maxCount) return;
		this.move(x, y);
	}
	private autoMove() {
		const {degLatency: dl, degStack: ds, degProbability: dp, isMoveLatency: ml, isMoveStack: ms, isMoveProbability: mp} = this._autoOptions;
		const R = Math.random();
		if (dl > ds) this._autoOptions.degStack++;
		else if (R < dp) {
			this.changeDeg();
			this._autoOptions.degStack = 0;
		}
		if (ml > ms) this._autoOptions.isMoveStack++;
		else if (R < mp) {
			this.changeIsMove();
			this._autoOptions.isMoveStack = 0;
		}
	}
	private changeDeg() {
		this.deg = Math.floor(Math.random() * 360);
	}
	private changeIsMove() {
		this.isMove = !this.isMove;
	}
}

export default Character;
export type { CharacterProps };
