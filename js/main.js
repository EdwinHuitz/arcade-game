import {Lvl1,Lvl2,Lvl3,Lvl4} from './maps.js';
/*----- constants -----*/
/*----- cached element references -----*/

//declaring the gameboard
const gBoard = document.getElementById("board");
//declaring the current score, level, health, and highscore
const curScore=document.getElementById("curScore");
const curLevel=document.getElementById("curLevel");
const curHealth=document.getElementById("health");
const highScore='';
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
//the current level's progress
let lvlPrg=lvlScore-1;
//current score and high score array
let cScore=0;
let hScore=[];
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
//find difference in y
let Dify;
//find difference in x
let Difx;
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
document.getElementById("startgame").addEventListener('click',init);
document.getElementById("reStart").addEventListener('click',reStart);
document.getElementById("mUp").addEventListener('click',()=>{moveIt(pX,pY,playr,1)});
document.getElementById("mDown").addEventListener('click',()=>{moveIt(pX,pY,playr,2)});
document.getElementById("mLeft").addEventListener('click',()=>{moveIt(pX,pY,playr,3)});
document.getElementById("mRight").addEventListener('click',()=>{moveIt(pX,pY,playr,4)});
//keys pressed
window.addEventListener('keydown',a=>movePlayer(a));

/*----- functions -----*/
//sets up the gameboard and initializes the game
function init()
{
    iY=0;
    let gStart=Math.floor(Math.random() * Math.floor(8));
    ThisLvl=(gStart==0||gStart==2)?Lvl1:(gStart==1||gStart==3)?Lvl2:(gStart==4||gStart==6)?Lvl3:Lvl4;
    //use to debug new maps
    //ThisLvl=Lvl2;
    curLevel.style.visibility="visible";
    curScore.style.visibility="visible";
    curHealth.style.visibility="visible";
    curLevel.innerHTML=lvlScore/10;
    curScore.innerHTML=cScore;
    gBoard.innerHTML="";
    curHealth.innerHTML=`<p>Health: ${pHealth*10}%</p>`;
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
//used for debugging to avoid having to click start
//init();

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
{
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
    else if(i == playr && P2.className=="Path")
    {
        P1.innerHTML="";
        //moves the player
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
    cScore+=10;
    //updates the player's score
    curScore.innerHTML=cScore;
    ding.play();
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
        lvlPrg=lvlScore-1;
        (pHealth<11)?pHealth+=1:"";
        init();
    }
}
//adds the pellets to the board
function addPP()
{
    let iP=0;
    //current level's amount of pellets
    let A;
    do
    {
        //alters the number of pellets if necessary
        A=(lvlScore>10)?lvlScore+1:lvlScore;
        //pellet's Y and X co-ordinates
        let a=Math.floor(Math.random() * Math.floor(21));
        let b=Math.floor(Math.random() * Math.floor(21));
        let c=ThisLvl[a][b];
        //creates the pellets on spots where neither a wall or the player is present
        if(c==0){
            document.getElementById(`c${a}r${b}`).innerHTML=pP;
            iP++;
        }
    }while(iP<A+4);
    curLevel.innerHTML=lvlScore/10;
}
//determines the player's lives
function hitPlayer()
{
    (pHealth>-1)?pHealth-=2:"";
    (pHealth>0)?hit.play():splat.play();
    (pHealth<1)?reStart():"";
    curHealth.style.width=`${pHealth*10}%`;
    curHealth.innerHTML=`<p>Health: ${pHealth*10}%</p>`;
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
            if(Difx<0 && L===1 || Difx>0 && R===1){updateG();cornersY();}}, 320);
        }
        //go down
        else if(Dify>0 && D!=1)
        {
            setTimeout(() =>{moveIt(gX,gY,ghoul,2);}, 280);
            setTimeout(() =>{updateG();if(Difx<0 && L===1 || Difx>0 && R===1){cornersY();}}, 320);
        }
        //checks if there are any corners that need to be crossed
        else if (Dify===0)
        {
            cornersY();
        }
        //checks if a left or right turn can be made
        else if(Difx>0 && L!=1 || Difx<0 && R!=1){goLeftRight();}
    }
    //checks whether the ai should move left or right and then executes the move
    function goLeftRight()
    {
        //go left
        if(Difx<0 && L!=1)
        {
            setTimeout(() =>{moveIt(gX,gY,ghoul,3);}, 280);
            setTimeout(() =>{updateG();if(Difx<0 && L===1 || Difx>0 && R===1){cornersX();}}, 320);
        }
        //go right
        else if(Difx>0 && R!=1)
        {
            setTimeout(() =>{moveIt(gX,gY,ghoul,4);}, 280);
            setTimeout(() =>{updateG();if(Difx<0 && L===1 || Difx>0 && R===1){cornersX();}}, 320);
        }
        else if(Dify<0 && U!=1 || Dify>0 && D!=1){goUpDown();}
    }
    function cornersY()
    {
        updateG();
        //go up and to the left
        if(Difx<0 && UL!=1){moveIt(gX,gY,ghoul,1);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,3);}, 280);}
        //go up and to the right
        else if(Difx>0 && UR!=1){moveIt(gX,gY,ghoul,1);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,4);}, 280);}
        //go down and to the left
        else if(Difx<0 && DL!=1){moveIt(gX,gY,ghoul,2);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,3);}, 280);}
        //go down and to the right
        else if(Difx>0 && DR!=1){moveIt(gX,gY,ghoul,2);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,4);}, 280);}
    }
    function cornersX()
    {
        updateG();
        //go to the left and up
        if(Dify<0 && UL!=1){moveIt(gX,gY,ghoul,3);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,1);}, 280);}
        //go to the right and up
        else if(Dify<0 && UR!=1){moveIt(gX,gY,ghoul,4);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,1);}, 280);}
        //go to the left and down
        else if(Dify>0 && DL!=1){moveIt(gX,gY,ghoul,3);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,2);}, 280);}
        //go to the right and down
        else if(Dify>0 && DR!=1){moveIt(gX,gY,ghoul,4);setTimeout(() =>{updateG();moveIt(gX,gY,ghoul,2);}, 280);}
    }
}
//makes the ghoul move
setInterval(()=>{moveGhouls()},550);
setInterval(() =>{(Dify===0 && Difx ===0)?hitPlayer():"";}, 250);
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
    lvlScore=10;lvlPrg=lvlScore-1;
    init();
}
// setup the winning and losing/dying animations
// add animations for the characters and point balls