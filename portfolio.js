window.onload = function(){

    // --------------------돔 구조--------------------
    const MAP = document.getElementById("field"); //전체 맵
    const CHAR = document.getElementById("char"); //캐릭터
    const TREE = document.querySelector("#object>.trees");
    const controllBtns = document.querySelectorAll("#controller button"); 
    const controllDiv = document.querySelector("#controller>div");
    // -------------------- 상수 --------------------
    const CHAR_WIDTH = 150; // 캐릭터 너비
    const CHAR_HEIGHT = 200; // 캐릭터 높이
    const MAP_WIDTH = 6000; // 맵 전체 너비
    const MAP_HEIGHT = 5000; // 맵 전체 높이
    const CHAR_MOVE_SPEED = 200; //max(300) 
    const CHAR_MOVE_PX = 3; //(CHAR_MOVE_PX * CHAR_MOVE_SPEED px/s)
    const CHAR_CROSS_PX = CHAR_MOVE_PX / Math.sqrt(2); //대각선 이동 속도
    const key = keyfuncs();
    const move = movefuncs();
    // -------------------- 변수 --------------------
    let isMobile = false //모바일 확인
    let screenWidth = window.innerWidth; // 스크린 너비
    let screenHeight = window.innerHeight; // 스크린 높이
    let focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2); // 초점 X값(음수)
    let focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2); //초점 Y값(음수)
    
    // --------------------제한구역 이미지 설정--------------------
    let limitImg = document.getElementById('limit_img');
    let limitCanvas = document.createElement("canvas");
    limitCanvas.width = limitImg.width;
    limitCanvas.height = limitImg.height;
    limitCanvas.getContext('2d').drawImage(limitImg,0,0,limitImg.width,limitImg.height);

    // --------------------로딩중...--------------------
    function loading(){
        let ratioW = (screenWidth - focusX) / MAP_WIDTH
        for(let i = 0; i < 43; i++){ // 나무 생성
            let tree = document.createElement("span");
            tree.setAttribute("class","tree");
            TREE.appendChild(tree);
        }
        const mapImg = document.createElement("img"); // 메인 배경
        mapImg.setAttribute("src", "./img/map2.png");
        mapImg.setAttribute("alt", "배경 이미지");
        mapImg.setAttribute("id", "mapImg");
        MAP.appendChild(mapImg);
        MAP.style.transformOrigin = -focusX + "px " + -focusY + "px";
        mapImg.onload = function(){
            screenFocus();
            MAP.style.animation = "load"+parseInt((ratioW) * 100)+"Ani 5s ease";
            document.getElementById("beforeLoad").classList.add("load");
            let loadTime = setTimeout(function(){
                afterLoad(); //로딩이 끝난 뒤 호출
                clearTimeout(loadTime);
            },5000);
        }
    }
    loading();
    function afterLoad(){
        document.addEventListener("keydown",function(e){ // 키가 눌려있는 중에는 setTimeOut 호출 X
            key.presskey(e.key);
            (key.flag()) ? false : key.setKeyTimer(keyDown,0);
        });
        document.addEventListener("keyup",function(e){ // 키가 떨어지면 루프 종료
            key.removeKey(e.key);
            if(!key.keyCode()) {
                CHAR.setAttribute("class","_"+CHAR.getAttribute("class"));
                key.clearKeyTimer();
                key.flagFalse();
                let btnOns = document.getElementsByClassName("btnOn");
                while(btnOns.length){ btnOns[0].classList.remove("btnOn"); }
            }
        });
        window.addEventListener("resize", function(){ // 창 크기 변경시 
            screenWidth = window.innerWidth;
            screenHeight = window.innerHeight;
            screenFocus();
        });
    }


    // -------------------- 각종 함수 --------------------
    let mobileDivice = [ // 모바일 기기 종류
        'iphone', 'ipod',
        'window ce', 'android',
        'blackberry', 'nokia',
        'webos', 'opera mini',
        'sonyerricsson', 'opera mobi',
        'iemobile'
    ];
    for (let i in mobileDivice) { // 모바일 기기 확인
        if (navigator.userAgent.toLowerCase().match(new RegExp(mobileDivice[i]))) {
            isMobile = true;
            document.querySelector("body").classList.add("mob");
        }
    }

    function isEntryPossible(x,y){ // 이동 가능구역인지 확인
        if(x > CHAR_WIDTH / 2 && x < MAP_WIDTH - CHAR_WIDTH / 2 && y > CHAR_HEIGHT && y < MAP_HEIGHT){

            return !(limitCanvas.getContext('2d').getImageData(x,y,1,1).data[3])
        }else return false
    }
    
    function keyfuncs(){ // 키보드 관련 클로져
        let moveX = 0;
        let moveY = 0;
        let active = false;
        let keyFlag = false;
        let keyTimer = null;
        return {
            presskey : function(key){
                switch (key) {
                    case " ":
                        active = true
                        break;
                    case "ArrowUp":
                        moveY = -1;
                        break;
                    case "ArrowLeft":
                        moveX = -1;
                        break;
                    case "ArrowDown":
                        moveY = 1;
                        break;
                    case "ArrowRight":
                        moveX = 1;
                        break;
                    default:
                        return false;
                }
            },
            removeKey : function(key){
                switch (key) {
                    case " ":
                        active = false
                        break;
                    case "ArrowUp":
                        moveY = moveY == -1 ? 0 : 1;
                        break;
                    case "ArrowLeft":
                        moveX = moveX == -1 ? 0 : 1;
                        break;
                    case "ArrowDown":
                        moveY = moveY == 1 ? 0 : -1;
                        break;
                    case "ArrowRight":
                        moveX = moveX == 1 ? 0 : -1;
                        break;
                    default:
                        return false;
                }
            },
            keyCode : function(){
                    if(moveX === 0){ // down : up : 0
                        return moveY > 0 ? 3 : moveY < 0 ? 1 : 0;
                    } else if(moveX < 0){ //left
                        return moveY > 0 ? 7 : moveY < 0 ? 5 : 2;
                    } else{ //right
                        return moveY > 0 ? 8 : moveY < 0 ? 6 : 4;
                    }
                /*  up => 1             down => 3
                    left => 2           right => 4
                    left up => 5        right up => 6
                    left down => 7      right down => 8    */
            },
            length : function(){return moveKeyCodes.length},
            active : function(){return active},
            flag : function(){return keyFlag},
            flagFalse : function(){keyFlag = false; 
                return keyFlag},
            flagTrue : function(){keyFlag = true; 
                return keyFlag},
            setKeyTimer: function(func,time){
                keyTimer = setTimeout(func,time);
            },
            clearKeyTimer: function(){
                clearTimeout(keyTimer);
            }
        }
    }
    function movefuncs(){ // 움직임 관련 클로져
        let moveX = CHAR.offsetLeft;
        let moveY = CHAR.offsetTop;
        return{
            moveTo : function(_x,_y){
                let x = _x;
                let y = _y;
                let isBlock = true;
                let count = 0;
                if(x&&isEntryPossible(moveX + CHAR_WIDTH / 2 + x,moveY +  CHAR_HEIGHT)){
                    moveX += x;
                    CHAR.style.left = moveX + "px";
                    isBlock = false;
                }
                if(y&&isEntryPossible(moveX + CHAR_WIDTH / 2,moveY +  CHAR_HEIGHT + y)){
                    moveY += y;
                    CHAR.style.top = moveY + "px";
                    CHAR.style.zIndex = parseInt(moveY + CHAR_HEIGHT / 3);
                    isBlock = false;
                }
                while (isBlock && count < 5) {
                    count += 2;
                    isBlock = this.moveSmooth(_x,_y,count);
                } 
                screenFocus();
            },
            moveSmooth : function(x,y,count){
                let dir = [];
                if(x === 0){
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 - CHAR_CROSS_PX * count,moveY +  CHAR_HEIGHT + y));
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + CHAR_CROSS_PX * count,moveY +  CHAR_HEIGHT + y));
                    if(dir[0]^dir[1]){
                        x = dir[0] ? -CHAR_CROSS_PX : CHAR_CROSS_PX;
                        y = y > 0 ? CHAR_CROSS_PX : -CHAR_CROSS_PX;
                        this.moveTo(x,y);
                        return false;
                    }
                } else if(y === 0){
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + x, moveY +  CHAR_HEIGHT - CHAR_CROSS_PX * count));
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + x, moveY +  CHAR_HEIGHT + CHAR_CROSS_PX * count));
                    if(dir[0]^dir[1]){
                        y = dir[0] ? -CHAR_CROSS_PX : CHAR_CROSS_PX;
                        x = x > 0 ? CHAR_CROSS_PX : -CHAR_CROSS_PX;
                        this.moveTo(x,y)
                        return false;
                    }
                } else{
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 - x * count, moveY + CHAR_HEIGHT + y * count));
                    dir.push(isEntryPossible(moveX + CHAR_WIDTH / 2 + x * count, moveY + CHAR_HEIGHT - y * count));
                    if(dir[0]^dir[1]){
                        if(dir[0]){
                            this.moveTo(-x,y);
                            return false;
                        } else{
                            this.moveTo(x,-y);
                            return false;
                        }
                    }
                } return true;
            }
        }
    }
    function keyDown(){ // 키가 눌리면 setTimeOut 루프 시작
        key.flagTrue();
        let btnOns = document.getElementsByClassName("btnOn");
        while(btnOns.length){ btnOns[0].classList.remove("btnOn"); }
        switch (key.keyCode()) {
            case 1: //up
                move.moveTo(0,-CHAR_MOVE_PX);
                controllBtns[0].classList.add("btnOn");
                break;
            case 2: //left
                move.moveTo(-CHAR_MOVE_PX,0);
                controllBtns[1].classList.add("btnOn");
                break;
            case 3: //down
                move.moveTo(0,CHAR_MOVE_PX);
                controllBtns[2].classList.add("btnOn");
                break;
            case 4: //right
                move.moveTo(CHAR_MOVE_PX,0);
                controllBtns[3].classList.add("btnOn");
                break;
            case 5: //left up
                move.moveTo(-CHAR_CROSS_PX,-CHAR_CROSS_PX);
                controllBtns[0].classList.add("btnOn");
                controllBtns[1].classList.add("btnOn");
                break;
            case 6: //right up
                move.moveTo(CHAR_CROSS_PX,-CHAR_CROSS_PX);
                controllBtns[0].classList.add("btnOn");
                controllBtns[3].classList.add("btnOn");
                break;
            case 7: //left down
                move.moveTo(-CHAR_CROSS_PX,CHAR_CROSS_PX);
                controllBtns[1].classList.add("btnOn");
                controllBtns[2].classList.add("btnOn");
                break;
            case 8: //right down
                move.moveTo(CHAR_CROSS_PX,CHAR_CROSS_PX);
                controllBtns[2].classList.add("btnOn");
                controllBtns[3].classList.add("btnOn");
                break;
            case 0:
                return false;
        }
        function setDir(key){
            CHAR.setAttribute("class","");
            CHAR.classList.add("_"+key);
        }
        setDir(key.keyCode());
        key.setKeyTimer(keyDown,1000/CHAR_MOVE_SPEED);
    }
    
    function screenFocus(){ // 캐릭터에 초점을 맞춰 이동(맵 끝으로 가면 고정)
        focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2);
        focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2);
        focusX = focusX >= 0 ? 0 : focusX <= screenWidth - MAP_WIDTH ? MAP.offsetLeft : focusX;
        focusY = focusY >= 0 ? 0 : focusY <= screenHeight - MAP_HEIGHT ? MAP.offsetTop : focusY;
        MAP.style.left = focusX + "px";
        MAP.style.top = focusY + "px";
    }
}