// index.html 에서 호출되는 메인 스크립트

import { FEILD } from './global';
import intro from './lib/intro';

// 메인 배경(대용량 이미지) 로딩
const mapImg = document.createElement("img");
mapImg.setAttribute("src", "./assets/map.png");
mapImg.setAttribute("alt", "배경 이미지");
mapImg.setAttribute("id", "mapImg");
FEILD.prepend(mapImg);
// 메인 배경 로딩 완료 후 인트로 실행
intro('init');
mapImg.onload = () => intro('load');
