/*----- constants -----*/
//0=path, 1=wall, 2=player, 3=ball, 4=enemy
//level 1 grid (21x21)
const Lvl1 = [
    [0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],[1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1],[0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],[0,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0],[1,1,1,1,0,1,1,1,0,0,0,0,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0],[0,1,1,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0],[0,1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0],
    [0,1,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0,0,2,0,0,1,1,1,1,1,0,1,0],[0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0],
    [0,0,0,0,0,1,0,0,0,1,0,1,1,1,1,1,0,1,0,1,0],[1,1,1,1,0,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,0],[0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0],
    [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,1,0],[0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,0,0],[0,1,0,1,0,1,0,1,0,0,0,1,1,1,0,1,1,1,0,0,1],
    [0,1,0,0,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1],[0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,0,1,0,1,1,0],[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0]
];

/*----- cached element references -----*/

//declaring the gameboard
const gBoard = document.getElementById("board");
//the current level's number of pellets
let lvlScore=10;
//the current level's progress
let lvlPrg=lvlScore-1;
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

/*----- app's state (variables) -----*/

//current score and high score names
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
let gX=0;
let gY=0;
//checks whether to move on to the next level
let nxtLvl=false;

/*----- event listeners -----*/

//button clicks
document.getElementById("startgame").addEventListener('click',init);
document.getElementById("reStart").addEventListener('click',reStart);
document.getElementById("mUp").addEventListener('click',moveUp);
document.getElementById("mDown").addEventListener('click',moveDown);
document.getElementById("mLeft").addEventListener('click',moveLeft);
document.getElementById("mRight").addEventListener('click',moveRight);
//keys pressed
window.addEventListener('keydown',a=>movePlayer(a));

/*----- functions -----*/

//sets up the gameboard and initializes the game
function init()
{
    curLevel.innerHTML=lvlScore/10;
    curScore.innerHTML=cScore;
    gBoard.innerHTML="";
    document.getElementById("btnBar").style.visibility="visible";
    //building lvl 1
    Lvl1.forEach((a) => {
    do{
        wall = `<div class="Wall"id="c${iY}r${iX}"></div>`;
        path = `<div class="Path"id="c${iY}r${iX}"></div>`;
        if(a[iX]==1)
        {
            gBoard.innerHTML+=wall;
            iX++;
        }
        else if(iY==10 && a[iX]==2)
        {
            gBoard.innerHTML+=path;
            document.getElementById(`c${iY}r${iX}`).innerHTML+=playr;
            iX++;
        }
        else if(a[iX]==0)
        {
            gBoard.innerHTML+=path;
            iX++;
        }
    }while(iX<21)
    iX=0;
    iY++;
    });
    addPP();
    addGhouls();
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
        case "w":moveUp();
        break;
        case "s":moveDown();
        break;
        case "a":moveLeft();
        break;
        case "d":moveRight();
        break;
    }
}
//Directions the player moves
function moveUp()
{
    //gets the player's current position
    let P1 = document.getElementById(`c${pY}r${pX}`);
    //gets the player's next position
    let P2 = document.getElementById(`c${pY-1}r${pX}`);
    //checks if the player can move to this spot
    if(pY>0 && P2.className=="Path"){
        P1.innerHTML="";
        //checks for powerpoints
        if(P2.innerHTML==pP)
        {
            checkPP();
            //checks for level completion
            if(nxtLvl==false)
            {
                //moves the player
                P2.innerHTML=playr;
                //updates the player's position
                pY--;
            }
            //resets the check for level completion
            nxtLvl=false;
        }
        else{
        //moves the player
        P2.innerHTML=playr;
        //updates the player's position
        pY--;}}
}
function moveDown()
{
    let P1 = document.getElementById(`c${pY}r${pX}`);
    let P2 = document.getElementById(`c${pY+1}r${pX}`);
    if(pY<20 && P2.className=="Path"){
        P1.innerHTML="";
        if(P2.innerHTML==pP)
        {
            P1.innerHTML="";
            checkPP();
            if(nxtLvl=false)
            {
                //P1.innerHTML="";
                P2.innerHTML=playr;
                pY++;
            }
            nxtLvl=false;
        }else{
        //P1.innerHTML="";
        P2.innerHTML=playr;
        pY++;}}
}
function moveLeft()
{
    let P1 = document.getElementById(`c${pY}r${pX}`);
    let P2 = document.getElementById(`c${pY}r${pX-1}`);
    if(pX>0 && P2.className=="Path"){
        P1.innerHTML="";
        if(P2.innerHTML==pP)
        {
            P1.innerHTML="";
            checkPP();
            if(nxtLvl=false)
            {
                P2.innerHTML=playr;
                pX--;
            }
            nxtLvl=false;
        }else{
        //P1.innerHTML="";
        P2.innerHTML=playr;
        pX--;}}
}
function moveRight()
{
    let P1 = document.getElementById(`c${pY}r${pX}`);
    let P2 = document.getElementById(`c${pY}r${pX+1}`);
    if(pX<20 && P2.className=="Path"){
        P1.innerHTML="";
        if(P2.innerHTML==pP)
        {
            
            checkPP();
            if(nxtLvl=false)
            {
                P2.innerHTML=playr;
                pX++;
            }
            nxtLvl=false;
        }
        else{
        P2.innerHTML=playr;
        pX++;}}
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
        document.getElementById(`c${pY}r${pX}`).innerHTML=playr;
        //increases the number of pellets and resets the level progression
        lvlScore+=10;
        lvlPrg=lvlScore-1;
        addPP();
    }
}
//adds the pellets to the board
function addPP()
{
    i=0;
    //current level's amount of pellets
    let A=10;
    do
    {
        //alters the number of pellets if necessary
        A=(lvlScore>10)?lvlScore+1:lvlScore;
        //pellet's Y co-ordinates
        //pellet's X co-ordinates
        a=Math.floor(Math.random() * Math.floor(21));
        b=Math.floor(Math.random() * Math.floor(21));
        c=Lvl1[a][b];
        //creates the pellets on spots where neither a wall or the player is present
        if(c==0 && c!=2){
            document.getElementById(`c${a}r${b}`).innerHTML=pP;
            i++;
        }
    }while(i!=A);
    curLevel.innerHTML=lvlScore/10;
}

//
//AI
//
//adds the ghouls
function addGhouls()
{
    document.getElementById("c0r0").innerHTML=ghoul;
}

/* 
check for dead ends
check your position vs player
check for walls blocking way towards player?
when calculating which direction to go, don't allow going back your previous way unless it's a deadend?

*/

//resets all variables and restarts the game
function reStart()
{
    gBoard.innerHTML="";
    cScore=0;
    pX=10;pY=10;
    iX=0;iY=0;
    lvlScore=10;lvlPrg=lvlScore-1;
    init();
}
// x,y grid-positions for the enemies
// every 100 points will grant the player another life
// let the enemies travel around the grid using only 0s by checking their surrounding every time they move and choose their movement direction based on that and a random number
// check during every move if the enemies have collided with the player and if they have, remove 1 life from the player and set the player to lose should their remaining lives reach negative
// setup the winning and losing/dying animations
//add animations for the characters and point balls
// restart once the player runs out of lives