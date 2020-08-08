/*----- constants -----*/
//0=path, 1=wall, 2=player, 3=ghouls
//grid size (21x21)
const Lvl1 = [
    [0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1],
    [0,0,3,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0],
    [0,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0],
    [1,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0],
    [0,1,1,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0],
    [0,1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0],
    [0,1,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,2,0,0,1,1,1,1,1,0,1,0],
    [0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0],
    [0,0,0,0,0,1,0,0,0,1,0,1,1,1,1,1,0,1,0,1,0],
    [1,1,1,1,0,1,1,1,1,1,0,1,0,0,0,0,0,1,0,1,0],
    [0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,0,0],
    [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,1,0],
    [0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,1,1,0,0],
    [0,1,0,1,0,1,0,1,0,0,0,1,1,1,0,1,1,1,0,0,1],
    [0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,1],
    [0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,0,1,0,1,1,0],
    [0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0]
];
const Lvl2 = [
    [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,3,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0],
    [0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,2,1,0,0,0,1,0,0,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
];
export{Lvl1,Lvl2};