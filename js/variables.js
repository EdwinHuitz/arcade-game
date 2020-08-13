/*----- constants -----*/

//all score related variables go here
const scores=
{
    lvlScore:10,//current level's number of pellets
    lvlPrg:4,//current progress towards moving to the next level
    cScore:0,//current score
    hScore:[],//high score
    lScore:[]//level score
};
//all grid related variables go here
const gridXY=
{
    iX:0,iY:0,//grid x and y
    pX:10,pY:10,//player's x and y
    gX:2,gY:2,//ghoul's x and y
    Dify:'',Difx:'',//difference between the player's and the ghoul's x and y
    
    //This is the grid area surrounding the ghoul
    L:'',R:'',U:'',D:'',//one to the left,right,up, and down
    UL:'',UR:'',DL:'',DR:'',//upper left and right, lower left and right
    LL:'',RR:'',UU:'',DD:''//two to the left, right, up, and down
};
export{scores,gridXY};