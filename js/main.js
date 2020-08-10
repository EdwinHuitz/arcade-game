import {Lvl1,Lvl2} from './maps.js';
/*----- constants -----*/
/*----- cached element references -----*/

//declaring the gameboard
const gBoard = document.getElementById("board");
//declaring the current score, level, and highscore
const curScore=document.getElementById("curScore");
const curLevel=document.getElementById("curLevel");
const highScore='';
//declaring the player
const playr = '<div class="Player" id="p"></div>';
//declaring the ghoul
const ghoul = '<div class="Ghoul"></div>';
//declaring point pellet
const pP='<div class="pPoint"></div>';
const pPh='<div class="pPointh"></div>';

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
//ghoul's previous and current x and y
let gX=2;let pgX=1;
let gY=2;let pgY=1;
//current ghoul x,y and current player x,y
let cG;let cP;
//current ghoul direction of travel
let cdY;let cdX;
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
document.getElementById("mUp").addEventListener('click',moveGhouls);
document.getElementById("mDown").addEventListener('click',moveDown);
document.getElementById("mLeft").addEventListener('click',moveLeft);
document.getElementById("mRight").addEventListener('click',moveRight);
//keys pressed
window.addEventListener('keydown',a=>movePlayer(a));

/*----- functions -----*/

//sets up the gameboard and initializes the game
function init()
{
    iY=0;
    let gStart=Math.floor(Math.random() * Math.floor(2));
    ThisLvl=(gStart==0)?Lvl1:Lvl2;
    //use to debug new maps
    //ThisLvl=Lvl2;
    curLevel.innerHTML=lvlScore/10;
    curScore.innerHTML=cScore;
    gBoard.innerHTML="";
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
            //adds the ghouls
            case 3:gBoard.innerHTML+=path;document.getElementById(`c${iY}r${iX}`).innerHTML+=ghoul;iX++;
            break;
        }
    }while(iX<21)
    iX=0;
    iY++;
    });
    addPP();
}
//used for debugging to avoid having to click start
init();

//
//Player Movement
//

//moves the player when keys are used
function movePlayer(a)
{
    switch(a.key)
    {
        case "w":moveUp(pX,pY,playr);
        //checks whether the player's move is valid
        if(ThisLvl[pY-1][pX]!=1 && pY>0 && nxtLvl===false){pY--;}else{nxtLvl=false}
        break;
        case "s":moveDown(pX,pY,playr);
        if(ThisLvl[pY+1][pX]!=1 && pY<20 && nxtLvl===false){pY++;}else{nxtLvl=false}
        break;
        case "a":moveLeft(pX,pY,playr);
        if(ThisLvl[pY][pX-1]!=1 && pX>0 && nxtLvl===false){pX--;}else{nxtLvl=false}
        break;
        case "d":moveRight(pX,pY,playr);
        if(ThisLvl[pY][pX+1]!=1 && pX<20 && nxtLvl===false){pX++;}else{nxtLvl=false}
        break;
    }
}
//Directions the object moves x,y,id
function moveUp(x,y,i)
{
    //gets the player's current position
    let P1 = document.getElementById(`c${y}r${x}`);
    //gets the player's next position
    let P2 = document.getElementById(`c${y-1}r${x}`);
    //checks if the player can move to this spot
    if(y>0 && P2.className=="Path")
    {
        //checks for pellets
        if(i.toString() == playr && P2.innerHTML==pP)
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
        //moves the ghoul without deleting the pellets
        else if (i.toString() == ghoul && P2.innerHTML==pP)
        {
            P1.innerHTML="";
            P2.innerHTML=`${pPh}${ghoul}`;
            (i.toString() == ghoul)?gY--:"";
        }
        else if (i.toString() == `${pPh}${ghoul}`)
        {
            P1.innerHTML=pP;
            P2.innerHTML=ghoul;
            (i.toString() == ghoul)?gY--:"";
        }
        else
        {
            P1.innerHTML="";
            //moves the player or ghoul
            P2.innerHTML=i;
            (i.toString() == ghoul)?gY--:"";
        }
    }
}
function moveDown(x,y,i)
{
    let P1 = document.getElementById(`c${y}r${x}`);
    let P2 = document.getElementById(`c${y+1}r${x}`);
    if(y<20 && P2.className=="Path")
    {
        P1.innerHTML="";
        if(i.toString() == playr && P2.innerHTML==pP)
        {
            P1.innerHTML="";
            checkPP();
            if(nxtLvl==false)
            {
                P2.innerHTML=i;
            }
        }
        else if (i.toString() == ghoul && P2.innerHTML==pP)
        {
            P1.innerHTML="";
            P2.innerHTML=`${pPh}${ghoul}`;
            (i.toString() == ghoul)?gY++:"";
        }
        else if (i.toString() == `${pPh}${ghoul}`)
        {
            P1.innerHTML=pP;
            P2.innerHTML=ghoul;
            (i.toString() == ghoul)?gY++:"";
        }
        else
        {
            P1.innerHTML="";
            P2.innerHTML=i;
            (i.toString() == ghoul)?gY++:"";
        }
    }
}
function moveLeft(x,y,i)
{
    let P1 = document.getElementById(`c${y}r${x}`);
    let P2 = document.getElementById(`c${y}r${x-1}`);
    if(x>0 && P2.className=="Path")
    {
        if(i.toString() == playr && P2.innerHTML==pP)
        {
            P1.innerHTML="";
            checkPP();
            if(nxtLvl==false)
            {
                P2.innerHTML=i;
            }
        }
        else if (i.toString() == ghoul && P2.innerHTML==pP)
        {
            P1.innerHTML="";
            P2.innerHTML=`${pPh}${ghoul}`;
            (i.toString() == ghoul.toString())?gX--:"";
        }
        else if (i.toString() == `${pPh}${ghoul}`)
        {
            P1.innerHTML=pP;
            P2.innerHTML=ghoul;
            (i.toString() == ghoul)?gX--:"";
        }
        else{
            P1.innerHTML="";
            P2.innerHTML=i;
            (i.toString() == ghoul)?gX--:"";
        }
    }
}
function moveRight(x,y,i)
{
    let P1 = document.getElementById(`c${y}r${x}`);
    let P2 = document.getElementById(`c${y}r${x+1}`);
    if(x<20 && P2.className=="Path")
    {
        if(i.toString() == playr && P2.innerHTML==pP)
        {
            P1.innerHTML="";
            checkPP();
            if(nxtLvl==false)
            {
                P2.innerHTML=i;
            }
        }
        else if (i.toString() == ghoul && P2.innerHTML==pP)
        {
            P1.innerHTML="";
            P2.innerHTML=`${pPh}${ghoul}`;
            (i.toString() == ghoul)?gX++:"";
        }
        else if (i.toString() == `${pPh}${ghoul}`)
        {
            P1.innerHTML=pP;
            P2.innerHTML=ghoul;
            (i.toString() == ghoul)?gX++:"";
        }
        else{
            P1.innerHTML="";
            P2.innerHTML=i;
            (i.toString()== ghoul)?gX++:"";
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
    if(lvlPrg>0)
    {
        lvlPrg--;
    }
    else
    {
        nxtLvl=true;
        //resets the player to the center of the map
        pX=10;pY=10;
        //document.getElementById(`c${pY}r${pX}`).innerHTML=playr;
        //increases the number of pellets and resets the level progression
        lvlScore+=10;
        lvlPrg=lvlScore-1;
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
    }while(iP<A);
    curLevel.innerHTML=lvlScore/10;
}

//
//AI
//

//update ghoul co-ordinates
function updateG()
{
    //current ghoul x,y and current player x,y
    cG=ThisLvl[gY][gX];
    cP=ThisLvl[pY][pX];
    //current ghoul direction of travel
    cdY=0;
    cdX=0;
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
//moves the ghouls
function moveGhouls()
{
    
    //do
    //{
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
                setTimeout(() =>{moveUp(gX,gY,ghoul);}, 300);
                setTimeout(() =>
                {updateG();
                //checks if a left or right turn is possible one space above or below the ghoul
                if(Difx<0 && L===1 || Difx>0 && R===1){updateG();cornersY();}}, 600);
            }
            else if(Dify>0 && D!=1)
            {
                setTimeout(() =>{moveDown(gX,gY,ghoul);}, 300);
                setTimeout(() =>{updateG();if(Difx<0 && L===1 || Difx>0 && R===1){cornersY();}}, 600);
            }
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
            if(Difx<0 && L!=1)
            {
                setTimeout(() =>{moveLeft(gX,gY,ghoul);}, 300);
                setTimeout(() =>{updateG();if(Difx<0 && L===1 || Difx>0 && R===1){cornersX();}}, 600);
            }
            else if(Difx>0 && R!=1)
            {
                setTimeout(() =>{moveRight(gX,gY,ghoul);}, 300);
                setTimeout(() =>{updateG();if(Difx<0 && L===1 || Difx>0 && R===1){cornersX();}}, 600);
            }
            else if(Dify<0 && U!=1 || Dify>0 && D!=1){goUpDown();}
        }
        function cornersY()
        {
            updateG();
            //go up and then to the left
            if(Difx<0 && UL!=1){moveUp(gX,gY,ghoul);setTimeout(() =>{updateG();moveLeft(gX,gY,ghoul);}, 300);}
            //go up and then to the right
            else if(Difx>0 && UR!=1){moveUp(gX,gY,ghoul);setTimeout(() =>{updateG();moveRight(gX,gY,ghoul);}, 300);}
            //go down and then to the left
            else if(Difx<0 && DL!=1){moveDown(gX,gY,ghoul);setTimeout(() =>{updateG();moveLeft(gX,gY,ghoul);}, 300);}
            //go down and then to the right
            else if(Difx>0 && DR!=1){moveDown(gX,gY,ghoul);setTimeout(() =>{updateG();moveRight(gX,gY,ghoul);}, 300);}
        }
        function cornersX()
        {
            updateG();
            //go to the left and up
            if(Dify<0 && UL!=1){moveLeft(gX,gY,ghoul);setTimeout(() =>{updateG();moveUp(gX,gY,ghoul);}, 300);}
            //go to the right and up
            else if(Dify<0 && UR!=1){moveRight(gX,gY,ghoul);setTimeout(() =>{updateG();moveUp(gX,gY,ghoul);}, 300);}
            //go to the left and down
            else if(Dify>0 && DL!=1){moveLeft(gX,gY,ghoul);setTimeout(() =>{updateG();moveDown(gX,gY,ghoul);}, 300);}
            //go to the right and down
            else if(Dify>0 && DR!=1){moveRight(gX,gY,ghoul);setTimeout(() =>{updateG();moveDown(gX,gY,ghoul);}, 300);}
        }
        //checks for deadends
        function deadEnd()
        {
            //Up two from ghouls current position u1=up,u2=left,u3=right
            let u1=ThisLvl[gY-2][gX];let u2=ThisLvl[gY-1][gX-1];let u3=ThisLvl[gY-1][gX+1];
            //Down two from ghouls current position d1=down,d2=left,d3=right
            let d1=ThisLvl[gY+2][gX];let d2=ThisLvl[gY+1][gX-1];let d3=ThisLvl[gY+1][gX+1];
            //Right two from ghouls current position r1=right,r2=up,r3=down
            let r1=ThisLvl[gY][gX+2];let r2=ThisLvl[gY-1][gX+1];let r3=ThisLvl[gY+1][gX+1];
            //Left two from ghouls current position l1=left,r2=up,r3=down
            let l1=ThisLvl[gY][gX-2];let l2=ThisLvl[gY-1][gX-1];let l3=ThisLvl[gY+1][gX-1];
            if(prio===1)
            {
                switch(Dify)
                {
                    //going up
                    case (Dify>0):if(u1==1&&u2==1&&u3==1){};
                    break;
                    //going down
                    case (Dify<0):;
                    break;
                }
            }
            else if(prio===0)
            {

            }
        }
    //}while(Dify>0 || Dify<0);
}
setInterval(()=>{moveGhouls()},1000);
/* 
//have two variables each for x and y
//let bforeY=previous direction(-1=going up)
//let beforeX=previous direction(-1=going left)
//let nowY=current position(+1=going down)
//let nowX=current x position(+1=going right)
//start going down and keep checking to the right every move to try and move closer to the player when possible
check for dead ends
//check your position vs player
//check for walls blocking way towards player?
when calculating which direction to go, don't allow going back your previous way unless it's a deadend?

*/

//resets all variables and restarts the game
function reStart()
{
    gX=2;gY=2;
    updateG();
    gBoard.innerHTML="";
    cScore=0;
    pX=10;pY=10;
    iX=0;iY=0;
    lvlScore=10;lvlPrg=lvlScore-1;
    init();
}
//// x,y grid-positions for the enemies
// every 100 points will grant the player another life
// let the enemies travel around the grid using only 0s by checking their surrounding every time they move and choose their movement direction based on that and a random number
// check during every move if the enemies have collided with the player and if they have, remove 1 life from the player and set the player to lose should their remaining lives reach negative
// setup the winning and losing/dying animations
// add animations for the characters and point balls
// restart once the player runs out of lives