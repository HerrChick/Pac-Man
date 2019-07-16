document.addEventListener('DOMContentLoaded', () => {

  const gridWidth = 18
  const grid = document.querySelector('.grid')
  const statusBoard = document.querySelector('.status')
  let pacmanPosition = 19
  let pacmanDirection = ''
  let ghostDistance = 0
  let score = 0
  let lives = 2
  let inRunPhase = false

  let blinky = {position: 80, eaten: false}
  let pinky = {position: 34, eaten: false}
  let inky = {position: 289, eaten: true}
  let clyde = {position: 304, eaten: false}
  let ghosts = [blinky, pinky, inky, clyde]
  let ghostPrevPosition = [blinky, pinky, inky, clyde]
  let killedGhosts = []
  let ghostsTimer = null
  let runTimer = null








  // variable that defines the game board
  const gameBoard =

  // 0 = blank
  // 1 = wall
  // 2 = pellet

  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,3,1,
    1,2,1,1,2,1,1,2,1,1,2,1,1,2,1,1,2,1,
    1,2,1,1,2,1,1,2,1,1,2,1,1,2,1,1,2,1,
    1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,
    1,2,2,2,2,2,1,0,0,0,0,1,2,2,2,2,2,1,
    1,1,1,1,1,2,1,0,1,1,0,1,2,1,1,1,1,1,
    2,2,2,2,2,2,0,0,1,1,0,0,2,2,2,2,2,2,
    1,1,1,1,1,2,1,0,0,0,0,1,2,1,1,1,1,1,
    1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,
    1,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,1,
    1,2,1,0,1,2,1,2,1,1,2,1,2,1,0,1,2,1,
    1,2,1,0,1,2,1,2,2,2,2,1,2,1,0,1,2,1,
    1,2,2,2,2,2,1,1,2,2,1,1,2,2,2,2,2,1,
    1,2,1,1,1,1,1,1,2,2,1,1,1,1,1,1,2,1,
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



  function getDyDx(pos, eaten){

    let dx = 0
    let dy = 0
    let relativePosition = 0

    if(eaten === false){

      if(pacmanPosition < pos){
        relativePosition =  pos - pacmanPosition
        if ((pacmanPosition % gridWidth) < (pos % gridWidth)){
          dx = (relativePosition % gridWidth)
          dy = (Math.floor(relativePosition / gridWidth))
        }else{
          dx = Math.abs((relativePosition % gridWidth) - gridWidth)
          dy = (Math.floor(relativePosition / gridWidth)) + 1
        }
      }


      if(pacmanPosition > pos){
        relativePosition = pacmanPosition - pos
        if ((pacmanPosition % gridWidth) > (pos % gridWidth)){
          dx = (relativePosition % gridWidth)
          dy = (Math.floor(relativePosition / gridWidth))
        }else{
          dx = Math.abs((relativePosition % gridWidth) - gridWidth)
          dy = (Math.floor(relativePosition / gridWidth)) + 1
        }
      }
    }

    if(eaten === true){
      if(0 < pos){
        relativePosition =  pos - 0
        if ((0 % gridWidth) < (pos % gridWidth)){
          dx = (relativePosition % gridWidth)
          dy = (Math.floor(relativePosition / gridWidth))
        }else{
          dx = Math.abs((relativePosition % gridWidth) - gridWidth)
          dy = (Math.floor(relativePosition / gridWidth)) + 1
        }
      }


      if(0 > pos){
        relativePosition = 0 - pos
        if ((0 % gridWidth) > (pos % gridWidth)){
          dx = (relativePosition % gridWidth)
          dy = (Math.floor(relativePosition / gridWidth))
        }else{
          dx = Math.abs((relativePosition % gridWidth) - gridWidth)
          dy = (Math.floor(relativePosition / gridWidth)) + 1
        }
      }
    }

    // if((pacmanPosition % gridWidth) === (pos % gridWidth)){
    //   dy = 0
    // }
    // if(Math.floor(pacmanPosition / gridWidth) === Math.floor(pos / gridWidth)){
    //   dx = 0
    // }

    if(dx === 18){
      dx = 0
    }
    if(dy === 18){
      dy = 0
    }
    //
    // if(dx === 0){
    //   if(pacmanPosition>pos){
    //     return 0.1
    //   }else if (pacmanPosition<pos){
    //     return 0.1
    //   }
    // }
    // if(dy === 0){
    //   if(pacmanPosition>pos){
    //     return 0.1
    //   }else if (pacmanPosition<pos){
    //     return 0.1
    //   }
    // }


    return ((Math.sqrt(dx^2)+(dy^2)))


  }

  function ghostMovement(){

    for(let ghost = 0; ghost<ghosts.length; ghost++){

      if(ghosts[ghost].eaten === false){

        // array containing ghost movement, left, right, up, down
        const collisionMovementLogic = [(ghosts[ghost].position - 1), (ghosts[ghost].position + 1), (ghosts[ghost].position - gridWidth), (ghosts[ghost].position + gridWidth)]

        const ghostNextMove = []

        grid.children[ghosts[ghost].position].classList.remove('run')
        grid.children[ghosts[ghost].position].classList.remove('ghost')
        grid.children[ghosts[ghost].position].classList.remove('eyes')

        for (let i = 0; i < collisionMovementLogic.length; i++){

          if(grid.children[collisionMovementLogic[i]].classList.contains('wall') || collisionMovementLogic[i] === ghostPrevPosition[ghost]){
            ghostNextMove.push(Infinity)
          } else if(grid.children[collisionMovementLogic[i]].classList.contains('tile')){
            ghostNextMove.push(getDyDx(collisionMovementLogic[i], ghosts[ghost].eaten))
          }

        }
        ghostPrevPosition[ghost] = ghosts[ghost].position
        const shortest = ghostNextMove.reduce((a, b) => Math.min(a, b))
        ghosts[ghost].position = collisionMovementLogic[ghostNextMove.indexOf(shortest)]

        grid.children[ghosts[ghost].position].classList.add('ghost')
      }

      if(ghosts[ghost].eaten === true){
        // array containing ghost movement, left, right, up, down
        const collisionMovementLogic = [(ghosts[ghost].position - 1), (ghosts[ghost].position + 1), (ghosts[ghost].position - gridWidth), (ghosts[ghost].position + gridWidth)]

        const ghostNextMove = []

        grid.children[ghosts[ghost].position].classList.remove('run')
        grid.children[ghosts[ghost].position].classList.remove('ghost')
        grid.children[ghosts[ghost].position].classList.remove('eyes')

        for (let i = 0; i < collisionMovementLogic.length; i++){

          if(grid.children[collisionMovementLogic[i]].classList.contains('wall') || collisionMovementLogic[i] === ghostPrevPosition[ghost]){
            ghostNextMove.push(Infinity)
          } else if(grid.children[collisionMovementLogic[i]].classList.contains('tile')){
            ghostNextMove.push(getDyDx(collisionMovementLogic[i], ghosts[ghost].eaten))
          }

        }
        ghostPrevPosition[ghost] = ghosts[ghost].position
        const shortest = ghostNextMove.reduce((a, b) => Math.min(a, b))
        ghosts[ghost].position = collisionMovementLogic[ghostNextMove.indexOf(shortest)]
        grid.children[ghosts[ghost].position].classList.add('eyes')
      }

      if(grid.children[pacmanPosition].classList.contains('powerup')){
        grid.children[pacmanPosition].classList.remove('powerup')
        clearInterval(ghostsTimer)
        runTimer = setInterval(powerUp, 750)

        setTimeout(() => {
          clearInterval(runTimer)
        }, 5000)
        setTimeout(() => {
          ghostsTimer = setInterval(ghostMovement, 500)
        }, 5001)


      }
    }
  }

  function powerUp(){
    for(let ghost = 0; ghost<ghosts.length; ghost++){

      // array containing ghost movement, left, right, up, down
      const collisionMovementLogic = [(ghosts[ghost].position - 1), (ghosts[ghost].position + 1), (ghosts[ghost].position - gridWidth), (ghosts[ghost].position + gridWidth)]

      const ghostNextMove = []

      grid.children[ghosts[ghost].position].classList.remove('ghost')
      grid.children[ghosts[ghost].position].classList.remove('run')
      grid.children[ghosts[ghost].position].classList.remove('eyes')


      for (let i = 0; i < collisionMovementLogic.length; i++){

        if(grid.children[collisionMovementLogic[i]].classList.contains('wall') || collisionMovementLogic[i] === ghostPrevPosition[ghost]){
          ghostNextMove.push(0)
        } else if(grid.children[collisionMovementLogic[i]].classList.contains('tile')){
          ghostNextMove.push(getDyDx(collisionMovementLogic[i], ghosts[ghost].eaten))
        }

      }
      ghostPrevPosition[ghost] = ghosts[ghost].position
      const shortest = ghostNextMove.reduce((a, b) => Math.max(a, b))
      ghosts[ghost].position = collisionMovementLogic[ghostNextMove.indexOf(shortest)]

      grid.children[ghosts[ghost].position].classList.add('run')

      if(grid.children[ghosts[ghost].position].classList.contains('pacman')) {
        grid.children[ghosts[ghost].position].classList.remove('run')
        grid.children[ghosts[ghost].position].classList.remove('ghost')
        grid.children[ghosts[ghost].position].classList.add('eyes')
        ghosts[ghost].eaten = true
        score += 400
        document.querySelector('.score').innerText = score

      }

    }
  }

  function returnHome(){
    for(let ghost = 0; ghost<ghosts.length; ghost++){

      if(ghosts[ghost].eaten === true){
      // array containing ghost movement, left, right, up, down
        const collisionMovementLogic = [(ghosts[ghost].position - 1), (ghosts[ghost].position + 1), (ghosts[ghost].position - gridWidth), (ghosts[ghost].position + gridWidth)]

        const ghostNextMove = []

        grid.children[ghosts[ghost].position].classList.remove('ghost')
        grid.children[ghosts[ghost].position].classList.remove('run')
        grid.children[ghosts[ghost].position].classList.remove('eyes')

        for (let i = 0; i < collisionMovementLogic.length; i++){

          if(grid.children[collisionMovementLogic[i]].classList.contains('wall') || collisionMovementLogic[i] === ghostPrevPosition[ghost]){
            ghostNextMove.push(Infinity)
          } else if(grid.children[collisionMovementLogic[i]].classList.contains('tile')){
            ghostNextMove.push(getDyDx(collisionMovementLogic[i], ghosts[ghost].eaten))
          }

        }
        ghostPrevPosition[ghost] = ghosts[ghost].position
        const shortest = ghostNextMove.reduce((a, b) => Math.min(a, b))
        ghosts[ghost].position = collisionMovementLogic[ghostNextMove.indexOf(shortest)]

        grid.children[ghosts[ghost].position].classList.add('eyes')

      }
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
      score += 100
      document.querySelector('.score').innerText = score
    }



    grid.children[pacmanPosition].classList.add('pacman')
  }


  drawGameBoard()

  document.addEventListener('keyup', movePacman)

  ghostsTimer = setInterval(ghostMovement, 500)




//
//
//
//
})
