//const
//0=path, 1=wall, 2=player, 3=ball, 4=enemy
//level 1 grid (21x21)
const Lvl1 = [
    [0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1],
    [0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0],
    [1,1,1,1,0,1,1,1,0,0,0,0,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0],
    [0,1,1,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0],
    [0,1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0],
    [0,1,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,2,0,0,1,1,1,1,1,0,1,0],
    [0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0],
    [0,0,0,0,0,1,0,0,0,1,0,1,1,1,1,1,0,1,0,1,0],
    [1,1,1,1,0,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,0],
    [0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0],
    [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,1,0],
    [0,1,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,0,0],
    [0,1,0,1,0,1,0,1,0,0,0,1,1,1,0,1,1,1,0,0,1],
    [0,1,0,0,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1],
    [0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,0,1,0,1,1,0],
    [0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0]
];
//variables
//current score and high score names
let cScore=0;
let hScore=[];
//grid x=i and y=ii
let i=0;
let ii=0;
//grid used for ball positioning
let ballP = Lvl1;
//declaring objects
const gBoard = document.getElementById("board");

//declares the paths and walls with custom id tag of (col)(row)
let path;
let wall;
//declaring the player
const playr = '<div class="Player" id="p"></div>';
//player's x and y
let pX=10;
let pY=10;

//event listeners
document.getElementById("startgame").addEventListener('click',init);
document.getElementById("mUp").addEventListener('click',moveUp);
document.getElementById("mDown").addEventListener('click',moveDown);
document.getElementById("mLeft").addEventListener('click',moveLeft);
document.getElementById("mRight").addEventListener('click',moveRight);
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
        wall = `<div class="Wall"id="c${ii}r${i}"></div>`;
        path = `<div class="Path"id="c${ii}r${i}"></div>`;
        if(a[i]==1)
        {
            gBoard.innerHTML+=wall;
            //console.log(a[i]);
            i++;
        }
        else if(ii==10 && a[i]==2)
        {
            gBoard.innerHTML+=path;
            document.getElementById(`c${ii}r${i}`).innerHTML+=playr;
            //console.log("a");
            i++;
        }
        else if(a[i]==0)
        {
            gBoard.innerHTML+=path;
            //console.log(a[i]);
            i++;
        }
    }while(i<21)
    i=0;
    ii++;
    });
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
//// make the const array to lay out the grid and then fill it with 1's and 0's to design the basic layout
// make another set of arrays which copy the first. This will be used as a guide by the point balls to help randomize their starting positions
// make all the other essential variables like high-score, lifes, and x,y grid-positions for the player and enemies
//// layout the grid on screen to test how it works. 1 fills one block with black background color and 0 leaves the background color white
//// design the player's movement to check the player's current position and only move to the user's desired direction if that block is marked with the number 0
// design the point balls to generate on random 0's and detect whether the user has come in contact with them
// design the score system and set it to increase by 10 for each point ball that is picked up by the player. every 100 points will grant the player another life
// let the enemies travel around the grid using only 0s by checking their surrounding every time they move and choose their movement direction based on that and a random number
// check during every move if the enemies have collided with the player and if they have, remove 1 life from the player and set the player to lose should their remaining lives reach negative
// setup the winning and losing/dying animations
// setup the start button and add animations for the characters and point balls
// set up a reset function to reset everything once the player runs out of lives or wants to start over