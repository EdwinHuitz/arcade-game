<span style="text-align:center">

# Arcade Game

## Description
This is a game for which the goal is for the player to try and capture as many "Point Pellets" as they can before the enemies stop them.

<hr/>

## Demo
http://infinite-hunger.surge.sh/

<hr/>

## Wireframe
![Wireframe Example](images/wireframe.png)

## Actual Game
![Screenshot of the actual game](images/screenshot.jpeg)
<hr/>

## Technologies Used
  
HTML, CSS, and Javascript
  
<hr/>
  
## Psudo Code

</span>
<span style="text-align:left;">
  
* lay out a nested array to be used as the gameboard and then fill it with 1's and 0's to design the basic layout
  
* randomize the starting positions of the point pellets
* prepare all of the necessary items like high-score, lifepoints, and x,y grid-positions for the player and enemies
* layout the grid on screen to test how it works. 1 fills a block with black background color and 0 leaves the background color untouched
* design the player's movement to check the player's current position and only move to the user's desired direction if that block is marked with the number 0
* design the point pellets to generate on random 0's and detect whether the user has come in contact with them
* design the score system and set it to increase by 5 for each point pellet that is picked up by the player. every 100 points will grant the player another lifepoint
* let the enemies travel around the grid using only 0s by checking their surrounding every time they move and choosing their movement direction based on the player's position
* check during every move if the enemies have collided with the player and if they have, remove 1 life from the player and set the player to lose should their remaining lives reach 0
* setup the winning and losing/dying animations
* setup the start button and add animations for the characters and point balls
* set up a reset function to reset everything once the player runs out of lives or wants to start over
  
</span><hr/><span style="text-align:center">

## Credits
http://soundbible.com/ - Their great sound effects were used  
https://icons8.com/ - Their incredible images were used
<hr/>

## Future Enhancements
<span style="text-align:left;">

* Adding additional enemies
* Improving the enemies' movement logic so they can navigate harder maps
* Adding a wide variety of additional maps
* Further optimizing the game's incremental difficulty so that it's not too hard nor too easy
* Adding cookies in order to allow the player to save their highscores

</span>