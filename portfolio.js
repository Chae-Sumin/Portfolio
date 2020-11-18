window.onload = function(){


    const MAP = document.getElementById("field");
    const CHAR = document.getElementById("dot");

    const controllBtns = document.querySelectorAll("#controller button"); 
    const controllDiv = document.querySelector("#controller>div");

    const CHAR_WIDTH = 50; // 캐릭터 너비
    const CHAR_HEIGHT = 50; // 캐릭터 높이
    const MAP_WIDTH = 1500; // 맵 전체 너비
    const MAP_HEIGHT = 1500; // 맵 전체 높이
    const CHAR_MOVE_SPEED = 300; //max(300) 
    const CHAR_MOVE_PX = 2; //(CHAR_MOVE_PX * CHAR_MOVE_SPEED px/s)

    let isMobile = false
    let screenWidth = window.innerWidth; // 스크린 높이
    let screenHeight = window.innerHeight; // 스크린 너비
    let focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2); // 초점 X값(음수)
    let focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2); //초점 Y값(음수)
    
    let keyDownFlag = false; //키 눌려있을 때 true
    let MouseDownFlag = false; //키 눌려있을 때 true
    let keyTimeout = null; // 키 눌렸을때 setTimeOut
    let pressedKey = []; // 눌린 키 값
    let limitsZone = [ // 제한 구역
        {
            id : 1,
            left : 200,
            top : 0,
            right : 500,
            bottom : 300,
        },
        {
            id : 2,
            left : 0,
            top : 500,
            right : 300,
            bottom : 800,
        },
        {
            id : 3,
            left : 600,
            top : 600,
            right : 900,
            bottom : 900,
        }
    ];
    let activeZone = [ // 상호작용 활성화 구역 (func-> 실행할 함수명)
        {
            id : 1,
            func : "func",
            left : 400,
            top : 400,
            right : 500,
            bottom : 500,
        }
    ];
    screenFocus();
    let mobileDivice = [
        'iphone', 'ipod',
        'window ce', 'android',
        'blackberry', 'nokia',
        'webos', 'opera mini',
        'sonyerricsson', 'opera mobi',
        'iemobile'
    ];
    for (let i in mobileDivice) {
        if (navigator.userAgent.toLowerCase().match(new RegExp(mobileDivice[i]))) {
            isMobile = true;
            document.querySelector("body").classList.add("mob");
        }
    }
    function trns(key){ // 키가 눌렸을 때 실행
        let centerX = CHAR.offsetLeft + CHAR_WIDTH / 2;
        let centerY = CHAR.offsetTop + CHAR_HEIGHT / 2;
        let moveX = CHAR.offsetLeft;
        let moveY = CHAR.offsetTop;
        let space = false;
        document.getElementsByClassName("btnOn")[0] ? document.getElementsByClassName("btnOn")[0].classList.remove("btnOn") : false;
        switch (key) {
            case "ArrowRight":
                    centerX += CHAR_MOVE_PX;
                    moveX += CHAR_MOVE_PX;
                    controllBtns[1].classList.add("btnOn");
                break;
            case "ArrowLeft":
                    centerX -= CHAR_MOVE_PX;
                    moveX -= CHAR_MOVE_PX;
                    controllBtns[2].classList.add("btnOn");
                    break;
            case "ArrowUp":
                    centerY -= CHAR_MOVE_PX;
                    moveY -= CHAR_MOVE_PX;
                    controllBtns[0].classList.add("btnOn");
                    break;
            case "ArrowDown":
                    centerY += CHAR_MOVE_PX;
                    moveY += CHAR_MOVE_PX;
                    controllBtns[3].classList.add("btnOn");
                    break;
            case " ":
                space = true;
                controllBtns[4].classList.add("btnOn");
                break;
            case "active":
                controllBtns[4].classList.add("btnOn");
                space = true;
                break;
            default:
                return false;
        }
        if(!space && isEntryPossible(centerX,centerY)){ // 이동 버튼 
            CHAR.classList.remove("ArrowRight","ArrowLeft","ArrowUp","ArrowDown","func");
            CHAR.classList.add(key);
            CHAR.style.left = moveX + "px";
            CHAR.style.top = moveY + "px";
            screenFocus();
        } else if(space){ // 액티브 버튼
            let func = isActivePossible(centerX,centerY);
            if(func){
                CHAR.classList.add("func");
            }
        }
        function isEntryPossible(x,y){ // 이동 가능구역인지 확인
            if(x >= CHAR_WIDTH / 2 && x <= MAP_WIDTH - CHAR_WIDTH / 2 && 
            y >= CHAR_HEIGHT / 2 && y <= MAP_HEIGHT - CHAR_HEIGHT / 2 ){
                for(let i = 0; i < limitsZone.length; i++){
                    if(x >= limitsZone[i].left && x <= (limitsZone[i].right ) && 
                    y >= limitsZone[i].top && y <= (limitsZone[i].bottom )){
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
    }
    function isActivePossible(x,y){ // 활성화 구역인지 확인
            for(let i = 0; i < activeZone.length; i++){
                if(x >= activeZone[i].left && x <= (activeZone[i].right ) && 
                y >= activeZone[i].top && y <= (activeZone[i].bottom )){
                    return activeZone[i].func;
                }
            }
            return false;
    }
    function keyDown(){ // 키가 눌리면 setTimeOut 루프 시작
        trns(pressedKey[0]);
        keyDownFlag = true;
        keyTimeout = setTimeout(keyDown,1000/CHAR_MOVE_SPEED);
    }
    document.addEventListener("keydown",function(e){ // 키가 눌려있는 중에는 setTimeOut 호출 X
        if(pressedKey.indexOf(e.key)===-1){pressedKey.push(e.key);}
        if(!keyDownFlag){ keyTimeout = setTimeout(keyDown, 0); }
    });
    document.addEventListener("keyup",function(e){ // 키가 떨어지면 루프 종료
        pressedKey.splice(pressedKey.indexOf(e.key),1);
        clearTimeout(keyTimeout);
        console.log(pressedKey);
        if(pressedKey.length == 0) {
        console.log(e);
        keyDownFlag = false;
        }
    });
    window.addEventListener("resize", function(){ // 창 크기 변경시 
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        screenFocus();
    });

    if(isMobile){
        controllDiv.addEventListener("mousedown",function(e){
            e.preventDefault();
            MouseDownFlag = true;
        });
        controllActive.addEventListener("click",function(e){
            e.preventDefault();
            trns("active");
        });
        document.addEventListener("mouseup",function(e){
            MouseDownFlag = false;
            controllDiv.style.backgroundPosition = "50% 50%";
            e.target.classList.remove("btnOn");
            clearTimeout(keyTimeout);
            keyDownFlag = false;
        });
        controllDiv.addEventListener("mousemove",function(e){
            if(MouseDownFlag){
            let x = ((e.clientX - controllDiv.getBoundingClientRect().left - 75) / 2) + 62.5;
            let y = ((e.clientY -controllDiv.getBoundingClientRect().top - 75) / 2) + 62.5;
            controllDiv.style.backgroundPosition = x + "px " + y + "px";
        }});
        controllDiv.addEventListener("mouseleave",function(){
            controllDiv.style.backgroundPosition = "50% 50%";
        });
        
        for(let i = 0; i < 4; i++){
            controllBtns[i].addEventListener("mouseover", function(e){
                if(MouseDownFlag){
                if(pressedKey.indexOf(e.target.textContent)===-1){pressedKey.push(e.target.textContent);}
                e.target.classList.add("btnOn");
                if(!keyDownFlag){ keyTimeout = setTimeout(keyDown, 0); }}
            });
            controllBtns[i].addEventListener("mouseleave",function(e){ // 키가 떨어지면 루프 종료
                e.preventDefault();
                e.target.classList.remove("btnOn");
                controllDiv.style.backgroundPosition = "50% 50%";
                clearTimeout(keyTimeout);
                keyDownFlag = false;
            });
        }
    } else {
        controllDiv.addEventListener("mousedown",function(e){ // 컨트롤 div안에서 마우스 클릭 발생 시 MouseDownFlag = true
            e.preventDefault();
            MouseDownFlag = true;
        });
        document.addEventListener("mouseup",function(){ //마우스 때면 MouseDownFlag = false 
            MouseDownFlag = false;
        });
        for(let i = 0; i < 5; i++){
            controllBtns[i].addEventListener("mousedown", function(e){ //클릭시 루프 시작
                if(pressedKey.indexOf(e.target.textContent)===-1){pressedKey.push(e.target.textContent);}
                if(!keyDownFlag){ keyTimeout = setTimeout(keyDown, 0); }
            });
            controllBtns[i].addEventListener("mouseover", function(e){ // div안에서 클릭 후 위로 올라올 경우 루프 시작
                if(MouseDownFlag){
                if(pressedKey.indexOf(e.target.textContent)===-1){pressedKey.push(e.target.textContent);}
                if(!keyDownFlag){ keyTimeout = setTimeout(keyDown, 0); }}
            });
            controllBtns[i].addEventListener("mouseup",function(e){ // 키가 떨어지면 루프 종료
                clearTimeout(keyTimeout);
                keyDownFlag = false;
            });
            controllBtns[i].addEventListener("mouseleave",function(e){ // 키가 떨어지면 루프 종료
                e.preventDefault();
                clearTimeout(keyTimeout);
                keyDownFlag = false;
            });
        }
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