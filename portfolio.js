window.onload = function(){
    let field = document.getElementById("field");
    let CHAR = document.getElementById("dot");
    const CHAR_WIDTH = 50;
    const CHAR_HEIGHT = 50;
    const WORLD_WIDTH = 1500;
    const WORLD_HEIGHT = 1500;
    const CHAR_MOVE_SPEED = 300; //max(300)
    const CHAR_MOVE_PX = 2; //(CHAR_MOVE_PX * CHAR_MOVE_SPEED px/s)
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2);
    let focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2);
    
    let keyDownFlag = false;
    let keyTimeout = null;
    let keyMovement = "";
    let limitsZone = [
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
    let activeZone = [
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
    window.onresize = function(){
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        screenFocus();
    }
    function trns(key){
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
        if(!space && isEntryPossible(centerX,centerY)){
            CHAR.classList.remove("ArrowRight","ArrowLeft","ArrowUp","ArrowDown","func");
            CHAR.classList.add(key);
            CHAR.style.left = moveX + "px";
            CHAR.style.top = moveY + "px";
            screenFocus();
        } else if(space){
            if(isActivePossible(centerX,centerY) == "func"){
                CHAR.classList.add("func");
            }
        }
        function isEntryPossible(x,y){
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
    function isActivePossible(x,y){
            for(let i = 0; i < activeZone.length; i++){
                if(x >= activeZone[i].left && x <= (activeZone[i].right ) && 
                y >= activeZone[i].top && y <= (activeZone[i].bottom )){
                    return activeZone[i].func;
                }
            }
            return false;
    }
    function keyDown(){
        trns(keyMovement);
        keyDownFlag = true;
        keyTimeout = setTimeout(keyDown,1000/CHAR_MOVE_SPEED);
    }
    document.addEventListener("keydown",function(e){
        keyMovement = e.key;
        if(!keyDownFlag){
        keyTimeout = setTimeout(keyDown, 0);
    }
    });
    document.addEventListener("keyup",function(e){
        clearTimeout(keyTimeout);
        keyDownFlag = false;
    });
    function screenFocus(){
        focusX = screenWidth / 2 - CHAR.offsetLeft - (CHAR_WIDTH / 2);
        focusY = screenHeight / 2 - CHAR.offsetTop - (CHAR_HEIGHT / 2);
        focusX = focusX >= 0 ? 0 : focusX <= screenWidth - WORLD_WIDTH ? field.offsetLeft : focusX;
        focusY = focusY >= 0 ? 0 : focusY <= screenHeight - WORLD_HEIGHT ? field.offsetTop : focusY;
        field.style.left = focusX + "px";
        field.style.top = focusY + "px";
    }
}