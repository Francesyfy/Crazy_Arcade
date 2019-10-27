// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld

// three different map modes
var mapTown
var mapDesert
var mapUnderwater

// two players
var players = []

// bubble
var bubbles = []
var bubbleGraphics = []
var expBubbleGraphics = []
let expBubbleGraphicsLeft = [];
let expBubbleGraphicsRight = [];
let expBubbleGraphicsUp = [];
let expBubbleGraphicsDown = [];

// handle the tile loading and creating our player object in preload before the game can start
function preload() {
  mapTown = new Map('town')
  mapDesert = new Map('desert')
  mapUnderwater = new Map('underwater')

  theWorld = new OverheadWorld(mapTown)

  // players
  // Boz: awsd - move; r - bubble
  // Lodumani: jikl - move; p - bubble
  players.push(new Player(0, 0, "Boz", theWorld))
  players.push(new Player(700, 580, "Lodumani", theWorld))


  // bubble
  for (let i = 1; i <= 3; i++) {
    let filename = "bubble" + nf(i, 2) + ".png";
    bubbleGraphics.push(loadImage("bubble/bounce/" + filename));
  }

  for (let i = 1; i <= 4; i++) {
    let filename = str(i) + ".png";
    expBubbleGraphics.push(loadImage("bubble/explode/center/" + filename));
  }

  for (let i = 0; i <= 13; i++) {
    let filename = i + ".png";
    expBubbleGraphicsLeft.push(loadImage("bubble/explode/left/" + filename));
  }

  for (let i = 0; i <= 13; i++) {
    let filename = i + ".png";
    expBubbleGraphicsRight.push(loadImage("bubble/explode/right/" + filename));
  }

  for (let i = 0; i <= 13; i++) {
    let filename = i + ".png";
    expBubbleGraphicsUp.push(loadImage("bubble/explode/up/" + filename));
  }

  for (let i = 0; i <= 13; i++) {
    let filename = i + ".png";
    expBubbleGraphicsDown.push(loadImage("bubble/explode/down/" + filename));
  }
}

function setup() {
  createCanvas(750, 650)
}

function draw() {
  theWorld.displayGround()
  theWorld.refreshTileMap()

  for (var i = 0; i < 2; i++) {
    // click mouse, the character dies or reborns
    if (mouseIsPressed) {
      if (players[i].state == 1)
        players[i].state = 2
      else if (players[i].state == 3)
        players[i].state = 0
    }

    //update occupied rows
    var r = players[i].row()
    theWorld.rows[r].occupied = 1
    theWorld.rows[r].players.push(players[i])
  }

  for (var i = 0; i < bubbles.length; i++) {
    if (bubbles[i].currentFrame_expBubble_surrounding >= 12) {
      bubbles.splice(i, 1);
    }
  }

  for (var i = 0; i < bubbles.length; i++) {
    //update occupied rows
    var r = bubbles[i].row
    theWorld.rows[r].occupied = 1
    theWorld.rows[r].bubbles.push(bubbles[i])
  }


  var ors = theWorld.occupiedRows()
  // console.log(ors)
  // console.log(theWorld.rows)

  // first and last row that is occupied
  var fOR = ors[0]
  var lOR = ors[ors.length - 1]

  // display the first parts
  if (fOR != 0) {
    theWorld.displayBlocksByRows(0, fOR)
  }

  // display the middle parts
  for (var i = 0; i < ors.length - 1; i++) {
    // display the objects first
    var p = theWorld.rows[ors[i]].players
    var b = theWorld.rows[ors[i]].bubbles

    if (p.length > 0) {
      for (var j = 0; j < p.length; j++) {
        if (p[j].state == 0) {
          p[j].startDisplay()
        }
        else if (p[j].state == 1) {
          p[j].move()
          p[j].display()
        }
        else if (p[j].state == 2) {
          p[j].dieDisplay()
        }
      }
    }

    if (b.length > 0) {
      for (var j = 0; j < b.length; j++) {
        b[j].display()
      }
    }
    

    // display the rows between i and i+1
    theWorld.displayBlocksByRows(ors[i], ors[i + 1])
  }

  // display the objects on the last occupied row
  var lastP = theWorld.rows[lOR].players
  var lastB = theWorld.rows[lOR].bubbles
  if (lastP.length > 0) {
    for (var i = 0; i < lastP.length; i++) {
      if (lastP[i].state == 0) {
        lastP[i].startDisplay()
      }
      else if (lastP[i].state == 1) {
        lastP[i].move()
        lastP[i].display()
      }
      else if (lastP[i].state == 2) {
        lastP[i].dieDisplay()
      }
    }
  }

  if (lastB.length > 0) {
    for (var i = 0; i < lastB.length; i++) {
      lastB[i].display()
    }
  }


  // display the last parts after the last occupied row
  if (lOR != theWorld.length - 1) {
    theWorld.displayBlocksByRows(lOR, theWorld.length)
  }


  for (var i = 0; i < theWorld.rows.length; i++) {
    theWorld.rows[i] = {
      occupied: 0,
      players: [],
      bubbles: []
    }
  }

  // character dies
  for(var i = 0; i < players.length; i++){
    if (players[i].lives <= 0){
      players[i].dieDisplay()
    }
  }
}

function keyPressed() {
  if (key == 'r' || key == "R") {
    bubbles.push(new Bubble(players[0].row(), players[0].col(), theWorld))
    theWorld.bubbleMap[players[0].row()][players[0].col()] = 1
  }
  if (key == 'p' || key == "P") {
    bubbles.push(new Bubble(players[1].row(), players[1].col(), theWorld))
    theWorld.bubbleMap[players[1].row()][players[1].col()] = 1
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
  constructor(map) {
    this.map = map
    this.tileSize = 50
    this.tileFolder = 'tiles'
    this.numTiles = 4
    this.solidTiles = { 1: true, 2: true, 3: true }
    if (this.map == 'town') {
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
      this.lifeMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 60, 180, 60, 120, 60, 120, 60, 180, 60, 120, 120, 0, 0],
        [0, 60, 60, 120, 180, 120, 60, 60, 120, 180, 60, 120, 60, 60, 0],
        [0, 60, 0, 120, 0, 180, 0, 180, 0, 60, 0, 180, 0, 60, 0],
        [0, 120, 60, 180, 60, 120, 60, 120, 60, 180, 60, 120, 120, 60, 0],
        [0, 180, 0, 180, 0, 60, 0, 60, 0, 120, 0, 60, 0, 120, 0],
        [0, 120, 180, 60, 120, 120, 60, 120, 60, 180, 60, 180, 120, 60, 0],
        [0, 120, 0, 120, 0, 180, 0, 120, 0, 120, 0, 60, 0, 120, 0],
        [0, 180, 180, 60, 180, 60, 120, 180, 60, 120, 60, 180, 120, 60, 0],
        [0, 60, 0, 60, 0, 120, 0, 60, 0, 60, 0, 180, 0, 60, 0],
        [0, 60, 60, 60, 120, 180, 60, 180, 60, 120, 180, 120, 60, 60, 0],
        [0, 0, 120, 120, 0, 180, 0, 120, 0, 120, 0, 60, 120, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
    }
    else if (this.map == 'desert') {
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
      this.lifeMap = [
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
    else if (this.map == 'underwater') {
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
      this.lifeMap = [
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