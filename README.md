# BeeSweeper
![alt text](https://github.com/parvinfrzd/prj-ga-44-minesweeper-u1/blob/main/src/img/honeybee.png?raw=true)
### A cute version of original Microsoft Minesweeper game, where you'll need to reveal bees instead of bombs! This way you will only get sting in case you  touch a <img src="https://raw.githubusercontent.com/parvinfrzd/prj-ga-44-minesweeper-u1/main/src/img/honeybee.png" width="20" height="20">.
##  Getting Started:
To play this game please click on this [link](https://parvinfrzd.github.io/prj-ga-44-minesweeper-u1/). 
### First Step : 
Choose the grid size and the number of bees.  No worries! if you change your mind in the middle of the game, just click on the <img src="https://raw.githubusercontent.com/parvinfrzd/prj-ga-44-minesweeper-u1/main/src/img/gear.png" width="20" height="20"> and change the settings. Please be ware! your game will restart as you hit play. 
### Second Step: 
To start with the game, left click to reveal the each square, and right click to pin where you believe there is a bee underneath. 
### Win or Lose Conditions: 
Well that's easy! if you reveal a square with bee, you lose! And if  you manage to reveal all of the cells and pin the ones with bees, you win!

## Screenshots: 
Step One: 
![alt text](https://github.com/parvinfrzd/prj-ga-44-minesweeper-u1/blob/main/src/img/screenshots/1st%20step.png?raw=true)
Step Two:
![alt text](https://github.com/parvinfrzd/prj-ga-44-minesweeper-u1/blob/main/src/img/screenshots/2nd%20step.png?raw=true)
Game Over: 
![alt text](https://github.com/parvinfrzd/prj-ga-44-minesweeper-u1/blob/main/src/img/screenshots/gameover.png?raw=true)
Winning Message: 
![alt text](https://github.com/parvinfrzd/prj-ga-44-minesweeper-u1/blob/main/src/img/screenshots/win.png?raw=true)

## Technolgies: 

- HTML 
- Vanilla Javascript 
- CSS 

## Development: 

The game logic is divided into six main following steps
- Make a grid of cells as page loads 
- Map the bees randomly on the grid 
- Find the neighbouring cells to the bees 
- On the event of left click on cell: 
  - Check if the cell is already revealed
  - Check if the  cell is a bee 
    - If yes: game is over (back to step one)
  - Check if the cell has no bees in it's neighbouring cells 
    - If yes: reveal all the empty cells around it 
- On the event of right click on cell: 
  - If the cell is not pinned: pin the cell 
- Check if the game is Won: either all of the cells are reaveal or they  are bomb and pinned  
  
## Next Steps: 

- Add responsive design to game for mobile devices 
- Add a cell class that contains all of the cell attributes 
- Check for runtime optimization 
  