import { INTRO, screenWidth, screenHeight, Scale } from '../global';
import { MAP_WIDTH, MAP_HEIGHT } from '../constant';
import cloudRaw from '../../assets/intro/cloud.svg?raw';
import loading from '../../assets/intro/loading.svg?raw';
import init from './init';
import main from './main';

const cloudSvg = new DOMParser().parseFromString(cloudRaw, 'image/svg+xml').querySelector('svg');
const loadingSvg = new DOMParser().parseFromString(loading, 'image/svg+xml').querySelector('svg');
if (cloudSvg) {
	for (let i = 0; i < 5; i++) {
		const cloud = cloudSvg.cloneNode(true) as SVGElement;
		cloud.classList.add('cloud');
		INTRO.appendChild(cloud);
	}
}
const loadingWrap = document.createElement('div');
if (loadingSvg) {
	const loading = loadingSvg.cloneNode(true) as SVGElement;
	const loadingText = document.createElement('span');
	loadingText.innerText = 'Loading ...';
	loadingWrap.classList.add('loadingWrap');
	loadingWrap.appendChild(loading);
	loadingWrap.appendChild(loadingText);
	INTRO.appendChild(loadingWrap);
}

const startButton = document.createElement('button');
startButton.innerText = 'Start';
startButton.classList.add('start');
startButton.onclick = () => {
	intro('play');
};

type commend = 'init' | 'load' | 'cheat' | 'play';
const intro = (cmd: commend) => {
	switch (cmd) {
		case 'init':
			init();
			break;
		case 'load':
			loadingWrap.remove();
			INTRO.appendChild(startButton);
			break;
		default:
			INTRO.classList.add('open');
			Scale.set(Math.min(screenWidth / MAP_WIDTH, screenHeight / MAP_HEIGHT) * 8);
			main(cmd);
			setTimeout(() => {
				INTRO.style.zIndex = '-999';
			}, 1000);
			break;
	}
};
export default intro;
