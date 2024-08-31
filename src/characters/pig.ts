// 돼지 클래스

import Character, {type CharacterProps} from "./character";
import pigImg from '../../assets/characters/pig.png';

class Pig extends Character {
	constructor(props: CharacterProps = {}) {
		let [w, h] = [240, 200];
		if (props.baby) {
			[w, h] = [150, 125];
		}
		super(pigImg, w, h, {speed: 4, isAutoMove: true, ...props});
	}
}

export default Pig;
