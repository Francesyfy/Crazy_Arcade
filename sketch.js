// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld

// three different map modes
var mapTown
var mapDesert
var mapUnderwater

// handle the tile loading and creating our player object in preload before the game can start
function preload() {
  mapTown = new Map('town')
  mapDesert = new Map('desert')
  mapUnderwater = new Map('underwater')
  // test code
  theWorld = new OverheadWorld(mapTown)
  thePlayer1 = new Player1(0, 0, theWorld)
  thePlayer2 = new Player2(700, 580, theWorld)
}

function setup() {
  createCanvas(750,650)
}

function draw() {
  theWorld.displayGround()
  theWorld.displayBlocks()

  // player1: Boz
  // click mouse, the character dies or reborns
  if (mouseIsPressed) {
    if (thePlayer1.state == 1)
    thePlayer1.state = 2
    else if (thePlayer1.state == 3)
    thePlayer1.state = 0
  }

  // three states 0, 1, 2: start, walk, die
  if (thePlayer1.state == 0) {
    thePlayer1.startDisplay()
  }
  else if (thePlayer1.state == 1) {
    thePlayer1.move()
    thePlayer1.display()
  } 
  else if (thePlayer1.state == 2) {
    thePlayer1.dieDisplay()
  }


  // player2: Lodumani
  // click mouse, the character dies or reborns
  if (mouseIsPressed) {
    if (thePlayer2.state == 1)
    thePlayer2.state = 2
    else if (thePlayer2.state == 3)
    thePlayer2.state = 0
  }

  // three states 0, 1, 2: start, walk, die
  if (thePlayer2.state == 0) {
    thePlayer2.startDisplay()
  }
  else if (thePlayer2.state == 1) {
    thePlayer2.move()
    thePlayer2.display()
  } 
  else if (thePlayer2.state == 2) {
    thePlayer2.dieDisplay()
  }
}

/* 
  class Map
  hold our "world parameters"
  we will send this object into our OverheadWorld to tell it how our world is organized
  has three modes: town, dessert, underwater
  each mode has it own tile arrangements
*/
class Map {
  constructor(map){
    this.map = map
    this.tileSize = 50
    this.tileFolder = 'tiles'
    this.numTiles = 4
    this.solidTiles = {1:true, 2:true, 3:true}
    if (this.map == 'town'){
      this.tileMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 3, 1, 2, 1, 2, 1, 3, 1, 2, 2, 0, 0],
        [0, 1, 1, 2, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 0],
        [0, 1, 0, 2, 0, 3, 0, 3, 0, 1, 0, 3, 0, 1, 0],
        [0, 2, 1, 3, 1, 2, 1, 2, 1, 3, 1, 2, 2, 1, 0],
        [0, 3, 0, 3, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0],
        [0, 2, 3, 1, 2, 2, 1, 2, 1, 3, 1, 3, 2, 1, 0],
        [0, 2, 0, 2, 0, 3, 0, 2, 0, 2, 0, 1, 0, 2, 0],
        [0, 3, 3, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 0],
        [0, 1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 3, 0, 1, 0],
        [0, 1, 1, 1, 2, 3, 1, 3, 1, 2, 3, 2, 1, 1, 0],
        [0, 0, 2, 2, 0, 3, 0, 2, 0, 2, 0, 1, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
    }
    else if (this.map == 'desert'){
      this.tileMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 3, 1, 2, 1, 2, 1, 3, 1, 2, 2, 0, 0],
        [0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 0],
        [0, 1, 0, 2, 1, 3, 0, 3, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 3, 2, 1, 3, 1, 1, 1, 1, 2, 3, 2, 0],
        [0, 1, 0, 3, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0],
        [0, 2, 1, 2, 1, 3, 1, 1, 3, 2, 1, 3, 1, 1, 0],
        [0, 3, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0],
        [0, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 3, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 3, 0, 1, 0, 1, 0],
        [0, 1, 1, 2, 1, 2, 1, 3, 1, 2, 1, 3, 1, 1, 0],
        [0, 0, 2, 2, 0, 3, 0, 2, 0, 2, 0, 1, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
    }
    else if (this.map == 'underwater'){
      this.tileMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 3, 1, 2, 1, 2, 1, 3, 1, 2, 2, 0, 0],
        [0, 1, 2, 1, 2, 1, 1, 3, 1, 2, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3, 0, 1, 0],
        [0, 1, 3, 1, 2, 1, 3, 2, 1, 1, 1, 2, 1, 2, 0],
        [0, 2, 0, 2, 0, 3, 0, 3, 0, 1, 0, 2, 0, 1, 0],
        [0, 1, 3, 1, 2, 1, 3, 1, 1, 1, 2, 1, 3, 1, 0],
        [0, 1, 0, 3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0],
        [0, 2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 3, 3, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0],
        [0, 1, 1, 3, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 0],
        [0, 0, 2, 2, 0, 3, 0, 2, 0, 2, 0, 1, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
    }
  }
}