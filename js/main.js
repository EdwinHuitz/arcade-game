/*----- imports -----*/

import {Lvl1,Lvl2,Lvl3,Lvl4} from './maps.js';
import {scores,gridXY,sounds} from './variables.js';

/*----- cached element references -----*/

//declaring the gameboard and start button
const gBoard=document.getElementById("board");
const startBtn=document.getElementById("startgame");
const btnBar=document.getElementById("btnBar");
//declaring the current score, level, health, and highscore
const curScore=document.getElementById("curScore");
const curLevel=document.getElementById("curLevel");
const curProgress=document.getElementById("curProgress");
const curHealth=document.getElementById("health");
//declaring the restart button
const reSetbtn=document.getElementById("reStart");
//declaring the player
const playr = '<div class="Player" id="p"></div>';
//declaring the ghoul
const ghoul = '<div class="Ghoul"></div>'; 
//declaring point pellet
const pP='<div class="pPoint"></div>';

/*----- app's state (variables) -----*/

//declares the paths and walls with custom id tag of (col)(row)
let path;
let wall;
//shows whether the ghoul has stepped on a power pellet
let gp=0;
//ghoul's speed
let T=600;
//player's current health
let pHealth=10;
//current priority
let Prio;
//decides the current level
let ThisLvl;
//checks whether to move on to the next level
let nxtLvl=false;
//intervals for movement and damage
let moveG;
let checkH;
//checks for start or restart button
let reClicked=false;
/*----- event listeners -----*/

//button clicks
startBtn.addEventListener('click',()=>{
    sounds.beep.play();
    //delays the start so the sound has time to load
    setTimeout(() => {startBtn.style.visibility="hidden";if(reClicked===false){init();reClicked=true;}else{reStart();}}, 450); 
});
document.getElementById("reStart").addEventListener('click',reStart);
//buttons for navigating the player
document.getElementById("mUp").addEventListener('click',()=>{moveIt(gridXY.pX,gridXY.pY,playr,1);if(ThisLvl[gridXY.pY-1][gridXY.pX]!=1 && gridXY.pY>0 && nxtLvl===false){gridXY.pY--;}else{nxtLvl=false}});
document.getElementById("mDown").addEventListener('click',()=>{moveIt(gridXY.pX,gridXY.pY,playr,2);if(ThisLvl[gridXY.pY+1][gridXY.pX]!=1 && gridXY.pY<20 && nxtLvl===false){gridXY.pY++;}else{nxtLvl=false}});
document.getElementById("mLeft").addEventListener('click',()=>{moveIt(gridXY.pX,gridXY.pY,playr,3);if(ThisLvl[gridXY.pY][gridXY.pX-1]!=1 && gridXY.pX>0 && nxtLvl===false){gridXY.pX--;}else{nxtLvl=false}});
document.getElementById("mRight").addEventListener('click',()=>{moveIt(gridXY.pX,gridXY.pY,playr,4);if(ThisLvl[gridXY.pY][gridXY.pX+1]!=1 && gridXY.pX<20 && nxtLvl===false){gridXY.pX++;}else{nxtLvl=false}});
//keys pressed
window.addEventListener('keydown',a=>movePlayer(a));

/*----- functions -----*/
//sets up the gameboard and initializes the game
let cache = 0
function init()
{
    gridXY.iY=0;
    gridXY.gX=2;gridXY.gY=2;
    //random number for picking a map and cache to make sure it's not the same map as before
    let gStart=Math.floor(Math.random() * Math.floor(4));
    while(gStart==cache){gStart=Math.floor(Math.random() * Math.floor(4));}
    cache=gStart;
    //picks the map based on the number above
    ThisLvl=gStart==0?Lvl1:gStart==1?Lvl2:gStart==2?Lvl3:Lvl4;
    //resets background color
    document.body.style.backgroundColor="#284D48";
    //makes the current score, current level, movement buttons, and health bar visible
    curLevel.style.visibility="visible";
    curScore.style.visibility="visible";
    curHealth.style.visibility="visible";
    curProgress.style.visibility="visible";
    reSetbtn.style.visibility="visible";
    btnBar.style.visibility="visible";
    //calculates the current level
    curLevel.innerHTML=scores.lvlScore/10;
    curScore.innerHTML=scores.cScore;
    gBoard.innerHTML="";
    //adds value to player's health bar text
    curHealth.innerHTML=`<p>Health: ${pHealth*10}%</p>`;
    //expands or contracts the player's health bar
    curHealth.style.width=`${pHealth*10}%`;
    //adds value to player's progress bar text
    //expands or contracts the player's progress bar
    curProgress.style.width=`0%`;
    //building lvl
    ThisLvl.forEach((a) => {
    do{
        wall = `<div class="Wall"id="c${gridXY.iY}r${gridXY.iX}"></div>`;
        path = `<div class="Path"id="c${gridXY.iY}r${gridXY.iX}"></div>`;
        switch(a[gridXY.iX])
        {
            //adds movable path
            case 0:gBoard.innerHTML+=path;gridXY.iX++;
            break;
            //adds unpassable walls
            case 1:gBoard.innerHTML+=wall;gridXY.iX++;
            break;
            //adds the player
            case 2:gBoard.innerHTML+=path;document.getElementById(`c${gridXY.iY}r${gridXY.iX}`).innerHTML+=playr;gridXY.iX++;
            break;
        }
    }while(gridXY.iX<21);
    gridXY.iX=0;
    gridXY.iY++;
    });
    //adds the point pellets
    addPP();
    //makes the ghoul move
    moveG=setInterval(()=>{moveGhouls();((scores.lvlScore/10)>4)?T=500:((scores.lvlScore/10)>9)?T=400:"";},T);
    //detects damage
    checkH=setInterval(() =>{(gridXY.Dify===0 && gridXY.Difx ===0)?hitPlayer():"";},200);
}

//
//Player Movement
//

//moves the player when keys are used
function movePlayer(a)
{
    if(gridXY.pX==20)
    {
        switch(a.key.toLowerCase())
        {
            case "w":moveIt(gridXY.pX,gridXY.pY,playr,1);
            //checks whether the player's move is valid
            if(ThisLvl[gridXY.pY-1][gridXY.pX]!=1 && gridXY.pY>0 && nxtLvl===false){gridXY.pY--;}else{nxtLvl=false}
            break;
            case "s":moveIt(gridXY.pX,gridXY.pY,playr,2);
            if(ThisLvl[gridXY.pY+1][gridXY.pX]!=1 && gridXY.pY<20 && nxtLvl===false){gridXY.pY++;}else{nxtLvl=false}
            break;
            case "a":moveIt(gridXY.pX,gridXY.pY,playr,3);
            if(ThisLvl[gridXY.pY][gridXY.pX-1]!=1 && gridXY.pX>0 && nxtLvl===false){gridXY.pX--;}else{nxtLvl=false}
            break;
        }
    }
    else if(gridXY.pX==0)
    {
        switch(a.key.toLowerCase())
        {
            case "w":moveIt(gridXY.pX,gridXY.pY,playr,1);
            //checks whether the player's move is valid
            if(ThisLvl[gridXY.pY-1][gridXY.pX]!=1 && gridXY.pY>0 && nxtLvl===false){gridXY.pY--;}else{nxtLvl=false}
            break;
            case "s":moveIt(gridXY.pX,gridXY.pY,playr,2);
            if(ThisLvl[gridXY.pY+1][gridXY.pX]!=1 && gridXY.pY<20 && nxtLvl===false){gridXY.pY++;}else{nxtLvl=false}
            break;
            case "d":moveIt(gridXY.pX,gridXY.pY,playr,4);
            if(ThisLvl[gridXY.pY][gridXY.pX+1]!=1 && gridXY.pX<20 && nxtLvl===false){gridXY.pX++;}else{nxtLvl=false}
            break;
        }
    }
    else
    {
        switch(a.key.toLowerCase())
        {
            case "w":moveIt(gridXY.pX,gridXY.pY,playr,1);
            //checks whether the player's move is valid
            if(ThisLvl[gridXY.pY-1][gridXY.pX]!=1 && gridXY.pY>0 && nxtLvl===false){gridXY.pY--;}else{nxtLvl=false}
            break;
            case "s":moveIt(gridXY.pX,gridXY.pY,playr,2);
            if(ThisLvl[gridXY.pY+1][gridXY.pX]!=1 && gridXY.pY<20 && nxtLvl===false){gridXY.pY++;}else{nxtLvl=false}
            break;
            case "a":moveIt(gridXY.pX,gridXY.pY,playr,3);
            if(ThisLvl[gridXY.pY][gridXY.pX-1]!=1 && gridXY.pX>0 && nxtLvl===false){gridXY.pX--;}else{nxtLvl=false}
            break;
            case "d":moveIt(gridXY.pX,gridXY.pY,playr,4);
            if(ThisLvl[gridXY.pY][gridXY.pX+1]!=1 && gridXY.pX<20 && nxtLvl===false){gridXY.pX++;}else{nxtLvl=false}
            break;
        }
    }
}
function moveIt(x,y,i,d)
{   //current and next blocks
    let P1;
    let P2;
    switch(d)
    {
        //up
        case 1:
        //gets the object's current position
        P1 = document.getElementById(`c${y}r${x}`);
        //gets the object's next position
        P2 = document.getElementById(`c${y-1}r${x}`);
        break;
        //down
        case 2:
        P1 = document.getElementById(`c${y}r${x}`);
        P2 = document.getElementById(`c${y+1}r${x}`);
        break;
        //left
        case 3:
        P1 = document.getElementById(`c${y}r${x}`);
        if(x>0)
        {
            P2 = document.getElementById(`c${y}r${x-1}`);
        }
        else
        {
            P2 = document.getElementById(`c${y}r${0}`);
        }
        break;
        //right
        case 4:
        P1 = document.getElementById(`c${y}r${x}`);
        if(x<20)
        {
            P2 = document.getElementById(`c${y}r${x+1}`);
        }
        else
        {
            P2 = document.getElementById(`c${y}r${20}`);    
        }
        break;
    }
    //checks for pellets
    if(i == playr && P2.innerHTML==pP)
    {
        //clears the previous space
        P1.innerHTML="";
        checkPP();
        //checks for level completion
        if(nxtLvl==false)
        {
            //moves the player
            P2.innerHTML=i;
        }
    }
    //the object simply moves to the next block if none of the above is true
    else if(i == playr && P2.className=="Path" && P2.innerHTML!=pP)
    {
        //leaves the previous block blank
        P1.innerHTML="";
        //moves the player to next block
        P2.innerHTML=i;
    }
    if(i == ghoul && P2.className=="Path")
    {
        switch(d)
        {
            //up
            case 1:gridXY.gY--;
            break;
            //down
            case 2:gridXY.gY++;
            break;
            //left
            case 3:gridXY.gX--;
            break;
            //right
            case 4:gridXY.gX++;
            break;
        }
        //checks if the current block and next block both have pellets on them
        if (P2.innerHTML==pP && gp==1)
        {
            P1.innerHTML=pP;
            P2.innerHTML=i;
            gp=1;
        }
        //checks if current block had a pellet on it so it can be replaced once the ghoul moves to the next empty block
        else if (gp==1)
        {
            P1.innerHTML=pP;
            P2.innerHTML=i;
            gp=0;
        }
        //moves the ghoul without deleting the pellets
        else if (P2.innerHTML==pP)
        {
            P1.innerHTML="";
            P2.innerHTML=i;
            gp=1;
        }
        //moves the ghoul if none of the above is true
        else
        {
            P1.innerHTML="";
            P2.innerHTML=i;
        }
    }
}

//
//Score System
//

//debugging button
//document.getElementById("cheating").addEventListener('click',checkPP)
let prg=0
//checks if the player has completed the level
function checkPP()
{
    //adds 10 points to the player's score
    scores.cScore+=5;
    //updates the player's score and plays a sound
    curScore.innerHTML=scores.cScore;
    sounds.ding.play();
    //checks whether the player has completed the level
    if(prg<scores.lvlPrg-1)
    {
        prg++;
        curProgress.innerHTML=`<p>Progress: ${Math.round((prg)/(scores.lvlPrg)*100)}% ${scores.lvlPrg}</p>`;
        curProgress.style.width=`${Math.round((prg)/(scores.lvlPrg)*100)}%`;
    }
    else
    {
        prg=0;
        clearInterval(moveG);
        clearInterval(checkH);
        sounds.blip.play();
        nxtLvl=true;
        //resets the player to the center of the map
        gridXY.pX=10;gridXY.pY=10;
        //increases the number of pellets and resets the level progression
        scores.lvlScore+=10;
        if(scores.lvlPrg<141)
        {
            scores.lvlPrg=(scores.lvlScore/2)-1;
        }
        else{
            scores.lvlPrg=(141)
        }
        (pHealth<10)?pHealth+=1:"";
        init();
        document.body.style.animationName="blinkGreen";
        setTimeout(()=>{document.body.style.animationName="";},700);
        curProgress.innerHTML=`<p>Progress: ${prg}%</p>`;
    }
}
//adds the pellets to the board
function addPP()
{
    let iP=0;
    //current level's amount of pellets
    do
    {
        //pellet's Y and X co-ordinates
        let a=Math.floor(Math.random() * Math.floor(20));
        let b=Math.floor(Math.random() * Math.floor(20));
        let c=ThisLvl[a][b];
        //creates the pellets on spots where neither a wall or the player is present
        if(c===0)
        {
            document.getElementById(`c${a}r${b}`).innerHTML=pP;
            iP++;
        }
    }while(iP<scores.lvlPrg*2);
    curLevel.innerHTML=scores.lvlScore/10;
}
//determines the player's lives
function hitPlayer()
{
    document.body.style.animationName="blinkRed";
    setTimeout(()=>{document.body.style.animationName="";},200);
    //damages the player if they're not already dead
    (pHealth>-1)?pHealth-=1:"";
    //plays the proper sound effects for player damage and death
    (pHealth>0)?sounds.hit.play():sounds.splat.play();
    //checks if the player died
    if(pHealth<1)
    {
        reSetbtn.style.visibility="hidden";
        btnBar.style.visibility="hidden";
        ScoreBoard();
        clearInterval(moveG);
        clearInterval(checkH);
        gBoard.innerHTML="";
        startBtn.innerText="Try Again?";
        startBtn.style.visibility="visible";
        document.body.style.backgroundColor="darkred";
    }
    //adds the health percentage text to the health bar
    curHealth.innerHTML=`<p>Health: ${pHealth*10}%</p>`;
    //expands or contracts the health bar
    curHealth.style.width=`${pHealth*10}%`;
}
//
//AI
//

//update ghoul co-ordinates
function updateG()
{
    //grid surrounding ghoul
    gridXY.L=ThisLvl[gridXY.gY][gridXY.gX-1];//x to the left
    gridXY.R=ThisLvl[gridXY.gY][gridXY.gX+1];//x to the right
    gridXY.U=ThisLvl[gridXY.gY-1][gridXY.gX];//y above
    gridXY.D=ThisLvl[gridXY.gY+1][gridXY.gX];//y below
    gridXY.UL=ThisLvl[gridXY.gY-1][gridXY.gX-1];//upper left
    gridXY.UR=ThisLvl[gridXY.gY-1][gridXY.gX+1];//upper right
    gridXY.DL=ThisLvl[gridXY.gY+1][gridXY.gX-1];//lower left
    gridXY.DR=ThisLvl[gridXY.gY+1][gridXY.gX+1];//lower right
    if(isNaN(gridXY.gY-2))
    {
        gridXY.UU=ThisLvl[gridXY.gY-2][gridXY.gX];//two above
    }
    else{
        gridXY.UU=ThisLvl[0][gridXY.gX]
    }
    if(isNaN(gridXY.gY+2))
    {
        gridXY.DD=ThisLvl[gridXY.gY+2][gridXY.gX];//two below
    }
    else{
        gridXY.UU=ThisLvl[20][gridXY.gX]
    }
    gridXY.LL=ThisLvl[gridXY.gY][gridXY.gX-2];//two to the left
    gridXY.RR=ThisLvl[gridXY.gY][gridXY.gX+2];//two to the right
    //find difference in y
    gridXY.Dify=gridXY.pY-gridXY.gY;
    //find difference in x
    gridXY.Difx=gridXY.pX-gridXY.gX;
    //y distance has higher priority followed by x
    Prio=(gridXY.Dify!=0)?1:0;
}
//movement logic for the ghoul
function moveGhouls()
{
    updateG();
    //move down if the player is below you and there isn't a wall blocking the path
    if(Prio===1){goUpDown();}
    else if(Prio===0){goLeftRight();}
    //checks whether the ai should move up or down and then executes the move
    function goUpDown()
    {
        //if player y less than ghoul y and no wall above ghoul, move up. Else if while moving up you can get closer x wise, do it once
        if(gridXY.Dify<0 && gridXY.U!=1)
        {
            setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,1);}, T-200);
            setTimeout(() =>{updateG();
            //checks if a left or right turn is possible one space above or below the ghoul
            (gridXY.Difx<0 && gridXY.L===1 || gridXY.Difx>0 && gridXY.R===1)?cornersY():"";}, T-150);
        }
        //go down
        else if(gridXY.Dify>0 && gridXY.D!=1)
        {
            setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,2);}, T-200);
            setTimeout(() =>{updateG();(gridXY.Difx<0 && gridXY.L===1 || gridXY.Difx>0 && gridXY.R===1)?cornersY():"";}, T-150);
        }
        //check for alternate route if stuck
        else if(gridXY.Difx===0 && gridXY.Dify!=0)
        {
            updateG();
            cornersX();
            //ghoul above the player with wall under it
            if(gridXY.Dify>0 && gridXY.D===1)
            {
                //checks two to the left/right and down one
                if(gridXY.L!=1 && gridXY.LL!=1 && ThisLvl[gridXY.gY+1][gridXY.gX+2]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,3);}, T-200);
                    setTimeout(()=>{updateG();cornersX();},T-150);
                }
                else if(gridXY.R!=1 && gridXY.RR!=1 && ThisLvl[gridXY.gY+1][gridXY.gX-2]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,4);}, T-200);
                    setTimeout(()=>{updateG();cornersX();},T-150);
                }
            }
            //ghoul below the player with wall above it
            else if(gridXY.Dify<0 && gridXY.U===1)
            {
                if(gridXY.L!=1 && gridXY.LL!=1 && ThisLvl[gridXY.gY-1][gridXY.gX-2]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,3);}, T-200);
                    setTimeout(()=>{updateG();cornersX();},T-150);
                }
                else if(gridXY.R!=1 && gridXY.RR!=1 && ThisLvl[gridXY.gY-1][gridXY.gX+2]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,4);}, T-200);
                    setTimeout(()=>{updateG();cornersX();},T-150);
                }
            }
        }
        //if all else fails, try going left or right
        else if(gridXY.Difx>0 && gridXY.L!=1 || gridXY.Difx<0 && gridXY.R!=1){goLeftRight();}
    }
    //checks whether the ai should move left or right and then executes the move
    function goLeftRight()
    {
        //go left
        if(gridXY.Difx<0 && gridXY.L!=1)
        {
            setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,3);}, T-200);
            setTimeout(() =>{updateG();(gridXY.Difx<0 && gridXY.L===1 || gridXY.Difx>0 && gridXY.R===1)?cornersX():"";}, T-150);
        }
        //go right
        else if(gridXY.Difx>0 && gridXY.R!=1)
        {
            setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,4);}, T-200);
            setTimeout(() =>{updateG();(gridXY.Difx<0 && gridXY.L===1 || gridXY.Difx>0 && gridXY.R===1)?cornersX():"";}, T-150);
        }
        //check for alternate route if stuck
        else if(gridXY.Dify===0 && gridXY.Difx!=0)
        {
            updateG();
            cornersY();
            //ghoul to the left of player with wall to the right of the ghoul
            if(gridXY.Difx>0 && gridXY.R===1)
            {
                //checks two above to the left
                if(gridXY.U!=1 && gridXY.UU!=1 && ThisLvl[gridXY.gY-2][gridXY.gX+1]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,1);}, T-200);
                    setTimeout(()=>{updateG();cornersY();},T-150);
                }
                //checks two below to the left
                else if(gridXY.D!=1 && gridXY.DD!=1 && ThisLvl[gridXY.gY+2][gridXY.gX+1]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,2);}, T-200);
                    setTimeout(()=>{updateG();cornersY();},T-150);
                }
            }
            //ghoul to the right of the player with wall to the left of the ghoul
            else if(gridXY.Difx<0 && gridXY.L===1)
            {
                if(gridXY.U!=1 && gridXY.UU!=1 && ThisLvl[gridXY.gY-2][gridXY.gX-1]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,1);}, T-200);
                    setTimeout(()=>{updateG();cornersY();},T-150);
                }
                else if(gridXY.D!=1 && gridXY.DD!=1 && ThisLvl[gridXY.gY+2][gridXY.gX-1]!=1)
                {
                    setTimeout(() =>{moveIt(gridXY.gX,gridXY.gY,ghoul,2);}, T-200);
                    setTimeout(()=>{updateG();cornersY();},T-150);
                }
            }
        }
        //if all else fails than try going up or down
        else if(gridXY.Dify<0 && gridXY.U!=1 || gridXY.Dify>0 && gridXY.D!=1){goUpDown();}
    }
    function cornersY()
    {
        updateG();
        //go up and to the left
        if(gridXY.Difx<0 && gridXY.U!=1 && gridXY.UL!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,1);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,3);}, 280);}
        //go up and to the right
        else if(gridXY.Difx>0 && gridXY.U!=1 && gridXY.UR!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,1);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,4);}, 280);}
        //go down and to the left
        else if(gridXY.Difx<0 && gridXY.D!=1 && gridXY.DL!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,2);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,3);}, 280);}
        //go down and to the right
        else if(gridXY.Difx>0 && gridXY.D!=1 && gridXY.DR!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,2);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,4);}, 280);}
    }
    function cornersX()
    {
        updateG();
        //go to the left and up
        if(gridXY.Dify<0 && gridXY.L!=1 && gridXY.UL!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,3);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,1);}, 280);}
        //go to the left and down
        else if(gridXY.Dify>0 && gridXY.L!=1 && gridXY.DL!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,3);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,2);}, 280);}
        //go to the right and up
        else if(gridXY.Dify<0 && gridXY.R!=1 && gridXY.UR!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,4);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,1);}, 280);}
        //go to the right and down
        else if(gridXY.Dify>0 && gridXY.R!=1 && gridXY.DR!=1){moveIt(gridXY.gX,gridXY.gY,ghoul,4);setTimeout(() =>{updateG();moveIt(gridXY.gX,gridXY.gY,ghoul,2);}, 280);}
    }
}
//make an array of the scores and reorganize them numerically with a limit of 10 scores afterwhich it will replace lowest score
function ScoreBoard()
{
    let endScore=scores.cScore;
    let endLevel=scores.lvlScore/10;
    //highScore
    if(scores.hScore.length<10)
    {
        scores.hScore.push(endScore);
        scores.lScore.push(endLevel);
    }
    else if(scores.hScore.length==10)
    {
        scores.hScore.splice(9,1,endScore);
        scores.lScore.splice(9,1,endLevel);
    }
    //sorts from highest to lowest
    if(scores.hScore.length>1)
    {
        scores.hScore.sort((a,b)=>b-a);
        scores.lScore.sort((a,b)=>b-a);
    }
    //adds the scores to the scoreboard
    for (let i = 0; i < scores.hScore.length; i++)
    {   
        let tLevel=document.getElementById(`${i+1}l`);
        let tScores=document.getElementById(`${i+1}s`);
        tLevel.innerText=scores.lScore[i];
        tScores.innerText=scores.hScore[i];
    }
}

//resets all variables and restarts the game
function reStart()
{
    clearInterval(moveG);
    clearInterval(checkH);
    pHealth=10;
    gridXY.gX=2;gridXY.gY=2;
    updateG();
    gBoard.innerHTML="";
    scores.cScore=0;
    gridXY.pX=10;gridXY.pY=10;
    gridXY.iX=0;gridXY.iY=0;
    scores.lvlScore=10;scores.lvlPrg=(scores.lvlScore/2)-1;
    init();
}
// setup the winning and losing/dying animations