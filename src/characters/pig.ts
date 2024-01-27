// 돼지 클래스

import Character, {type CharacterProps} from "./character";

class Pig extends Character {
	constructor(props: CharacterProps = {}) {
		let [w, h] = [240, 200];
		if (props.baby) {
			[w, h] = [150, 125];
		}
		super('./assets/characters/pig.png', w, h, {speed: 4, isAutoMove: true, ...props});
	}
}

export default Pig;
