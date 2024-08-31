// 거위 클래스

import Character, {type CharacterProps} from "./character";
import gooseImg from '../../assets/characters/goose.png';

class Goose extends Character {
	isMain = false;
	constructor(props: CharacterProps = {}, isMain: boolean = false) {
		if (isMain) props.tag = 'button';
		super(gooseImg, 200, 150, {speed: 11, canFly: true, ...props});
		this.ele.classList.add('goose');
		if (isMain) this.ele.onclick = () => {};
		this.isMain = isMain;
	}
}

export default Goose;
