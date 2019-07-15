document.addEventListener('DOMContentLoaded', () => {

  const gridWidth = 18
  const grid = document.querySelector('.grid')
  let pacmanPosition = 19
  let pacmanDirection = ''
  let ghostPosition = 84
  let ghostDistance = 0

  let blinky = 80
  let pinky = 34
  let inky = 289
  let clyde = 304
  const ghosts = [blinky, pinky, inky, clyde]
  const ghostPrevPosition = [blinky, pinky, inky, clyde]










  // variable that defines the game board
  const gameBoard =

  // 0 = blank
  // 1 = wall
  // 2 = pellet

  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,3,1,
    1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,
    1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,
    1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,
    1,2,2,2,2,2,1,0,0,0,0,1,2,2,2,2,2,1,
    1,1,1,1,1,2,1,0,1,1,0,1,2,1,1,1,1,1,
    2,2,2,2,2,2,0,0,1,1,0,0,2,2,2,2,2,2,
    1,1,1,1,1,2,1,0,0,0,0,1,2,1,1,1,1,1,
    1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,
    1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,1,
    1,2,1,1,1,2,1,2,1,1,2,1,2,1,1,1,2,1,
    1,2,1,1,1,2,1,2,2,2,2,1,2,1,1,1,2,1,
    1,2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,
    1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

  // function that draws the gameboard

  function drawGameBoard(){
    for (let i = 0; i < gameBoard.length; i++)

      if(gameBoard[i] === 1){
        grid.innerHTML += '<div class= \'tile wall\'>'+i+'</div>'
      } else if (gameBoard[i] === 0){
        grid.innerHTML += '<div class= \'tile\'>'+i+'</div>'
      }else if (gameBoard[i] === 2){
        grid.innerHTML += '<div class= \'tile pellet\'>'+i+'</div>'
      }else if(gameBoard[i] === 3){
        grid.innerHTML += '<div class= \'tile powerup\'>'+i+'</div>'
      }
  }


  // function that moves pacman with respect to keypresses. also includes collision.
  function movePacman(e) {

    grid.children[pacmanPosition].classList.remove('pacman')

    switch(e.keyCode) {
      // moving left
      case 37:
        if (grid.children[pacmanPosition - 1].classList.contains('wall')) pacmanPosition += 0
        else if (pacmanPosition % gridWidth !== 0){
          pacmanPosition -= 1
          pacmanDirection = 'left'
        }
        break
        // moving up
      case 38:
        if (grid.children[pacmanPosition - gridWidth].classList.contains('wall')) pacmanPosition += 0
        else if(pacmanPosition - gridWidth >= 0){
          pacmanPosition -= gridWidth
          pacmanDirection = 'up'
        }
        break
        // moving right
      case 39:
        if (grid.children[pacmanPosition + 1].classList.contains('wall')) pacmanPosition += 0
        else if(pacmanPosition % gridWidth < gridWidth - 1){
          pacmanPosition += 1
          pacmanDirection = 'right'
        }
        break
        // moving down
      case 40:
        if (grid.children[pacmanPosition + gridWidth].classList.contains('wall')) pacmanPosition += 0
        else if(pacmanPosition + gridWidth < gridWidth * gridWidth){
          pacmanPosition += gridWidth
          pacmanDirection = 'down'
        }
        break

    }

    if(grid.children[pacmanPosition].classList.contains('pellet')) {
      grid.children[pacmanPosition].classList.remove('pellet')
    }
    grid.children[pacmanPosition].classList.add('pacman')
  }



  function getDyDx(pos){

    let dx = 0
    let dy = 0
    let relativePosition = 0

    if(pacmanPosition < pos){
      relativePosition =  pos - pacmanPosition
      if ((pacmanPosition % gridWidth) < (pos % gridWidth)){
        dx = (relativePosition % gridWidth)
        dy = (Math.floor(relativePosition / gridWidth))
      }else{
        dx = Math.abs((relativePosition % gridWidth) - gridWidth)
        dy = (Math.floor(relativePosition / gridWidth)) + 1
      }


    }else if(pacmanPosition > pos){
      relativePosition = pacmanPosition - pos
      if ((pacmanPosition % gridWidth) > (pos % gridWidth)){
        dx = (relativePosition % gridWidth)
        dy = (Math.floor(relativePosition / gridWidth))
      }else{
        dx = Math.abs((relativePosition % gridWidth) - gridWidth)
        dy = (Math.floor(relativePosition / gridWidth)) + 1
      }

      if(dx === 18){
        dx = 0
      }

    }

    return (((dx^2)+(dy^2)))

  }

  function ghostMovement(){


    for(let ghost = 0; ghost<ghosts.length; ghost++){

      // array containing ghost movement, left, right, up, down
      const collisionMovementLogic = [(ghosts[ghost] - 1), (ghosts[ghost] + 1), (ghosts[ghost] - gridWidth), (ghosts[ghost] + gridWidth)]

      const ghostNextMove = []

      grid.children[ghosts[ghost]].classList.remove('ghost')

      for (let i = 0; i < collisionMovementLogic.length; i++){

        if(grid.children[collisionMovementLogic[i]].classList.contains('wall') || collisionMovementLogic[i] === ghostPrevPosition[ghost]){
          ghostNextMove.push(Infinity)
        } else if(grid.children[collisionMovementLogic[i]].classList.contains('tile')){
          ghostNextMove.push(getDyDx(collisionMovementLogic[i]))
        }

      }
      ghostPrevPosition[ghost] = ghosts[ghost]
      const shortest = ghostNextMove.reduce((a, b) => Math.min(a, b))
      ghosts[ghost] = collisionMovementLogic[ghostNextMove.indexOf(shortest)]
      console.log(ghostNextMove)
      grid.children[ghosts[ghost]].classList.add('ghost')
    }
  }


  drawGameBoard()

  document.addEventListener('keyup', movePacman)



  // setInterval(ghostCollision, 1000)

  setInterval(ghostMovement, 500)


  // setInterval(ghostCollision, 1000)

})
