import Stuff from "../stuff/stuff";
import Tree from "../stuff/tree";
import type { fruits } from "../stuff/tree";
import Cage from "../stuff/cage";
import Goose from '../characters/goose';
import Cow from '../characters/cow';
import Sheep from '../characters/sheep';
import Pig from '../characters/pig';


const arrayTreePos = [[-15, 210], [190, 828], [1690, 843], [2015, 623], [274, 4341], [1570, 2364], [1865, 2794], [1570, 3660], [2525, 3500], [3529, 3757], [4242, 3931], [3567, -15], [3221, 143], [3571, 383], [3282, 536], [3549, 835], [3167, 946], [4273, 988], [3904, 1043], [2060, 1576], [2365, 1840], [2615, 1576], [2727, 1976], [2969, 1556], [3464, 1216], [4579, 1220], [3255, 1496], [3082, 2006], [3392, 1910], [3797, 1336], [4188, 1496], [4458, 1620], [3617, 1686], [3935, 1750], [4279, 2000], [3879, 2116], [3639, 2260], [4543, 2166], [3969, 2457], [4327, 2481], [3729, 2740], [4144, 2860], [4494, 2844]];


function init() {
	// 나무 생성
	const fruits: fruits[] = ['apple', 'blueberry', 'peach', 'orange', 'lemon', 'none'];
	arrayTreePos.forEach(([x, y]) => {
		const fruit = fruits[Math.floor(Math.random() * fruits.length)];
		new Tree(fruit, x, y);
	});

	// 집
	const house = new Stuff('houseF', 800, 900, 250, -100);
	new Stuff('flower', 120, 137, 80, 720, {parent: house, random: 10});
	new Stuff('flower', 120, 137, 150, 720, {parent: house, random: 10});
	new Stuff('flower', 120, 137, 540, 720, {parent: house, random: 10});
	new Stuff('flower', 120, 137, 610, 720, {parent: house, random: 10});

	// 작물
	const carrot = new Stuff('carrot', 1000, 600, 0, 2080, {noImage: true, noZIndex: true});
	for (let i = 0; i < 4; i++) {
		new Stuff('crops', 1000, 150, 0, 150 * i, {parent: carrot});
	}
	const corn = new Stuff('corn', 1000, 600, 0, 2910, {noImage: true, noZIndex: true});
	for (let i = 0; i < 4; i++) {
		new Stuff('crops', 1000, 150, 0, 150 * i, {parent: corn});
	}
	const tomato = new Stuff('tomato', 1000, 600, 0, 3760, {noImage: true, noZIndex: true});
	for (let i = 0; i < 4; i++) {
		new Stuff('crops', 1000, 150, 0, 150 * i, {parent: tomato});
	}

	// 목장
	const gooseCage = new Cage(1200, 1200, 0);
	const sheepCage = new Cage(800, 5200, 1200);
	const cowCage = new Cage(800, 5200, 2000);
	const pigCage = new Cage(800, 5200, 2800);
	for (let i = 0; i < 4; i++) {
		new Goose({cage: gooseCage, canFly: false, isAutoMove: true, speed: 4});
		new Goose({cage: gooseCage, canFly: false, isAutoMove: true, speed: 4});
		new Cow({cage: cowCage, baby: !i});
		new Sheep({cage: sheepCage, baby: !i});
		new Pig({cage: pigCage, baby: !i});
	}

	// 교량
	new Stuff('bridge_r', 376, 610, 1130, 1300, {addZIndex: -440});
	new Stuff('bridge_r', 376, 610, 4870, 3450, {addZIndex: -440});
	const lake = new Stuff('lake', 1401, 844, 2260, 4150, {noImage: true, noZIndex: true});
	new Stuff('bridge_l', 1401, 844, 0, 0, {parent: lake, addZIndex: -844});
	new Stuff('bridge_railing', 1401, 844, 0, -40, {parent: lake, addZIndex: -100});
	new Stuff('bridge_railing', 1401, 844, 0, -320, {parent: lake, addZIndex: -221});
	new Stuff('bridge_railing2', 1401, 844, 0, -320, {parent: lake, addZIndex: -144});
}
export default init;
