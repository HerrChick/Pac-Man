document.addEventListener('DOMContentLoaded', () => {

  const gridWidth = 18
  const grid = document.querySelector('.grid')
  let pacmanPosition = 18
  let ghostPosition = 84













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

  function drawGameBoard(){
    for (let i = 0; i < gameBoard.length; i++)

      if(gameBoard[i] === 1){
        grid.innerHTML += '<div class= \'tile wall\'></div>'

      } else if (gameBoard[i] === 0){
        grid.innerHTML += '<div class= \'tile\'></div>'
      }else if (gameBoard[i] === 2){
        grid.innerHTML += '<div class= \'tile pellet\'></div>'
      }else if(gameBoard[i] === 3){
        grid.innerHTML += '<div class= \'tile powerup\'></div>'
      }

  }





  function movePacman(e) {

    grid.children[pacmanPosition].classList.remove('pacman')

    switch(e.keyCode) {
      // moving left
      case 37:
        if (grid.children[pacmanPosition - 1].classList.contains('wall')) pacmanPosition += 0
        else if (pacmanPosition % gridWidth !== 0) pacmanPosition -= 1
        break
        // moving up
      case 38:
        if (grid.children[pacmanPosition - gridWidth].classList.contains('wall')) pacmanPosition += 0
        else if(pacmanPosition - gridWidth >= 0) pacmanPosition -= gridWidth
        break
        // moving right
      case 39:
        if (grid.children[pacmanPosition + 1].classList.contains('wall')) pacmanPosition += 0
        else if(pacmanPosition % gridWidth < gridWidth - 1) pacmanPosition += 1
        break
        // moving down
      case 40:
        if (grid.children[pacmanPosition + gridWidth].classList.contains('wall')) pacmanPosition += 0
        else if(pacmanPosition + gridWidth < gridWidth * gridWidth) pacmanPosition += gridWidth
        break
    }

    if(grid.children[pacmanPosition].classList.contains('pellet')) {
      grid.children[pacmanPosition].classList.remove('pellet')
    }
    grid.children[pacmanPosition].classList.add('pacman')
  }

  function ghostCollision(){

    const wallLeft = grid.children[ghostPosition - 1].classList.contains('wall')
    const wallAbove = grid.children[ghostPosition - gridWidth].classList.contains('wall')
    const wallBelow = grid.children[ghostPosition + gridWidth].classList.contains('wall')
    const wallRight = grid.children[ghostPosition + 1].classList.contains('wall')

    const collisionMovementLogic =
    // array containing ghost movement, left, right, up, down
      [(ghostPosition - 1), (ghostPosition + 1), (ghostPosition - gridWidth), (ghostPosition - gridWidth)]

    grid.children[ghostPosition].classList.remove('ghost')
// chooses directions to prevent ghosts being stuck in walls
    if (wallAbove || wallBelow ){
      ghostPosition = collisionMovementLogic[Math.round(Math.random())]
    }else if (wallLeft && wallBelow){
      ghostPosition = collisionMovementLogic[Math.round(Math.random())+1]
    }else if (wallAbove && wallRight){
      ghostPosition = collisionMovementLogic[
    }else if (wallAbove && wallLeft){
  }






    grid.children[ghostPosition].classList.add('ghost')



  }




  drawGameBoard()



  document.addEventListener('keyup', movePacman)
  setInterval(ghostCollision, 1000)







})
