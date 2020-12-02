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
}{
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

}