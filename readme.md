# Project 1 - Pac-Man

##Overview

Pacman is a classic arcade style game where you must collect all the pellets on the screen while avoiding the ghosts.

This is my first project for GA's Software Development Intensive course, built using HTML 5, CSS3 (sass), and vanilla javascript.

Play it on ![GitHub Pages](https://herrchick.github.io/Pac-Man/)

## Brief
* To develop a pacman like game where:
  * A board can be cleared
  * Score is displayed
  * Ghosts make an attempt to hunt pacman intelligently

## Technology Used
* HTML 5
* CSS3 (sass)
* JavaScript (ES6)
* git
* GitHub

## Approach Taken

I wanted to mimic the logic that the ghosts in the original pacman used, by evaluating each possible move and choosing the one which minimises the diagonal distance between them and their target.

### Drawing the Board

Origionaly I had been working with a one dimensional array, and using mathematical expressions to obtain "pseudo" 2d positions by translating the array relative to pacman and the ghost. this proved to cause some pathfinding issues so I re-worked the code to use a 2 dimensional array (in JS, arrays within arrays) for my x and y axes.

By looping through this array, I can easily change the level by altering elements in the array:

```javascript
const level1 =

// 0 = blank
// 1 = wall
// 2 = pellet
// 3 = home

[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,3,2,2,2,2,1,1,2,2,2,2,2,2,3,1],
  [1,2,1,1,2,1,1,2,1,1,2,1,1,2,1,1,2,1],
  [1,2,1,1,2,1,1,2,1,1,2,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,0,0,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,1,1,4,4,1,1,2,2,2,2,2,1],
  [1,1,1,1,1,2,1,1,0,0,1,1,2,1,1,1,1,1],
  [1,1,1,1,1,2,2,2,2,2,2,2,2,1,1,1,1,1],
  [1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1],
  [1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,1],
  [1,2,1,0,1,2,1,2,1,1,2,1,2,1,0,1,2,1],
  [1,2,1,0,1,2,1,2,2,2,2,1,2,1,0,1,2,1],
  [1,2,2,2,2,2,1,2,1,1,2,1,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1],
  [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]

  function generateDivs(){
    for (let y = 0; y < gridWidth; y++){
      const rows = []
      for(let x = 0; x < gridWidth; x++){
        const tile = document.createElement('div')
        tile.classList.add('tile')
        grid.appendChild(tile)
        rows.push(tile)
      }
      gameBoard.push(rows)
    }
  }



  function drawGameBoard(){
    for (let x= 0; x < gameBoard.length; x++){
      const levelRow = level1[x]
      const divRow = gameBoard[x]
      for (let y = 0; y < levelRow.length; y++){

        if(levelRow[y] === 1){
          divRow[y].classList.add('wall')
        } else if (levelRow[y] === 0){
          divRow[y].classList.add('tile')
        }else if (levelRow[y] === 2){
          divRow[y].classList.add('pellet')
        }else if(levelRow[y] === 3){
          divRow[y].classList.add('powerup')
        }else if(levelRow[y] === 4){
          divRow[y].classList.add('home')
        }
      }
    }
  }
```

Using this function, I am able to have multiple levels easily, just by inputting different numbers in the array. My ghost logic is independent of any board parameters.

### Ghost Logic

First I needed to determine the shortest diagonal distance between 2 targets, this is performed using this function:

```javascript

function getDyDx(posy, posx, targety, targetx){

  let dx = 0
  let dy = 0

  if(posx < targetx){
    dx = (targetx - posx)
  }else if(posx > targetx){
    dx = (posx - targetx)
  }

  if(posy < targety){
    dy = (targety - posy)
  }else if((posy > targety)){
    dy = (posy - targety)
  }


  return ((dx**2)+(dy**2))
}

```

This function feeds in 4 arguments used in my ghostMovement function, where posx and posy are the 4 squares surrounding each ghost, and target is either pacman, or the home squares.

This returns the diagonal distance between the next square and pacman; which is fed into an array, and the smallest number evaluated. whichever square has the smallest number is chosen, here is a small excerpt of the function which handles this:

```javascript

else if(ghost === 3){
  if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('wall') || (collisionMovementLogicy[i] === ghostPrevPositiony[ghost] && collisionMovementLogicx[i] === ghostPrevPositionx[ghost])) {
    ghostNextMove.push(Infinity)
  } else if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('tile')){
    ghostNextMove.push(getDyDx(collisionMovementLogicy[i],collisionMovementLogicx[i], pacman.y - 5, pacman.x - 2))
  }
}

}
ghostPrevPositiony[ghost] = ghosts[ghost].y
ghostPrevPositionx[ghost] = ghosts[ghost].x
const shortest = ghostNextMove.reduce((a, b) => Math.min(a, b))
ghosts[ghost].x = collisionMovementLogicx[ghostNextMove.indexOf(shortest)]
ghosts[ghost].y = collisionMovementLogicy[ghostNextMove.indexOf(shortest)]

```

This also includes collision logic, and prevents ghosts from turning back on themselves; much like the real pacman.

Calculating the game logic this way also allows to change targets easily, meaning that for the run phase I am able to just set the next move to be the longest diagonal distance between the ghosts and pacman, as well as tergeting home.

All of the ghosts also have different target tiles relative to pacman, with Blinky and Inky chasing pacman directly, and Pinky and Clyde attempting to get behind or in front of pacman respectivley.

All of the pieces in the game are stored as objects, keeping track of what game phase we are in, and their current state. All ghosts are stored in an array, allowing me to loop over the array for all ghosts to avoid functions for each individual ghost.

### Collision

One of the most important aspects of a game is the collision logic. This function runs every 60ms to detect collision events, and changes object properties to determine what logic the ghosts will follow:

```javascript

if(pacman.phase === 'normal'){
  if(['blinky', 'pinky', 'inky', 'clyde'].some(className => {
    return gameBoard[pacman.y][pacman.x].classList.contains(className)
  })) {
    pacman.phase = 'dead'
  }
}

```

This is an excerpt showing the collision for if the ghosts hit pacman. It changes the class to dead and stops gampeplay.

## Finished product

![Pacman Game - Elliott Chick](https://media.giphy.com/media/JRbRiUuAO9NsW57E4n/giphy.gif)

## Wins and Blockers
* Wins
  * Getting the ghost logic to work and being able to set different targets for each of the ghosts
  * All ghosts change state when a power pellet is collected
  * Ghosts can be eaten, and return to home for respawn

* Blockers
  * My first approach was flawed, so I had to rework the code halfway through losing time, I have been unable to add a lot of features I wished to add.

## Future features
* add more detailed animations using CCS Pseudoclasses
* Add sound effects
* Make the game more visually appealing, splash screen, game over indicators etc.

## What I have learned

This project was very challenging, but taught me a lot about array manipulation and the power of looping. How JS handles arguments, lots of DOM manipulation. And how to solve many, many, problems!

The way I have built the code means that new features are not hard to add in, so it will be easy to work on in the future.

## Known Bugs

* Some minor scoreboard issues when re-starting the game
* Sometimes the ghosts will (dependent on the situation) have 'infinity' for each option in their next move analysis, and disappear off the screen. I need to fix this behaviour.
