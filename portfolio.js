window.onload = function(){
    // --------------------돔 구조--------------------
    const MAP = document.getElementById("field"); //전체 맵
    const CHAR = document.getElementById("char"); //캐릭터
    const GOOSE = document.getElementById("goose"); //메인거위
    const TREE = document.querySelector("#object>.trees"); //나무들
    const EGGS = document.querySelector("#object>.eggs"); //필드 달걀
    const eggPlate = document.querySelector("#controller>.eggPlate");
    const ctrlActive = document.getElementById("active");
    const ctrlTouch = document.querySelector("#controller>.touch");
    const loadSection = document.querySelector("#load>.before_start");
    // -------------------- 상수 --------------------
    const CHAR_WIDTH = 150; // 캐릭터 너비
    const CHAR_HEIGHT = 200; // 캐릭터 높이
    const MAP_WIDTH = 6000; // 맵 전체 너비
    const MAP_HEIGHT = 5000; // 맵 전체 높이
    const CHAR_MOVE_FPS = 60; //max(300) 초당 n회
    const CHAR_MOVE_PX = 9; // max(9) (CHAR_MOVE_PX * CHAR_MOVE_SPEED px/s)
    const CHAR_CROSS_PX = CHAR_MOVE_PX / Math.sqrt(2); //대각선 이동 속도
    const GOOSE_MOVE_FPS = 60; //max(300) 
    const GOOSE_MOVE_PX = 11;
    const MAP_RATIO = 0.8; // 맵 비율
    const key = keyFuncs();
    const move = moveFuncs();
    const goose = gooseFunc();
    const touch = touchFunc();
    const egg = eggFunc();
    // -------------------- 변수 --------------------
    let screenWidth = window.innerWidth; // 스크린 너비
    let screenHeight = window.innerHeight; // 스크린 높이
    let focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2); // 초점 X값(음수)
    let focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2); //초점 Y값(음수)
    
    // --------------------제한구역 이미지 설정--------------------
    let limitImg = document.getElementById('limit_img');
    let limitCanvas = document.createElement("canvas");
    // limitImg.crossOrigin = "anonymous";
    limitCanvas.width = limitImg.width;
    limitCanvas.height = limitImg.height;
    limitCanvas.getContext('2d').drawImage(limitImg,0,0,limitImg.width,limitImg.height);

    // --------------------로딩중...--------------------
    main();
    function main(){
        for(let i = 0; i < 43; i++){ // 나무 생성
            let tree = document.createElement("ul");
            for(let j = 0; j < 3; j++){
                let fruits = document.createElement("li");
                tree.appendChild(fruits);
            }
            tree.setAttribute("class","tree");
            switch (Math.floor(Math.random()*6)) { // 과일 랜덤 생성
                case 0:
                    tree.classList.add("apple");
                    break;
                case 1:
                    tree.classList.add("blueberry");
                    break;
                case 2:
                    tree.classList.add("lemon");
                    break;
                case 3:
                    tree.classList.add("orange");
                    break;
                case 4:
                    tree.classList.add("peach");
                    break;
                default: // 그냥 나무
                    break;
            } 
            TREE.appendChild(tree);
        }
        const mapImg = document.createElement("img"); // 메인 배경
        mapImg.setAttribute("src", "./img/map.png");
        mapImg.setAttribute("alt", "배경 이미지");
        mapImg.setAttribute("id", "mapImg");
        MAP.appendChild(mapImg);
        // MAP.style.transformOrigin = -focusX + "px " + -focusY + "px";
        mapImg.onload = function(){ // --------------------------------------------------------------로딩완료
            document.querySelector("#load>span").classList.add("on");
            loadSection.classList.add("on");
            document.querySelector("#load>section .start").addEventListener("click",load);
            document.querySelector("#load>section .cheat").addEventListener("click",cheatMod);
        }
    }
    function cheatMod(){
        loadSection.classList.remove("on");
        loadSection.classList.add("off");
        let ratioW = screenWidth / MAP_WIDTH
        MAP.style.animation = "load" + parseInt((ratioW) * 100 + 1) + "Ani 2500ms ease";
        document.getElementById("load").classList.add("load");
        let aniTime = setTimeout(function(){
            MAP.style.transition = "1s";
            screenFocus();
        },1500);
        let loadTime = setTimeout(function(){
            egg.cheatEeg();
            afterLoad(); //로딩이 끝난 뒤 호출할 함수
            MAP.style.transition = "none";
            clearTimeout(aniTime);
            clearTimeout(loadTime);
        },2500);
    }
    function load(){
        loadSection.classList.remove("on");
        loadSection.classList.add("off");
        let ratioW = screenWidth / MAP_WIDTH
        MAP.style.animation = "load" + parseInt((ratioW) * 100 + 1) + "Ani 5s ease";
        document.getElementById("load").classList.add("load");
        let aniTime = setTimeout(function(){
            MAP.style.transition = "2s";
            screenFocus();
        },3000);
        let loadTime = setTimeout(function(){
            afterLoad(); //로딩이 끝난 뒤 호출할 함수
            MAP.style.transition = "none";
            clearTimeout(aniTime);
            clearTimeout(loadTime);
        },5000);
    }
    function afterLoad(){ //-----------------------------------------------------------로딩 완료까지 호출 x
        const moveKey1 = ["arrowup","arrowleft","arrowdown","arrowright"];
        const moveKey2 = ["w","a","s","d"];
        const activeKey = [" ","f"];
        document.addEventListener("keydown", function(e){ // 키가 눌려있는 중에는 setTimeOut 호출 X
            const mk1 = moveKey1.indexOf(e.key.toLowerCase());
            const mk2 = moveKey2.indexOf(e.key.toLowerCase());
            const ac = activeKey.indexOf(e.key.toLowerCase());
            if(ac !== -1){
                e.preventDefault();
                if(!key.active()){
                    egg.eggActive(CHAR.offsetLeft,CHAR.offsetTop);
                    key.activeTrue();
                }
            }
            if(key.move(mk1) === false){
                key.presskey(mk1);
            } else if(key.move(mk2) === false){
                key.presskey(mk2);
            }
            (key.flag()) ? false : key.setKeyTimer(keyDown,0);
        });
        document.addEventListener("keyup", function(e){ // 키가 떨어지면 루프 종료
            const mk1 = moveKey1.indexOf(e.key.toLowerCase());
            const mk2 = moveKey2.indexOf(e.key.toLowerCase());
            const ac = activeKey.indexOf(e.key.toLowerCase());
            if(ac !== -1){
                key.activeFalse();
            }
            if(key.move(mk1) === true){
                key.removeKey(mk1);
            } else if(key.move(mk2) === true){
                key.removeKey(mk2);
            }
            if(!key.keyCode()) {
                if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
                key.reset();
                key.flagFalse();
            }
        });
        
        document.addEventListener("touchstart",function(e){
            if(e.target === ctrlActive){
                egg.eggActive(CHAR.offsetLeft,CHAR.offsetTop);
            }
            else if(ElementIndex(EGGS.children,e.target)){
                egg.eggActive(CHAR.offsetLeft,CHAR.offsetTop);
                
            }
            else if(!touch.getFlag()){
                touch.setFlag(true);
                ctrlTouch.classList.add("on");
                ctrlTouch.style.left = e.targetTouches[0].clientX - 15 + "px";
                ctrlTouch.style.top = e.targetTouches[0].clientY - 15 + "px";
                touch.setTouch(e.targetTouches[0].clientX,e.targetTouches[0].clientY,e.targetTouches[0].identifier);
            }
        },false);
        document.addEventListener("touchmove",function(e){
            if(e.cancelable) e.preventDefault();
            let {x,y,id} = touch.getTouch();
            if(e.targetTouches[0].identifier === id){
                let _x = e.targetTouches[0].clientX - x;
                let _y = e.targetTouches[0].clientY - y;
                let dir = {x : Math.cos(Math.atan2(_y,_x)), y : Math.sin(Math.atan2(_y,_x)), deg : Math.atan2(_y,_x) * 180 / Math.PI};
                touch.stop();
                touch.move(dir);
            }
        });
        document.addEventListener("touchend",function(e){
            if(e.touches.length === 0){
                ctrlTouch.children[0].style.left = 0;
                ctrlTouch.children[0].style.top = 0;
                if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
                touch.stop();
                touch.setFlag(false);
                touch.setTouch(0,0,null);
                ctrlTouch.classList.remove("on");
            } else if(e.touches[0].identifier !== id){
                ctrlTouch.children[0].style.left = 0;
                ctrlTouch.children[0].style.top = 0;
                if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
                touch.stop();
                touch.setFlag(false);
                touch.setTouch(0,0,null);
                ctrlTouch.classList.remove("on");
            }
        },false);
        document.addEventListener("touchcancel",function(e){
            if(e.cancelable) e.preventDefault();
            if(e.touches.length === 0){
                ctrlTouch.children[0].style.left = 0;
                ctrlTouch.children[0].style.top = 0;
                if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
                touch.stop();
                touch.setFlag(false);
                touch.setTouch(0,0,null);
                ctrlTouch.classList.remove("on");
            } else if(e.touches[0].identifier !== id){
                ctrlTouch.children[0].style.left = 0;
                ctrlTouch.children[0].style.top = 0;
                if(CHAR.getAttribute("class") ? CHAR.getAttribute("class").indexOf("__") === -1 : false){CHAR.setAttribute("class", "_" + CHAR.getAttribute("class"));}
                touch.stop();
                touch.setFlag(false);
                touch.setTouch(0,0,null);
                ctrlTouch.classList.remove("on");
            }
        },false);
    }

    function isEntryPossible(x,y){ // 이동 가능구역인지 확인
        if(x > CHAR_WIDTH / 2 && x < MAP_WIDTH - CHAR_WIDTH / 2 && y > CHAR_HEIGHT && y < MAP_HEIGHT){

            return !(limitCanvas.getContext('2d').getImageData(x,y,1,1).data[3])
        }else return false
    }
    window.addEventListener("resize", function(){ // 창 크기 변경시 
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        screenFocus();
    });
    function keyFuncs(){ // 키보드 관련 클로져
        let move = [false,false,false,false];
        let keycode = 0;
        let active = false;
        let keyFlag = false;
        let keyTimer = null;
        return {
            presskey : function(index){
                move[index] = true;
                move[index > 1 ? index - 2 : index + 2] = false;
            },
            removeKey : function(index){
                move[index] = false;
            },
            keyCode : function(){
                    keycode = 0;
                    for(let i = 0; i < 4; i++){
                        if(move[i]){keycode += Math.pow(2,i)}
                    }
                    return keycode;
                /*  up => 1             down => 4
                    left => 2           right => 8
                    left up => 3        right up => 9
                    left down => 6      right down => 12    */
            },
            move : function(index){ return index === -1 ? -1 : move[index] },
            length : function(){return moveKeyCodes.length},
            flag : function(){return keyFlag},
            flagFalse : function(){keyFlag = false; 
                return keyFlag},
            flagTrue : function(){keyFlag = true; 
                return keyFlag},
            active : function(){return active},
            activeFalse : function(){active = false; 
                return active},
            activeTrue : function(){active = true; 
                return active},
            setKeyTimer: function(func,time){
                keyTimer = setTimeout(func,time);
            },
            reset : function(){
                move = [false,false,false,false];
                clearTimeout(keyTimer);
            }
        }
    }
    function moveFuncs(){ // 움직임 관련 클로져
        let moveX = CHAR.offsetLeft;
        let moveY = CHAR.offsetTop;
        return{
            moveTo : function(x,y){ // x,y만큼 이동
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
                while (isBlock && count < 5) { // 막힐 때 부드러운 움직임
                    count += 2;
                    isBlock = this.moveSmooth(x,y,count);
                } 
                screenFocus();
                goose.sensor(moveX,moveY); //거위센서 온
            },
            moveSmooth : function(x,y,count){ // 방해물에 막혔을 때 
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
    function gooseFunc(){ // 거위 동작 클로져
        const senserLength = 300;
        let goosePosX = GOOSE.offsetLeft;
        let goosePosY = GOOSE.offsetTop;
        let gooseBox = [goosePosX - senserLength,goosePosX + senserLength, goosePosY - senserLength, goosePosY + senserLength];
        let gooseLevel = 1;
        let isMoving = false;
        function gooseEvent(){
            GOOSE.addEventListener("click",function(){
                document.getElementById("load").classList.remove("load")
            });
        }
        return{
            moveTo : function(x,y,fly){ // 좌표로 이동
                isMoving = true;
                goosePosX = GOOSE.offsetLeft;
                goosePosY = GOOSE.offsetTop;
                let speedX = Math.cos(Math.atan2((y - goosePosY),(x - goosePosX)))*GOOSE_MOVE_PX;
                let speedY = Math.sin(Math.atan2((y - goosePosY),(x - goosePosX)))*GOOSE_MOVE_PX;
                let moveTimes = (x - goosePosX)/speedX;
                let deg = Math.atan2((y - goosePosY),(x - goosePosX))*180 / Math.PI;
                let count = 0;
                let timer = setTimeout(movement, 0);
                if(deg + 180 >= 45 && deg + 180 < 135){
                    GOOSE.setAttribute("class","back");
                } else if(deg + 180 >= 135 && deg + 180 < 225){
                    GOOSE.setAttribute("class","right");
                } else if(deg + 180 >= 225 && deg + 180 < 315){
                    GOOSE.setAttribute("class","front");
                } else {
                    GOOSE.setAttribute("class","left");
                }
                if(fly){GOOSE.classList.add("fly");}
                function movement(){
                    goosePosX = GOOSE.offsetLeft;
                    goosePosY = GOOSE.offsetTop;
                    speedX = Math.cos(Math.atan2((y - goosePosY),(x - goosePosX)))*GOOSE_MOVE_PX;
                    speedY = Math.sin(Math.atan2((y - goosePosY),(x - goosePosX)))*GOOSE_MOVE_PX;
                    count++
                    GOOSE.style.left = (speedX + GOOSE.offsetLeft)+ "px";
                    GOOSE.style.top = (speedY + GOOSE.offsetTop) + "px";
                    GOOSE.style.zIndex = parseInt(y) + 10;
                    if(count < Math.ceil(moveTimes)){timer = setTimeout(movement, 1000 / GOOSE_MOVE_FPS);}
                    else{
                        console.log(goosePosX,goosePosY);
                        isMoving = false;
                        clearTimeout(timer);
                        GOOSE.classList.remove("fly");
                        GOOSE.setAttribute("class", "_"+GOOSE.getAttribute("class"));
                    };
                }
            },
            sensor : function(x,y){ // 거위근처로 갔나?
                goosePosX = GOOSE.offsetLeft;
                goosePosY = GOOSE.offsetTop;
                gooseBox = [goosePosX - senserLength,goosePosX + senserLength, goosePosY - senserLength, goosePosY + senserLength];
                if(isMoving){return false;}
                if( gooseBox[0] < x && gooseBox[1] > x && gooseBox[2] < y && gooseBox[3] > y){
                    this.level();
                    return true;
                } else return false;
            },
            level : function(){ // 거위 근처로 가면 순서대로 작동
                switch (gooseLevel){
                    case  1 : //스타트 -> 다리 앞
                        this.moveTo(1250,1300,false);
                        egg.fieldGen(GOOSE.offsetLeft + 51,GOOSE.offsetTop + 84,1);
                        break;
                    case  2 : //다리 건너기
                        this.moveTo(1250,2000,false);
                        break;
                    case  3 : //다리에서 밭1
                        this.moveTo(500,2500,false);
                        break;
                    case  4 : //밭1에서 밭3
                        egg.fieldGen(GOOSE.offsetLeft + 51,GOOSE.offsetTop + 84,2);
                        this.moveTo(500,3500,false);
                        break;
                    case  5 : //밭3에서 호수 앞
                        this .moveTo(1100,4500,false);
                        break;
                    case  6 : //호수 다리 위
                        this.moveTo(2900,4280,false);
                        break;
                    case  7 : //호수 건너기
                        this.moveTo(4500,4600,false);
                        egg.fieldGen(GOOSE.offsetLeft + 51,GOOSE.offsetTop + 84,3);
                        break;
                    case  8 : //강 다리 2 앞
                        this.moveTo(5000,4000,false);
                        break;
                    case  9 : //강 다리 2 건너기
                        this.moveTo(5000,3000,true);
                        break;
                    case  10 : //돼지우리 건너
                        this.moveTo(5700,2600,true);
                        break;
                    case  11 : //외양간 건너
                        this.moveTo(5300,1900,true);
                        egg.fieldGen(GOOSE.offsetLeft + 51,GOOSE.offsetTop + 84,4);
                        break;
                    case  12 : //숲 속 진입
                        this.moveTo(4500,1500,false);
                        break;
                    case  13 : //더 깊은 곳으로
                        this.moveTo(3800,1200,false);
                        egg.fieldGen(GOOSE.offsetLeft + 51,GOOSE.offsetTop + 84,5);
                        break;
                    case  14 : //엔딩 포인트
                        this.moveTo(5000,500,true);
                        gooseEvent();
                        break;
                    default : break;
                }
                gooseLevel++;
            },
        }
    }
    function eggFunc(){
        let eggs = [
            {
                id : 1,
                title : "웹 표준, 접근성, 호환성 준수 새창에서 열기",
                text : "Samsung E.M.",
                url : "http://cotnmin.com/subpage/samsungE.html"
            },
            {
                id : 2,
                title : "반응형 웹 마크업 &amp; 코딩 새창에서 열기",
                text : "CJ One",
                url : "http://cotnmin.com/subpage/cjone.html"
            },
            {
                id : 3,
                title : "반응형 웹 디자인 새창에서 열기",
                text : "Valve",
                url : "http://cotnmin.com/subpage/valve.html"
            },
            {
                id : 4,
                title : "웹앱 디자인 &amp; 코딩 새창에서 열기",
                text : "Do-Bit",
                url : "http://cotnmin.com/subpage/dobit.html"
            },
            {
                id : 5,
                title : "React웹앱 코딩 새창에서 열기",
                text : "KaKao",
                url : "http://cotnmin.com/subpage/react.html"
            }
        ]
        function plateGen($id){
            let newEgg = document.createElement("a");
            newEgg.classList.add("goldenEgg");
            newEgg.classList.add("egg"+eggs[$id - 1].$id);
            newEgg.setAttribute("href",eggs[$id - 1].url);
            newEgg.setAttribute("target","_blank");
            newEgg.setAttribute("rel","noreferrer noopener");
            newEgg.setAttribute("title",eggs[$id - 1].title);
            newEgg.textContent = eggs[$id - 1].text;
            if(eggPlate.children[$id - 1].childElementCount === 0){
                eggPlate.children[$id - 1].appendChild(newEgg);
            } else {newEgg.remove()}
        }
        return{
            fieldGen : function(x,y,id){
                let newEgg = document.createElement("button");
                newEgg.classList.add("goldenEgg");
                newEgg.classList.add("egg" + eggs[id - 1].id);
                newEgg.setAttribute("type","button");
                newEgg.style.left = x + "px";
                newEgg.style.top = y + "px";
                newEgg.style.zIndex = y;
                if(id === 3) {newEgg.style.zIndex = 6000;}
                newEgg.addEventListener("click",function(){
                    let show = setTimeout(function(){
                        plateGen(id);
                        clearTimeout(show);
                    },1000); 
                    newEgg.classList.add("disapear");
                });
                EGGS.appendChild(newEgg);
            },
            eggActive : function(x,y){
                const eggs = EGGS.children;
                for(let i = 0; i < eggs.length; i++){
                    let box = [eggs[i].offsetLeft - CHAR.offsetWidth, eggs[i].offsetLeft + eggs[i].offsetWidth, eggs[i].offsetTop - CHAR.offsetHeight, eggs[i].offsetTop + eggs[i].offsetHeight]
                    if(x > box[0] && x < box[1] && y > box[2] && y < box[3]){
                        let id = eggs[i].getAttribute("class").replace(/[^0-9]/g,"");
                        let show = setTimeout(function(){
                            plateGen(id);
                            clearTimeout(show);
                        },1500); 
                        eggs[i].classList.add("disapear");
                    }
                }
            },
            cheatEeg : function(){
                for(let i = 1; i <= 5; i++){
                    plateGen(i);
                }
            }
        }
    }
    function keyDown(){ // 키가 눌리면 setTimeOut 루프 시작
        key.flagTrue();
        switch (key.keyCode()) {
            case 1: //up
                move.moveTo(0,-CHAR_MOVE_PX);
                break;
            case 2: //left
                move.moveTo(-CHAR_MOVE_PX,0);
                break;
            case 4: //down
                move.moveTo(0,CHAR_MOVE_PX);
                break;
            case 8: //right
                move.moveTo(CHAR_MOVE_PX,0);
                break;
            case 3: //left up
                move.moveTo(-CHAR_CROSS_PX,-CHAR_CROSS_PX);
                break;
            case 9: //right up
                move.moveTo(CHAR_CROSS_PX,-CHAR_CROSS_PX);
                break;
            case 6: //left down
                move.moveTo(-CHAR_CROSS_PX,CHAR_CROSS_PX);
                break;
            case 12: //right down
                move.moveTo(CHAR_CROSS_PX,CHAR_CROSS_PX);
                break;
            case 0:
                return false;
        }
        function setDir(key){
            CHAR.setAttribute("class","");
            CHAR.classList.add("_"+key);
        }
        setDir(key.keyCode());
        key.setKeyTimer(keyDown,1000/CHAR_MOVE_FPS);
    }
    function touchFunc(){ //터치관련 클로저
        let touchId = null;
        let x = 0;
        let y = 0;
        let touchStart = false;
        let moveTimeout = null;
        return{
            setFlag : function(set){touchStart = set;},
            getFlag : function(){return touchStart},
            setTouch : function(_x,_y,id){x = _x; y = _y; touchId = id;},
            getTouch : function(){return {x: x, y: y, id : touchId}},
            move : function({x,y,deg}){
                moveTimeout = setTimeout(repeatMove,0)
                function repeatMove(){
                    move.moveTo(x*CHAR_MOVE_PX,y*CHAR_MOVE_PX);
                    ctrlTouch.children[0].style.left = x*20 + "px";
                    ctrlTouch.children[0].style.top = y*20 + "px";
                    moveTimeout = setTimeout(repeatMove,1000 / CHAR_MOVE_FPS);
                    if(deg + 180 >= 45 && deg + 180 < 135){
                        CHAR.setAttribute("class","_1");
                    } else if(deg + 180 >= 135 && deg + 180 < 225){
                        CHAR.setAttribute("class","_8");
                    } else if(deg + 180 >= 225 && deg + 180 < 315){
                        CHAR.setAttribute("class","_4");
                    } else {
                        CHAR.setAttribute("class","_2");
                    }
                }
            },
            stop : function(){
                clearTimeout(moveTimeout);
            }
        }
    }
    function screenFocus(){ // 캐릭터에 초점을 맞춰 이동(맵 끝으로 가면 고정)
        focusX = screenWidth / 2 - CHAR.offsetLeft * MAP_RATIO - (CHAR_WIDTH / 2);
        focusY = screenHeight / 2 - CHAR.offsetTop * MAP_RATIO - (CHAR_HEIGHT / 2);
        focusX = focusX >= 0 ? 0 : focusX <= screenWidth - MAP_WIDTH * MAP_RATIO ? MAP.offsetLeft : focusX;
        focusY = focusY >= 0 ? 0 : focusY <= screenHeight - MAP_HEIGHT * MAP_RATIO ? MAP.offsetTop : focusY;
        MAP.style.left = focusX  + "px";
        MAP.style.top = focusY + "px";
    }
    function ElementIndex(eles, ele){
        for(i in eles){
            if(eles[i] == ele){return i;}
        }
        return false
    }
}