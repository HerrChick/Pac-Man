document.addEventListener('DOMContentLoaded', () => {

  const gridWidth = 18
  const grid = document.querySelector('.grid')
  let pacmanPosition = 19
  let pacmanDirection = ''
  let ghostPosition = 84
  let ghostDistance = 0

  let ghostNextMove = []



  const collisionMovementLogic =
  // array containing ghost movement, left, right, up, down
    [(ghostPosition - 1), (ghostPosition + 1), (ghostPosition - gridWidth), (ghostPosition - gridWidth)]




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
    console.log(pacmanDirection)
  }



  function getDyDx(){

    let dx = 0
    let dy = 0
    let relativePosition = 0

    if(pacmanPosition < ghostPosition){
      relativePosition =  ghostPosition - pacmanPosition
      if ((pacmanPosition % gridWidth) < (ghostPosition % gridWidth)){
        dx = (relativePosition % gridWidth)
        dy = (Math.floor(relativePosition / gridWidth))
      }else{
        dx = Math.abs((relativePosition % gridWidth) - gridWidth)
        dy = (Math.floor(relativePosition / gridWidth)) + 1
      }


    }else if(pacmanPosition > ghostPosition){
      relativePosition = pacmanPosition - ghostPosition
      if ((pacmanPosition % gridWidth) > (ghostPosition % gridWidth)){
        dx = (relativePosition % gridWidth)
        dy = (Math.floor(relativePosition / gridWidth))
      }else{
        dx = Math.abs((relativePosition % gridWidth) - gridWidth)
        dy = (Math.floor(relativePosition / gridWidth)) + 1
      }

    }
    console.log(dx)
    console.log(dy)
    ghostDistance = (((dx^2)+(dy^2)))
    console.log(ghostDistance)
  }

  function ghostCollision(){

  const wallLeft = grid.children[ghostPosition - 1].classList.contains('wall')
  const wallAbove = grid.children[ghostPosition - gridWidth].classList.contains('wall')
  const wallBelow = grid.children[ghostPosition + gridWidth].classList.contains('wall')
  const wallRight = grid.children[ghostPosition + 1].classList.contains('wall')



    grid.children[ghostPosition].classList.remove('ghost')
    // chooses directions to prevent ghosts being stuck in walls
    if (wallAbove || wallBelow ){
      ghostPosition = collisionMovementLogic[Math.round(Math.random())]
      //   }else if (wallLeft && wallBelow){
      //     ghostPosition = collisionMovementLogic[Math.round(Math.random())+1]
      //   }else if (wallAbove && wallRight){
      //     ghostPosition = collisionMovementLogic[
      //   }else if (wallAbove && wallLeft){
    }

    grid.children[ghostPosition].classList.add('ghost')

  }


  // const collisionMovementLogic =
  // // array containing ghost movement, left, right, up, down
  //   [(ghostPosition - 1), (ghostPosition + 1), (ghostPosition - gridWidth), (ghostPosition - gridWidth)]


  function ghostMovement(){
    grid.children[ghostPosition].classList.remove('ghost')
    for (let i = 0; i<collisionMovementLogic.length; i++)
    // left
      if(grid.children[collisionMovementLogic[i]].classList.contains('wall')){
        ghostNextMove.push(NaN)
      } else if(grid.children[collisionMovementLogic[i]].classList.contains('tile')){
        ghostNextMove.push(getDyDx())
      }


  }

  drawGameBoard()

  document.addEventListener('keyup', movePacman)

  ghostCollision()

  // setInterval(ghostCollision, 1000)
  setInterval(getDyDx, 999)
  setInterval(getDistance, 1001)


  // setInterval(ghostCollision, 1000)

})
