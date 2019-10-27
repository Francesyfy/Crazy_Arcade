function OverheadWorld(params) {

  // store our desired tile size
  this.tileSize = params.tileSize
  
  // store our tile map
  this.tileMap = params.tileMap

  this.lifeMap = params.lifeMap

  // store the bomb map to track if a tile is bombed
  this.bubbleMap = generateZeros(params.tileMap)

  this.length = params.tileMap.length
  this.width = params.tileMap[0].length

  // use an array to store the rows of the characters & bubbles
  this.rows = Array(this.length)
  for (var i = 0; i < this.rows.length; i++){
    this.rows[i] = {
      occupied: 0,
      players: [],
      bubbles: []
    }
  }
  // this.rows[2].occupied = 1

  // store the folder in which all of our tiles are stored
  this.tileFolder = params.tileFolder + "/" + params.map
  
  // store how many tiles we are working with
  this.numTiles = params.numTiles
  
  // store an object that defines which tiles are solid
  this.solidTiles = params.solidTiles

  // an array to hold all tile graphics
  this.tileLibrary = [];

  // load in all tile graphics
  for (var i = 0; i < this.numTiles; i++) {
    var tempTile = loadImage(this.tileFolder + "/" + i + ".png");
    this.tileLibrary.push(tempTile);
  }

  // displayTile: draws a single tile at a specified location
  this.displayTile = function(id, x, y) {
    image(this.tileLibrary[id], x, y);
  }

  // displayGround: displays the ground
  // each ground tile takes four times the area of a single tile
  this.displayGround = function() {
    for (var row = 0; row < this.tileMap.length / 2; row += 1) {
      for (var col = 0; col < this.tileMap[row].length / 2; col += 1) {
        image(this.tileLibrary[0], col*this.tileSize * 2, row*this.tileSize * 2, this.tileSize * 2, 100);
      }
    }
  }

  // displayWorld: displays the blocks above ground
  // loads all tiles except the ground
  // the height of the tile is 1.4 times its width 
  this.displayBlocks = function() {
    for (var row = 0; row < this.tileMap.length; row += 1) {
      this.displayBlocksByRow(row)
    }
  }

  this.displayBlocksByRows = function(start, end){
    for (var row = start; row < end; row++) {
      this.displayBlocksByRow(row)
    }
  }

  this.displayBlocksByRow = function(row) {
    for (var col = 0; col < this.tileMap[row].length; col += 1) {
      if (this.tileMap[row][col] != 0){
        image(this.tileLibrary[ this.tileMap[row][col] ], col*this.tileSize, (row - 0.4)*this.tileSize, this.tileSize, this.tileSize*1.4);
      }
    }
  }

  // get a tile based on a screen x,y position
  this.getTile = function(x, y) {
    // convert the x & y position into a grid position
    var col = Math.floor(x/this.tileSize);
    var row = Math.floor(y/this.tileSize);
    
    // if the computed position is not in the array we can send back a -1 value
    if (row < 0 || row >= this.tileMap.length || col < 0 || col >= this.tileMap[row].length) {
      return -1;
    }

    // get the tile from our map
    return this.tileMap[row][col];
  }
  
  // see if this tile is solid
  this.isTileSolid = function(id) {
    if (id in this.solidTiles || id == -1) {
      return true;
    }
    
    // otherwise return false
    return false;
  }

  this.occupiedRows = function() {
    var or = []
    for (var i = 0; i < this.rows.length; i++){
      if (this.rows[i].occupied == 1){
        or.push(i)
      }
    }
    return or
  }

  this.refreshTileMap = function() {
    for (var i = 0; i < this.tileMap.length; i++) {
      for (var j = 0; j < this.tileMap[0].length; j++){
        if (this.lifeMap[i][j] <= 0 && this.tileMap[i][j] != 2){
          this.tileMap[i][j] = 0
        }
      }
    }
  }
}

// generateBombMap: generate a map
// to track if the tiles are bombed
// later in the game
function generateZeros (tileMap) {
  var row = tileMap.length
  var col = tileMap[0].length    
  var map = Array(row)
  for(var i = 0; i < row; i++){
    map[i] = Array(col).fill(0)
  }
  return map
}

class rowTrack {
  constructor(occupied, character){
    this.occupied = occupied
    this.character = character
  }
  
}