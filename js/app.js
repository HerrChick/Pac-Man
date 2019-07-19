document.addEventListener('DOMContentLoaded', () => {

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



  const gameBoard = []
  const gridWidth = 18
  const grid = document.querySelector('.grid')
  const statusBoard = document.querySelector('.status')
  let isPlaying = false
  let pelletcount = 0


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

  const pacman = {x: 8, y: 4, direction: '', phase: 'normal'}
  // let pacmanPosition = (gameBoard[pacman.y][pacman.x])
  let score = 0
  let lives = 3

  const blinky = {x: 5, y: 6, eaten: false}
  const pinky = {x: 12, y: 6, eaten: false}
  const inky = {x: 5, y: 11, eaten: false}
  const clyde = {x: 12, y: 11, eaten: false}
  const ghosts = [blinky, pinky, inky, clyde]
  const ghostPrevPositionx = [blinky, pinky, inky, clyde]
  const ghostPrevPositiony = [blinky, pinky, inky, clyde]
  let ghostsTimer = null
  let collisionTimer = null

  function startingPositions(){
    pacman.x = 8
    pacman.y = 4
    ghosts[0].x = 5
    ghosts[0].y = 6
    ghosts[0].eaten = false
    ghosts[1].x= 12
    ghosts[1].y = 6
    ghosts[1].eaten = false
    ghosts[2].x = 5
    ghosts[2].y = 11
    ghosts[2].eaten = false
    ghosts[3].x = 12
    ghosts[3].y = 11
    ghosts[3].eaten = false
  }

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

  function ghostMovement(){
    for(let ghost = 0; ghost<ghosts.length; ghost++){


      // array containing ghost movement, left, right, up, down
      const collisionMovementLogicy = [
        ghosts[ghost].y,
        ghosts[ghost].y,
        ghosts[ghost].y - 1,
        ghosts[ghost].y + 1
      ]

      const collisionMovementLogicx = [
        ghosts[ghost].x - 1,
        ghosts[ghost].x + 1,
        ghosts[ghost].x,
        ghosts[ghost].x
      ]

      const ghostNextMove = []

      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('run')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('ghost')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('eyes')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('blinky')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('pinky')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('inky')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('clyde')

      if(ghosts[ghost].eaten === false){
        if(pacman.phase === 'normal'){

          for (let i = 0; i < collisionMovementLogicy.length; i++){

            if(ghost === 0){
              if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('wall') || (collisionMovementLogicy[i] === ghostPrevPositiony[ghost] && collisionMovementLogicx[i] === ghostPrevPositionx[ghost])) {
                ghostNextMove.push(Infinity)
              } else if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('tile')){
                ghostNextMove.push(getDyDx(collisionMovementLogicy[i],collisionMovementLogicx[i], pacman.y, pacman.x))
              }
            }else if(ghost === 1){
              if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('wall') || (collisionMovementLogicy[i] === ghostPrevPositiony[ghost] && collisionMovementLogicx[i] === ghostPrevPositionx[ghost])) {
                ghostNextMove.push(Infinity)
              } else if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('tile')){
                ghostNextMove.push(getDyDx(collisionMovementLogicy[i],collisionMovementLogicx[i], pacman.y - 2, pacman.x - 2))
              }
            }else if(ghost === 2){
              if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('wall') || (collisionMovementLogicy[i] === ghostPrevPositiony[ghost] && collisionMovementLogicx[i] === ghostPrevPositionx[ghost])) {
                ghostNextMove.push(Infinity)
              } else if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('tile')){
                ghostNextMove.push(getDyDx(collisionMovementLogicy[i],collisionMovementLogicx[i], pacman.y + 5, pacman.x + 2))
              }
            }else if(ghost === 3){
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


          if(ghost === 0){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('blinky')
          }else if(ghost === 1){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('pinky')
          }else if(ghost === 2){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('inky')
          }else if(ghost === 3){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('clyde')
          }

        }

        if(pacman.phase === 'hunt'){

          for (let i = 0; i < collisionMovementLogicy.length; i++){


            if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('wall') || (collisionMovementLogicy[i] === ghostPrevPositiony[ghost] && collisionMovementLogicx[i] === ghostPrevPositionx[ghost])) {
              ghostNextMove.push(0)
            } else if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('tile')){
              ghostNextMove.push(getDyDx(collisionMovementLogicy[i],collisionMovementLogicx[i], pacman.y, pacman.x))
            }

          }
          ghostPrevPositiony[ghost] = ghosts[ghost].y
          ghostPrevPositionx[ghost] = ghosts[ghost].x
          const shortest = ghostNextMove.reduce((a, b) => Math.max(a, b))
          ghosts[ghost].x = collisionMovementLogicx[ghostNextMove.indexOf(shortest)]
          ghosts[ghost].y = collisionMovementLogicy[ghostNextMove.indexOf(shortest)]

          gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('run')
          if(ghost === 0){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('blinky')
          }else if(ghost === 1){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('pinky')
          }else if(ghost === 2){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('inky')
          }else if(ghost === 3){
            gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('clyde')
          }

        }
      }
      if(ghosts[ghost].eaten === true){

        for (let i = 0; i < collisionMovementLogicy.length; i++){


          if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('wall') || (collisionMovementLogicy[i] === ghostPrevPositiony[ghost] && collisionMovementLogicx[i] === ghostPrevPositionx[ghost])) {
            ghostNextMove.push(Infinity)
          } else if(gameBoard[collisionMovementLogicy[i]][collisionMovementLogicx[i]].classList.contains('tile')){
            ghostNextMove.push(getDyDx(collisionMovementLogicy[i],collisionMovementLogicx[i], 6, 8))
          }

        }
        ghostPrevPositiony[ghost] = ghosts[ghost].y
        ghostPrevPositionx[ghost] = ghosts[ghost].x
        const shortest = ghostNextMove.reduce((a, b) => Math.min(a, b))
        ghosts[ghost].x = collisionMovementLogicx[ghostNextMove.indexOf(shortest)]
        ghosts[ghost].y = collisionMovementLogicy[ghostNextMove.indexOf(shortest)]
        gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.add('eyes')

        if(gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.contains('home')){
          ghosts[ghost].eaten = false
        }

      }
    }
  }

  function setHunt(){
    pacman.phase = 'normal'
  }


  // function that moves pacman with respect to keypresses. also includes collision.
  function movePacman(e) {
    if(!isPlaying) return false

    gameBoard[pacman.y][pacman.x].classList.remove('pacmanleft')
    gameBoard[pacman.y][pacman.x].classList.remove('pacmanright')
    gameBoard[pacman.y][pacman.x].classList.remove('pacmanup')
    gameBoard[pacman.y][pacman.x].classList.remove('pacmandown')

    switch(e.keyCode) {
      // moving left
      case 37:
        if (gameBoard[pacman.y][pacman.x - 1].classList.contains('wall')) pacman.x += 0
        else{
          pacman.x -= 1
          pacman.direction = 'left'
        }
        break
        // moving up
      case 38:
        if (gameBoard[pacman.y - 1][pacman.x].classList.contains('wall')) pacman.y += 0
        else{
          pacman.y -= 1
          pacman.direction = 'up'
        }
        break
        // moving right
      case 39:
        if (gameBoard[pacman.y][pacman.x + 1].classList.contains('wall')) pacman.x += 0
        else{
          pacman.x += 1
          pacman.direction = 'right'
        }
        break
        // moving down
      case 40:
        if (gameBoard[pacman.y + 1][pacman.x].classList.contains('wall')) pacman.y += 0
        else{
          pacman.y += 1
          pacman.direction = 'down'
        }
        break

    }

    if(gameBoard[pacman.y][pacman.x].classList.contains('pellet')) {
      gameBoard[pacman.y][pacman.x].classList.remove('pellet')
      score += 100
      document.querySelector('.score').innerText = score
    }


    if(gameBoard[pacman.y][pacman.x].classList.contains('powerup')) {
      gameBoard[pacman.y][pacman.x].classList.remove('powerup')
      pacman.phase = 'hunt'

      setTimeout(setHunt, 7000)
    }

    if(pacman.direction === 'left'){
      gameBoard[pacman.y][pacman.x].classList.add('pacmanleft')
    }else if(pacman.direction === 'right'){
      gameBoard[pacman.y][pacman.x].classList.add('pacmanright')
    }else if(pacman.direction === 'up'){
      gameBoard[pacman.y][pacman.x].classList.add('pacmanup')
    }else if(pacman.direction === 'down'){
      gameBoard[pacman.y][pacman.x].classList.add('pacmandown')
    }


  }

  function collision(){

    if(pacman.phase === 'normal'){
      if(['blinky', 'pinky', 'inky', 'clyde'].some(className => {
        return gameBoard[pacman.y][pacman.x].classList.contains(className)
      })) {
        pacman.phase = 'dead'
      }
    }

    if(pacman.phase === 'dead'){
      lives --
      document.querySelector('.lives').innerText = 'Lives:' + lives
      clearInterval(ghostsTimer)
      clearInterval(collisionTimer)
      removeClasses()
      startingPositions()
      isPlaying = false
    }

    if(lives === 0){
      document.querySelector('.nextlevel').innerText = 'GAME OVER... PRESS START'
    }

    if(pacman.phase === 'hunt'){
      if(['blinky', 'run'].every(className => {
        return gameBoard[pacman.y][pacman.x].classList.contains(className)
      })) {
        ghosts[0].eaten = true
      }

      if(['pinky', 'run'].every(className => {
        return gameBoard[pacman.y][pacman.x].classList.contains(className)
      })) {
        ghosts[1].eaten = true
      }

      if(['inky', 'run'].every(className => {
        return gameBoard[pacman.y][pacman.x].classList.contains(className)
      })) {
        ghosts[2].eaten = true
      }

      if(['clyde', 'run'].every(className => {
        return gameBoard[pacman.y][pacman.x].classList.contains(className)
      })) {
        ghosts[3].eaten = true
      }
    }

    playerWon()

    if(pelletcount < 1){
      clearInterval(ghostsTimer)
      clearInterval(collisionTimer)
      removeClasses()
      startingPositions()
      isPlaying = false
      document.querySelector('.nextlevel').innerText = 'LEVEL COMPLETE. CONTINUE?'

    }
  }



  function removeClasses(){
    for(let ghost = 0; ghost<ghosts.length; ghost++){
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('run')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('ghost')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('eyes')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('blinky')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('pinky')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('inky')
      gameBoard[ghosts[ghost].y][ghosts[ghost].x].classList.remove('clyde')
      gameBoard[pacman.y][pacman.x].classList.remove('pacmanleft')
      gameBoard[pacman.y][pacman.x].classList.remove('pacmanright')
      gameBoard[pacman.y][pacman.x].classList.remove('pacmanup')
      gameBoard[pacman.y][pacman.x].classList.remove('pacmandown')
    }
  }


  function playerWon(){
    pelletcount = 0
    for (let x= 0; x < gameBoard.length; x++){
      const divRow = gameBoard[x]
      for (let y = 0; y < divRow.length; y++){
        if(divRow[y].classList.contains('pellet')){
          pelletcount ++
          console.log(pelletcount)
        }
      }
    }
  }

  function drawBoard(){
    generateDivs()
    drawGameBoard()
  }

  drawBoard()

  function startGame(){
    if(lives === 0){
      lives = 3
      score = 0
      document.querySelector('.lives').innerText = 'Lives:' + lives
      document.querySelector('.score').innerText = score
    }
    pacman.phase = 'normal'
    drawGameBoard()
    gameBoard[pacman.y][pacman.x].classList.add('pacmanleft')
    gameBoard[ghosts[0].y][ghosts[0].x].classList.add('blinky')
    gameBoard[ghosts[1].y][ghosts[1].x].classList.add('pinky')
    gameBoard[ghosts[2].y][ghosts[2].x].classList.add('inky')
    gameBoard[ghosts[3].y][ghosts[3].x].classList.add('clyde')
    isPlaying = true
    ghostsTimer = setInterval(ghostMovement, 400)
    collisionTimer = setInterval(collision, 60)
  }

  const startbutton = document.querySelector('.startbutton')
  startbutton.addEventListener('click', startGame)

  document.querySelector('.nextlevel').innerText = ''

  document.querySelector('.nextlevel').addEventListener('click', startGame)

  document.addEventListener('keyup', movePacman)








})
