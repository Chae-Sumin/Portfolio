// 소 클래스

import Character, {type CharacterProps} from "./character";

class Cow extends Character {
	constructor(props: CharacterProps = {}) {
		let [w, h] = [260, 260];
		if (props.baby) {
			[w, h] = [180, 180];
		}
		super('./assets/characters/cow.png', w, h, {speed: 4, isAutoMove: true, ...props});
	}
}

export default Cow;
