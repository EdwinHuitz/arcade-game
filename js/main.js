import {Lvl1,Lvl2,Lvl3,Lvl4} from './maps.js';
/*----- constants -----*/
/*----- cached element references -----*/

//declaring the gameboard
const gBoard = document.getElementById("board");
//declaring the current score, level, health, and highscore
const curScore=document.getElementById("curScore");
const curLevel=document.getElementById("curLevel");
const curHealth=document.getElementById("health");
//declaring the player
const playr = '<div class="Player" id="p"></div>';
//declaring the ghoul
const ghoul = '<div class="Ghoul"></div>';
//declaring point pellet
const pP='<div class="pPoint"></div>';
//audio
const ding=new Audio('audio/Ding.wav');
const hit=new Audio('audio/Hit.wav');
const splat=new Audio('audio/Splat.wav');
/*----- app's state (variables) -----*/

//the current level's number of pellets
let lvlScore=10;
//the player's current progress towards moving on to the next level
let lvlPrg=(lvlScore/2)-1;
//current score and high score and level score arrays
let cScore=0;
let hScore=[];
let lScore=[];
//grid x=iX and y=iX
let iX=0;
let iY=0;
//declares the paths and walls with custom id tag of (col)(row)
let path;
let wall;
//player's x and y
let pX=10;
let pY=10;
//ghoul's x and y
let gX=2;
let gY=2;
//shows whether the ghoul has stepped on a power pellet
let gp=0;
//grid surrounding ghoul
let L;//x to the left
let R;//x to the right
let U;//y above
let D;//y below
let UL;//upper left
let UR;//upper right
let DL;//lower left
let DR;//lower right
let UU;//two above
let DD;//two below
let LL;//two to the left
let RR;//two to the right
//find difference in y
let Dify;
//find difference in x
let Difx;
//ghoul's speed
let T=600;
//player's current number of lives
let pHealth=10;
//current priority
let Prio;
//decides the current level
let ThisLvl;
//checks whether to move on to the next level
let nxtLvl=false;

/*----- event listeners -----*/

//button clicks
document.getElementById("startgame").addEventListener('click',()=>{
    init();
    //makes the ghoul move and detects damage
    setInterval(()=>{
        moveGhouls();
        if((lvlScore/10)>9){T=380;}
    },T);
    setInterval(() =>{(Dify===0 && Difx ===0)?hitPlayer():"";},200);
});
document.getElementById("reStart").addEventListener('click',reStart);
//buttons for navigating the player
document.getElementById("mUp").addEventListener('click',()=>{moveIt(pX,pY,playr,1);if(ThisLvl[pY-1][pX]!=1 && pY>0 && nxtLvl===false){pY--;}else{nxtLvl=false}});
document.getElementById("mDown").addEventListener('click',()=>{moveIt(pX,pY,playr,2);if(ThisLvl[pY+1][pX]!=1 && pY<20 && nxtLvl===false){pY++;}else{nxtLvl=false}});
document.getElementById("mLeft").addEventListener('click',()=>{moveIt(pX,pY,playr,3);if(ThisLvl[pY][pX-1]!=1 && pX>0 && nxtLvl===false){pX--;}else{nxtLvl=false}});
document.getElementById("mRight").addEventListener('click',()=>{moveIt(pX,pY,playr,4);if(ThisLvl[pY][pX+1]!=1 && pX<20 && nxtLvl===false){pX++;}else{nxtLvl=false}});
//keys pressed
window.addEventListener('keydown',a=>movePlayer(a));

/*----- functions -----*/
//sets up the gameboard and initializes the game
function init()
{
    iY=0;
    //random number for picking a map
    let gStart=Math.floor(Math.random() * Math.floor(8));
    //picks the map based on the number above
    ThisLvl=(gStart==0||gStart==2)?Lvl1:(gStart==1||gStart==3)?Lvl2:(gStart==4||gStart==6)?Lvl3:Lvl4;
    //makes the current score, current level, and health bar visible
    curLevel.style.visibility="visible";
    curScore.style.visibility="visible";
    curHealth.style.visibility="visible";
    //calculates the current level
    curLevel.innerHTML=lvlScore/10;
    curScore.innerHTML=cScore;
    gBoard.innerHTML="";
    //adds value to player's health bar text
    curHealth.innerHTML=`<p>Health: ${pHealth*10}%</p>`;
    //expands or contracts the player's health bar
    curHealth.style.width=`${pHealth*10}%`;
    //makes navigation buttons visible
    document.getElementById("btnBar").style.visibility="visible";
    //building lvl
    ThisLvl.forEach((a) => {
    do{
        wall = `<div class="Wall"id="c${iY}r${iX}"></div>`;
        path = `<div class="Path"id="c${iY}r${iX}"></div>`;
        switch(a[iX])
        {
            //adds movable path
            case 0:gBoard.innerHTML+=path;iX++;
            break;
            //adds unpassable walls
            case 1:gBoard.innerHTML+=wall;iX++;
            break;
            //adds the player
            case 2:gBoard.innerHTML+=path;document.getElementById(`c${iY}r${iX}`).innerHTML+=playr;iX++;
            break;
        }
    }while(iX<21);
    iX=0;
    iY++;
    });
    addPP();
}

//
//Player Movement
//

//moves the player when keys are used
function movePlayer(a)
{
    switch(a.key)
    {
        case "w":moveIt(pX,pY,playr,1);
        //checks whether the player's move is valid
        if(ThisLvl[pY-1][pX]!=1 && pY>0 && nxtLvl===false){pY--;}else{nxtLvl=false}
        break;
        case "s":moveIt(pX,pY,playr,2);
        if(ThisLvl[pY+1][pX]!=1 && pY<20 && nxtLvl===false){pY++;}else{nxtLvl=false}
        break;
        case "a":moveIt(pX,pY,playr,3);
        if(ThisLvl[pY][pX-1]!=1 && pX>0 && nxtLvl===false){pX--;}else{nxtLvl=false}
        break;
        case "d":moveIt(pX,pY,playr,4);
        if(ThisLvl[pY][pX+1]!=1 && pX<20 && nxtLvl===false){pX++;}else{nxtLvl=false}
        break;
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
        P2 = document.getElementById(`c${y}r${x-1}`);
        break;
        //right
        case 4:
        P1 = document.getElementById(`c${y}r${x}`);
        P2 = document.getElementById(`c${y}r${x+1}`);
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
            case 1:gY--;
            break;
            //down
            case 2:gY++;
            break;
            //left
            case 3:gX--;
            break;
            //right
            case 4:gX++;
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

//checks if the player has completed the level
function checkPP()
{
    //adds 10 points to the player's score
    cScore+=5;
    //updates the player's score and plays a sound
    curScore.innerHTML=cScore;
    ding.play();
    //checks whether the player has completed the level
    if(lvlPrg>0)
    {
        lvlPrg--;
    }
    else
    {
        nxtLvl=true;
        //resets the player to the center of the map
        pX=10;pY=10;
        //increases the number of pellets and resets the level progression
        lvlScore+=10;
        lvlPrg=(lvlScore/2)-1;
        (pHealth<10)?pHealth+=1:"";
        init();
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
    }while(iP<lvlScore);
    curLevel.innerHTML=lvlScore/10;
}
//determines the player's lives
function hitPlayer()
{
    //damages the player if they're not already dead
    (pHealth>-1)?pHealth-=2:"";
    //plays the proper sound effects for player damage and death
    (pHealth>0)?hit.play():splat.play();
    //checks if the player died
    if(pHealth<1){ScoreBoard();reStart();}
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
    L=ThisLvl[gY][gX-1];//x to the left
    R=ThisLvl[gY][gX+1];//x to the right
    U=ThisLvl[gY-1][gX];//y above
    D=ThisLvl[gY+1][gX];//y below
    UL=ThisLvl[gY-1][gX-1];//upper left
    UR=ThisLvl[gY-1][gX+1];//upper right
    DL=ThisLvl[gY+1][gX-1];//lower left
    DR=ThisLvl[gY+1][gX+1];//lower right
    UU=ThisLvl[gY-2][gX];//two above
    DD=ThisLvl[gY+2][gX];//two below
    LL=ThisLvl[gY][gX-2];//two to the left
    RR=ThisLvl[gY][gX+2];//two to the right
    //find difference in y
    Dify=pY-gY;
    //find difference in x
    Difx=pX-gX;
    //y distance has higher priority followed by x
    Prio=(Dify!=0)?1:0;
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
        if(Dify<0 && U!=1)
        {
            setTimeout(() =>{moveIt(gX,gY,ghoul,1);}, 280);
            setTimeout(() =>{updateG();
            //checks if a left or right turn is possible one space above or below the ghoul
            (Difx<0 && L===1 || Difx>0 && R===1)?cornersY():"";}, 320);
        }
        //go down
        else if(Dify>0 && D!=1)
        {
            setTimeout(() =>{moveIt(gX,gY,ghoul,2);}, 280);
            setTimeout(() =>{updateG();(Difx<0 && L===1 || Difx>0 && R===1)?cornersY():"";}, 320);
        }
        //check for alternate route if stuck
        else if(Difx===0 && Dify!=0)
        {
            updateG();
            cornersX();
            //ghoul above the player with wall under it
            if(Dify>0 && D===1)
            {
                //checks two to the left/right and down one
                if(L!=1 && LL!=1 && ThisLvl[gY+1][gX+2]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,3);}, 280);
                    setTimeout(()=>{updateG();cornersX();},320);
                }
                else if(R!=1 && RR!=1 && ThisLvl[gY+1][gX-2]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,4);}, 280);
                    setTimeout(()=>{updateG();cornersX();},320);
                }
            }
            //ghoul below the player with wall above it
            else if(Dify<0 && U===1)
            {
                if(L!=1 && LL!=1 && ThisLvl[gY-1][gX-2]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,3);}, 280);
                    setTimeout(()=>{updateG();cornersX();},320);
                }
                else if(R!=1 && RR!=1 && ThisLvl[gY-1][gX+2]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,4);}, 280);
                    setTimeout(()=>{updateG();cornersX();},320);
                }
            }
        }
        //if all else fails, try going left or right
        else if(Difx>0 && L!=1 || Difx<0 && R!=1){goLeftRight();}
    }
    //checks whether the ai should move left or right and then executes the move
    function goLeftRight()
    {
        //go left
        if(Difx<0 && L!=1)
        {
            setTimeout(() =>{moveIt(gX,gY,ghoul,3);}, 280);
            setTimeout(() =>{updateG();(Difx<0 && L===1 || Difx>0 && R===1)?cornersX():"";}, 320);
        }
        //go right
        else if(Difx>0 && R!=1)
        {
            setTimeout(() =>{moveIt(gX,gY,ghoul,4);}, 280);
            setTimeout(() =>{updateG();(Difx<0 && L===1 || Difx>0 && R===1)?cornersX():"";}, 320);
        }
        //check for alternate route if stuck
        else if(Dify===0 && Difx!=0)
        {
            updateG();
            cornersY();
            //ghoul to the left of player with wall to the right of the ghoul
            if(Difx>0 && R===1)
            {
                //checks two above to the left
                if(U!=1 && UU!=1 && ThisLvl[gY-2][gX+1]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,1);}, 280);
                    setTimeout(()=>{updateG();cornersY();},320);
                }
                //checks two below to the left
                else if(D!=1 && DD!=1 && ThisLvl[gY+2][gX+1]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,2);}, 280);
                    setTimeout(()=>{updateG();cornersY();},320);
                }
            }
            //ghoul to the right of the player with wall to the left of the ghoul
            else if(Difx<0 && L===1)
            {
                if(U!=1 && UU!=1 && ThisLvl[gY-2][gX-1]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,1);}, 280);
                    setTimeout(()=>{updateG();cornersY();},320);
                }
                else if(D!=1 && DD!=1 && ThisLvl[gY+2][gX-1]!=1)
                {
                    setTimeout(() =>{moveIt(gX,gY,ghoul,2);}, 280);
                    setTimeout(()=>{updateG();cornersY();},320);
                }
            }
        }
        //if all else fails than try going up or down
        else if(Dify<0 && U!=1 || Dify>0 && D!=1){goUpDown();}
    }
    function cornersY()
    {
        updateG();
        //go up and to the left
        if(Difx<0 && U!=1 && UL!=1){moveIt(gX,gY,ghoul,1);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,3);}, 280);}
        //go up and to the right
        else if(Difx>0 && U!=1 && UR!=1){moveIt(gX,gY,ghoul,1);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,4);}, 280);}
        //go down and to the left
        else if(Difx<0 && D!=1 && DL!=1){moveIt(gX,gY,ghoul,2);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,3);}, 280);}
        //go down and to the right
        else if(Difx>0 && D!=1 && DR!=1){moveIt(gX,gY,ghoul,2);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,4);}, 280);}
    }
    function cornersX()
    {
        updateG();
        //go to the left and up
        if(Dify<0 && L!=1 && UL!=1){moveIt(gX,gY,ghoul,3);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,1);}, 280);}
        //go to the left and down
        else if(Dify>0 && L!=1 && DL!=1){moveIt(gX,gY,ghoul,3);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,2);}, 280);}
        //go to the right and up
        else if(Dify<0 && R!=1 && UR!=1){moveIt(gX,gY,ghoul,4);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,1);}, 280);}
        //go to the right and down
        else if(Dify>0 && R!=1 && DR!=1){moveIt(gX,gY,ghoul,4);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,2);}, 280);}
    }
}
//make an array of the scores and reorganize them numerically with a limit of 10 scores afterwhich it will replace lowest score
function ScoreBoard()
{
    let endScore=cScore;
    let endLevel=lvlScore/10;
    //highScore
    if(hScore.length<10)
    {
        hScore.push(endScore);
        lScore.push(endLevel);
    }
    else if(hScore.length==10)
    {
        hScore.splice(9,1,endScore);
        lScore.splice(9,1,endLevel);
    }
    //sorts from highest to lowest
    if(hScore.length>1)
    {
        hScore.sort((a,b)=>b-a);
        lScore.sort((a,b)=>b-a);
    }
    //adds the scores to the scoreboard
    for (let i = 0; i < hScore.length; i++)
    {   
        let tLevel=document.getElementById(`${i+1}l`);
        let tScores=document.getElementById(`${i+1}s`);
        tLevel.innerText=lScore[i];
        tScores.innerText=hScore[i];
    }
}

//resets all variables and restarts the game
function reStart()
{
    pHealth=10;
    gX=2;gY=2;
    updateG();
    gBoard.innerHTML="";
    cScore=0;
    pX=10;pY=10;
    iX=0;iY=0;
    lvlScore=10;lvlPrg=(lvlScore/2)-1;
    init();
}
// setup the winning and losing/dying animations