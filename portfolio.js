window.onload = function(){
    let field = document.getElementById("field");
    let CHAR = document.getElementById("dot");
    const CHAR_WIDTH = 50; // 캐릭터 너비
    const CHAR_HEIGHT = 50; // 캐릭터 높이
    const WORLD_WIDTH = 1500; // 맵 전체 너비
    const WORLD_HEIGHT = 1500; // 맵 전체 높이
    const CHAR_MOVE_SPEED = 300; //max(300) 
    const CHAR_MOVE_PX = 2; //(CHAR_MOVE_PX * CHAR_MOVE_SPEED px/s)
    let screenWidth = window.innerWidth; // 스크린 높이
    let screenHeight = window.innerHeight; // 스크린 너비
    let focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2); // 초점 X값(음수)
    let focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2); //초점 Y값(음수)
    
    let keyDownFlag = false; //키 눌려있을 때 true
    let keyTimeout = null; // 키 눌렸을때 setTimeOut
    let pressedKey = ""; // 눌린 키 값
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
    ]
    screenFocus();
    window.onresize = function(){ // 창 크기 변경시 
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        screenFocus();
    }
    function trns(key){ // 키가 눌렸을 때 실행
        let centerX = CHAR.offsetLeft + CHAR_WIDTH / 2;
        let centerY = CHAR.offsetTop + CHAR_HEIGHT / 2;
        let moveX = CHAR.offsetLeft;
        let moveY = CHAR.offsetTop;
        let space = false;
        switch (key) {
            case "ArrowRight":
                    centerX += CHAR_MOVE_PX;
                    moveX += CHAR_MOVE_PX;
                break;
            case "ArrowLeft":
                    centerX -= CHAR_MOVE_PX;
                    moveX -= CHAR_MOVE_PX;
                break;
            case "ArrowUp":
                    centerY -= CHAR_MOVE_PX;
                    moveY -= CHAR_MOVE_PX;
                break;
            case "ArrowDown":
                    centerY += CHAR_MOVE_PX;
                    moveY += CHAR_MOVE_PX;
                break;
            case " ":
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
            if(x >= CHAR_WIDTH / 2 && x <= WORLD_WIDTH - CHAR_WIDTH / 2 && 
            y >= CHAR_HEIGHT / 2 && y <= WORLD_HEIGHT - CHAR_HEIGHT / 2 ){
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
        trns(pressedKey);
        keyDownFlag = true;
        keyTimeout = setTimeout(keyDown,1000/CHAR_MOVE_SPEED);
    }
    document.addEventListener("keydown",function(e){ // 키가 눌려있는 중에는 setTimeOut 호출 X
        pressedKey = e.key;
        if(!keyDownFlag){ keyTimeout = setTimeout(keyDown, 0); }
    });
    document.addEventListener("keyup",function(e){ // 키가 떨어지면 루프 종료
        clearTimeout(keyTimeout);
        keyDownFlag = false;
    });
    function screenFocus(){ // 캐릭터에 초점을 맞춰 이동(맵 끝으로 가면 고정)
        focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2);
        focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2);
        focusX = focusX >= 0 ? 0 : focusX <= screenWidth - WORLD_WIDTH ? field.offsetLeft : focusX;
        focusY = focusY >= 0 ? 0 : focusY <= screenHeight - WORLD_HEIGHT ? field.offsetTop : focusY;
        field.style.left = focusX + "px";
        field.style.top = focusY + "px";
    }
}