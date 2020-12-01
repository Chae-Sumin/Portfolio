window.onload = function(){

    const MAP = document.getElementById("field");
    const CHAR = document.getElementById("char");

    const controllBtns = document.querySelectorAll("#controller button"); 
    const controllDiv = document.querySelector("#controller>div");

    const CHAR_WIDTH = 150; // 캐릭터 너비
    const CHAR_HEIGHT = 200; // 캐릭터 높이
    const MAP_WIDTH = 6000; // 맵 전체 너비
    const MAP_HEIGHT = 5000; // 맵 전체 높이
    const CHAR_MOVE_SPEED = 200; //max(300) 
    // const CHAR_MOVE_TOUCH_SPEED = 300;
    const CHAR_MOVE_PX = 3; //(CHAR_MOVE_PX * CHAR_MOVE_SPEED px/s)
    const CHAR_CROSS_PX = CHAR_MOVE_PX / Math.sqrt(2);
    const key = keyfuncs();
    const move = movefuncs();

    let isMobile = false
    let screenWidth = window.innerWidth; // 스크린 높이
    let screenHeight = window.innerHeight; // 스크린 너비
    let focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2); // 초점 X값(음수)
    let focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2); //초점 Y값(음수)
    
    let centerX = CHAR.offsetLeft + CHAR_WIDTH / 2; // 캐릭터 중심 죄표
    let centerY = CHAR.offsetTop + CHAR_HEIGHT / 2;
    let moveX = CHAR.offsetLeft; // 캐릭터 offset 죄표
    let moveY = CHAR.offsetTop;
    let touchX = 0;
    let touchY = 0;

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
    let limitImg = document.getElementById('limit_img');
    let limitCanvas = document.createElement("canvas");
    limitCanvas.width = limitImg.width;
    limitCanvas.height = limitImg.height;
    limitCanvas.getContext('2d').drawImage(limitImg,0,0,limitImg.width,limitImg.height);
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

    function isActivePossible(x,y){ // 활성화 구역인지 확인
            for(let i = 0; i < activeZone.length; i++){
                if(x >= activeZone[i].left && x <= (activeZone[i].right ) && 
                y >= activeZone[i].top && y <= (activeZone[i].bottom )){
                    return activeZone[i].func;
                }
            }
            return false;
    }
    function isEntryPossible(x,y){ // 이동 가능구역인지 확인
        if(x > CHAR_WIDTH / 2 && x < MAP_WIDTH - CHAR_WIDTH / 2 && y > CHAR_HEIGHT / 2 && y < MAP_HEIGHT - CHAR_HEIGHT / 2){

            return !(limitCanvas.getContext('2d').getImageData(x,y,1,1).data[3])
        }else return false
    }
    
    function keyfuncs(){
        let moveX = 0;
        let moveY = 0;
        let active = false;
        let keyFlag = false;
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
        }
    }
    function movefuncs(){
        let moveX = CHAR.offsetLeft;
        let moveY = CHAR.offsetTop;
        return{
            moveTo : function(x,y){
                if(isEntryPossible(moveX + CHAR_WIDTH / 2 + x,moveY +  CHAR_HEIGHT / 2)){
                    moveX += x;
                    CHAR.style.left = moveX + "px";
                    isBlock = false;
                }
                if(isEntryPossible(moveX + CHAR_WIDTH / 2,moveY +  CHAR_HEIGHT / 2 + y)){
                    moveY += y;
                    CHAR.style.top = moveY + "px";
                    CHAR.style.zIndex = parseInt(moveY + CHAR_HEIGHT / 3);
                    isBlock = false;
                }
                screenFocus();
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
        keyTimeout = setTimeout(keyDown,1000/CHAR_MOVE_SPEED);
    }
    document.addEventListener("keydown",function(e){ // 키가 눌려있는 중에는 setTimeOut 호출 X
        key.presskey(e.key);
        (key.flag()) ? false : keyTimeout = setTimeout(keyDown,0);
    });
    document.addEventListener("keyup",function(e){ // 키가 떨어지면 루프 종료
        key.removeKey(e.key);
        if(!key.keyCode()) {
            CHAR.setAttribute("class","_"+CHAR.getAttribute("class"));
            clearTimeout(keyTimeout);
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
    function touchMove(){
        centerX = CHAR.offsetLeft + CHAR_WIDTH / 2;
        centerY = CHAR.offsetTop + CHAR_HEIGHT / 2;
        moveX = CHAR.offsetLeft;
        moveY = CHAR.offsetTop;
        let lengthX = Math.abs(centerX - touchX);
        let lengthY = Math.abs(centerY - touchY);
        let rateX = Math.sin(Math.atan(lengthX/lengthY));
        let rateY = Math.cos(Math.atan(lengthX/lengthY));
        if(centerX > touchX){
            moveX -= lengthX > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateX : 0;
            centerX -= lengthX > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateX : 0;
        } else if (centerX < touchX){
            moveX += lengthX > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateX : 0;
            centerX += lengthX > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateX : 0;
        }
        if(centerY > touchY){
            moveY -= lengthY > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateY : 0;
            centerY -= lengthY > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateY : 0;
        } else if (centerY < touchY){
            moveY += lengthY > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateY : 0;
            centerY += lengthY > CHAR_MOVE_PX ? CHAR_MOVE_PX * rateY : 0;
        }
        if(!isEntryPossible(centerX,centerY)) return false;
        CHAR.style.left = moveX + "px";
        CHAR.style.top = moveY + "px";
        keyTimeout = setTimeout(touchMove,1000 / CHAR_MOVE_SPEED);
        screenFocus();
    }
    if(isMobile){
        document.addEventListener("touchstart",function(e){
            touchX = e.touches[0].clientX - focusX;
            touchY = e.touches[0].clientY - focusY;
            // controllBtns[4].style.left = touchX + "px";
            // controllBtns[4].style.top = touchY + "px";
            keyTimeout =setTimeout(touchMove,0);
        });
        document.addEventListener("touchmove",function(e){
            e.preventDefault();
            clearTimeout(keyTimeout);
            touchX = e.touches[0].clientX - focusX;
            touchY = e.touches[0].clientY - focusY;
            keyTimeout =setTimeout(touchMove,0);
        });
        document.addEventListener("touchend",function(e){
            e.preventDefault();
            clearTimeout(keyTimeout);
        });
        // controllDiv.addEventListener("mousedown",function(e){
        //     e.preventDefault();
        //     MouseDownFlag = true;
        // });
        // controllActive.addEventListener("click",function(e){
        //     e.preventDefault();
        //     trns("active");
        // });
        // document.addEventListener("mouseup",function(e){
        //     MouseDownFlag = false;
        //     controllDiv.style.backgroundPosition = "50% 50%";
        //     e.target.classList.remove("btnOn");
        //     clearTimeout(keyTimeout);
        //     keyDownFlag = false;
        // });
        // controllDiv.addEventListener("mousemove",function(e){
        //     if(MouseDownFlag){
        //     let x = ((e.clientX - controllDiv.getBoundingClientRect().left - 75) / 2) + 62.5;
        //     let y = ((e.clientY -controllDiv.getBoundingClientRect().top - 75) / 2) + 62.5;
        //     controllDiv.style.backgroundPosition = x + "px " + y + "px";
        // }});
        // controllDiv.addEventListener("mouseleave",function(){
        //     controllDiv.style.backgroundPosition = "50% 50%";
        // });
        
        // for(let i = 0; i < 4; i++){
        //     controllBtns[i].addEventListener("mouseover", function(e){
        //         if(MouseDownFlag){
        //         if(pressedKey.indexOf(e.target.textContent)===-1){pressedKey.push(e.target.textContent);}
        //         e.target.classList.add("btnOn");
        //         if(!keyDownFlag){ keyTimeout = setTimeout(keyDown, 0); }}
        //     });
        //     controllBtns[i].addEventListener("mouseleave",function(e){ // 키가 떨어지면 루프 종료
        //         e.preventDefault();
        //         e.target.classList.remove("btnOn");
        //         controllDiv.style.backgroundPosition = "50% 50%";
        //         clearTimeout(keyTimeout);
        //         keyDownFlag = false;
        //     });
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
                pressedKey.splice(pressedKey.indexOf(e.target.textContent),1);
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