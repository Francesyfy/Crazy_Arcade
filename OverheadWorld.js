function OverheadWorld(params) {

  // store our desired tile size
  this.tileSize = params.tileSize
  
  // store our tile map
  this.tileMap = params.tileMap

  // store the life map to record the hit points of each block
  this.lifeMap = params.lifeMap

  // store the bubble map to track if a tile is occupied by a bubble
  this.bubbleMap = generateZeros(params.tileMap)

  // # of rows & cols of the tile map
  this.length = params.tileMap.length
  this.width = params.tileMap[0].length

  // store the rows of the tile map
  // each element stores the info whether it is occupied
  // and the characters & bubbles that are on the row
  this.rows = Array(this.length)
  for (var i = 0; i < this.rows.length; i++){
    this.rows[i] = {
      occupied: 0,
      players: [],
      bubbles: []
    }
  }

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

  // displayBlocks: displays the blocks above ground
  // loads all tiles except the ground
  // the height of the tile is 1.4 times its width 
  this.displayBlocks = function() {
    for (var row = 0; row < this.tileMap.length; row += 1) {
      this.displayBlocksByRow(row)
    }
  }

  // displayBlocksByRows: displays the blocks with indices [start, end)
  this.displayBlocksByRows = function(start, end){
    for (var row = start; row < end; row++) {
      this.displayBlocksByRow(row)
    }
  }

  // displayBlocksByRow: displays the blocks on a single row
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

  // occupiedRows: record all the rows that are occupied
  this.occupiedRows = function() {
    var or = []
    for (var i = 0; i < this.rows.length; i++){
      if (this.rows[i].occupied == 1){
        or.push(i)
      }
    }
    return or
  }

  // refreshTileMap: check to see if any block is blown up
  // if so, change the corresponding position on the tileMap to 0
  // so that it won't display
  this.refreshTileMap = function() {
    for (var i = 0; i < this.tileMap.length; i++) {
      for (var j = 0; j < this.tileMap[0].length; j++){
        // the bricks cannot be blown up
        if (this.lifeMap[i][j] <= 0){
          // the gift boxes have a chance to give props
          if (this.tileMap[i][j] == 2){
            var r = random(0,1)
            if (r < 0.1){
              this.tileMap[i][j] = 4
            }
            else if (r < 0.2){
              this.tileMap[i][j] = 5
            }
            else{
              this.tileMap[i][j] = 0
            }
          }
          else if (this.tileMap[i][j] == 1){
            this.tileMap[i][j] = 0
          } 
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