// 플레이어 클래스

import Character, {type CharacterProps} from "./character";

class Player extends Character {
	constructor(props: CharacterProps = {}) {
		super('./assets/characters/player.png', 140, 200, {id: 'player', isMoveSmooth: true, ...props});
	}
}

export default Player;
