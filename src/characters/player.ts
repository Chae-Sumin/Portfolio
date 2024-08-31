// 플레이어 클래스

import Character, {type CharacterProps} from "./character";
import playerImg from '../../assets/characters/player.png';

class Player extends Character {
	constructor(props: CharacterProps = {}) {
		super(playerImg, 140, 200, {id: 'player', isMoveSmooth: true, ...props});
	}
}

export default Player;
