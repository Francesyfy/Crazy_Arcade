// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld

// three different map modes
var mapTown
var mapDesert
var mapUnderwater

// two players
var players = []

// handle the tile loading and creating our player object in preload before the game can start
function preload() {
  mapTown = new Map('town')
  mapDesert = new Map('desert')
  mapUnderwater = new Map('underwater')
  // test code
  theWorld = new OverheadWorld(mapTown)

  players.push(new Player(0, 0, "Boz", theWorld))
  players.push(new Player(700, 580, "Lodumani", theWorld))
}

function setup() {
  createCanvas(750,650)
}

function draw() {
  theWorld.displayGround()
  //theWorld.displayBlocks()

  var ors = theWorld.occupiedRows()
  //console.log(ors)
  // first and last row that is occupied
  var fOR = ors[0]
  var lOR = ors[ors.length-1]
  // display the first parts
  if (fOR != 0){
    theWorld.displayBlocksByRows(0, fOR)
  }
  // display the middle parts
  for (var i = 0; i < ors.length - 1; i++){
    // display the objects first
    objs = theWorld.rows[i].objects
    for (var j = 0; j < objs.length; i++){
      objs[j].display()
    }
    // display the rows between i and i+1
    theWorld.displayBlocksByRows(ors[i],ors[i+1])
  }
  // display the objects on the last occupied row
  var lastObjs = theWorld.rows[lOR].objects
  for (var i = 0; i < lastObjs.length; i++){
    lastObjs[i].display()
  }
  // display the last parts after the last occupied row
  if (lOR != theWorld.length-1){
    theWorld.displayBlocksByRows(lOR, theWorld.length)
  }



  for (var i = 0; i < 2; i++) {
    // click mouse, the character dies or reborns
    if (mouseIsPressed) {
      if (players[i].state == 1)
      players[i].state = 2
      else if (players[i].state == 3)
      players[i].state = 0
    }

    // three states 0, 1, 2: start, walk, die
    if (players[i].state == 0) {
      players[i].startDisplay()
    }
    else if (players[i].state == 1) {
      players[i].move()
      players[i].display()
    } 
    else if (players[i].state == 2) {
      players[i].dieDisplay()
    }
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