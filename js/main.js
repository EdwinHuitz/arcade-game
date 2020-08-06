//const
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
//declaring objects
const gBoard = document.getElementById("board");
//variables
//current score and high score names
let cScore=0;
let hScore=[];
//grid x=iX and y=iX
let iX=0;
let iY=0;
//grid used for ball positioning
let ballP = Lvl1;
//declares the paths and walls with custom id tag of (col)(row)
let path;
let wall;
//declaring the player
const playr = '<div class="Player" id="p"></div>';
//declaring power point
const pP='<div class="pPoint"></div>';
//player's x and y
let pX=10;
let pY=10;

//event listeners
//button clicks
document.getElementById("startgame").addEventListener('click',init);
document.getElementById("mUp").addEventListener('click',moveUp);
document.getElementById("mDown").addEventListener('click',moveDown);
document.getElementById("mLeft").addEventListener('click',moveLeft);
document.getElementById("mRight").addEventListener('click',moveRight);
//keys pressed
window.addEventListener('keydown',a=>movePlayer(a));

//functions
//sets up the gameboard and initializes the game
function init()
{
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
}init();
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
//Player movement
function moveUp()
{
    let P1 = document.getElementById(`c${pY}r${pX}`);
    let P2 = document.getElementById(`c${pY-1}r${pX}`);
    if(pY>0 && P2.className=="Path"){
    P1.innerHTML="";
    P2.innerHTML=playr;
    pY--;}
}
function moveDown()
{
    let P1 = document.getElementById(`c${pY}r${pX}`);
    let P2 = document.getElementById(`c${pY+1}r${pX}`);
    if(pY<20 && P2.className=="Path"){
    P1.innerHTML="";
    P2.innerHTML=playr;
    pY++;}
}
function moveLeft()
{
    let P1 = document.getElementById(`c${pY}r${pX}`);
    let P2 = document.getElementById(`c${pY}r${pX-1}`);
    if(pX>0 && P2.className=="Path"){
    P1.innerHTML="";
    P2.innerHTML=playr;
    pX--;}
}
function moveRight()
{
    let P1 = document.getElementById(`c${pY}r${pX}`);
    let P2 = document.getElementById(`c${pY}r${pX+1}`);
    if(pX<20 && P2.className=="Path"){
    P1.innerHTML="";
    P2.innerHTML=playr;
    pX++;}
}
console.log(Lvl1[10][10]);
function addPP()
{
    i=0;
    do
    {
        a=Math.floor(Math.random() * Math.floor(21));
        b=Math.floor(Math.random() * Math.floor(21));
        c=Lvl1[a][b];
        if(c==0 && c!=2)
        {
            document.getElementById(`c${a}r${b}`).innerHTML=pP;
            i++;
        }
    }while(i<10);
}
/*point pellet logic: 



*/

// make another set of arrays which copy the first. This will be used as a guide by the point balls to help randomize their starting positions
// make all the other essential variables like high-score, lifes, and x,y grid-positions for the player and enemies
// design the point balls to generate on random 0's and detect whether the user has come in contact with them
// design the score system and set it to increase by 10 for each point ball that is picked up by the player. every 100 points will grant the player another life
// let the enemies travel around the grid using only 0s by checking their surrounding every time they move and choose their movement direction based on that and a random number
// check during every move if the enemies have collided with the player and if they have, remove 1 life from the player and set the player to lose should their remaining lives reach negative
// setup the winning and losing/dying animations
//add animations for the characters and point balls
// set up a reset function to reset everything once the player runs out of lives or wants to start over