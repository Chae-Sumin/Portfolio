// 양 클래스

import Character, {type CharacterProps} from "./character";
class Sheep extends Character {
	constructor(props: CharacterProps = {}) {
		let [w, h] = [209, 198];
		if (props.baby) {
			[w, h] = [152, 144];
		}

		super('./assets/characters/sheep.png', w, h, {speed: 4, isAutoMove: true, ...props});
	}
}

export default Sheep;
