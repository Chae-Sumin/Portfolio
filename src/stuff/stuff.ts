// 캐릭터가 아닌 물건들을 정의하는 클래스

import { FEILD, characters } from '../global';

interface StuffProps {
	parent?: Stuff,
	random?: number,
	noImage?: boolean,
	noZIndex?: boolean,
	addZIndex?: number,
	tag?: string,
};

class Stuff {
	id: symbol;
	ele: HTMLElement;
	noImage: boolean;
	noZIndex: boolean;
	parent?: Stuff;
	private _width = 140;
	private _height = 200;
	private _x = 0;
	private _y = 0;
	private _zIndex = 0;

	constructor(name: string, witdh: number, height: number, x: number, y: number, props: StuffProps = {}) {
		this.id = Symbol();
		this.ele = document.createElement(props.tag || 'div');
		if (!props.tag) this.ele.style.pointerEvents = 'none';
		this.ele.classList.add('stuff', name);
		this.noImage = props.noImage || false;
		this.noZIndex = props.noZIndex || false;
		if (!this.noImage) {
			this.ele.style.backgroundImage = `url(./assets/stuffs/${name}.png)`;
		}
		if (props.parent) {
			this.parent = props.parent;
		}
		if (props.addZIndex) {
			this._zIndex = props.addZIndex;
		}

		this.width = witdh;
		this.height = height;
		this.x = x + (props.random ? Math.floor(Math.random() * props.random) : 0);
		this.y = y + (props.random ? Math.floor(Math.random() * props.random) : 0);


		if (this.parent) this.parent.ele.appendChild(this.ele);
		else FEILD.appendChild(this.ele);
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
		if (!this.noZIndex) {
			let zIndex = y + this.height;
			if (this.parent) {
				zIndex += this.parent.y;
			}
			zIndex += this._zIndex;
			if (zIndex < 2) zIndex = 2;
			this.ele.style.zIndex = `${zIndex}`;
		}
	}
	get y() {
		return this._y;
	}

	remove() {
		this.ele.remove();
		characters.delete(this.id);
	}
}

export default Stuff;
