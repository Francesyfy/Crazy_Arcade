function Player(x, y, player, world) {
  // store the player position
  this.x = x
  this.y = y
  this.player = player

  // store a reference to our "world" object - we will ask the world to tell us about
  // tiles that are in our path
  this.world = world

  // set up a counter to keep track of states
  // 0: start; 1: walk; 2: die
  this.state = 0

  // set up holders for all of our walk cycle images
  this.leftCycle = []
  this.rightCycle = []
  this.upCycle = []
  this.downCycle = []

  // set up a counter to keep track of which image we are currently using
  this.currentImage = 0
  this.currentImageStart = 0
  this.currentImageDie = 0

  // variable to keep track of our current cycle
  this.currentCycle = this.downCycle

  // two players' keycodes
  if (this.player == "Boz") {
    this.keycodes = [[LEFT_ARROW], [RIGHT_ARROW], [DOWN_ARROW], [UP_ARROW]]
  }
  else if (this.player == "Lodumani") {
    this.keycodes = [[97, 65], [100, 68], [115, 83], [119, 87]]
  }


  // load in all of our walk cycle images
  for (var i = 0; i < 6; i++) {
    var filename = str(i) + ".png"
    this.downCycle.push( loadImage("characters/" + this.player + "/down/" + filename) )
    this.upCycle.push( loadImage("characters/" + this.player + "/up/" + filename) )
    this.leftCycle.push( loadImage("characters/" + this.player + "/left/" + filename) )
    this.rightCycle.push( loadImage("characters/" + this.player + "/right/" + filename) )
  }

  // set up and load start and die gif images
  this.startGif = []
  for (var i = 0; i < 10; i++) {
    var filename = str(i) + ".png"
    this.startGif.push( loadImage("characters/" + this.player + "/start/" + filename) )
  }

  this.dieGif = []
  for (var i = 0; i < 11; i++) {
    var filename = str(i) + ".png"
    this.dieGif.push( loadImage("characters/" + this.player + "/die/" + filename) )
  }

  // define our speed
  this.speed = 2

  // display our player
  this.display = function() {
    imageMode(CORNER)
    image(this.currentCycle[ this.currentImage ], this.x, this.y)
  }

  // set our sensor positions (computed based on the position of the character and the
  // size of our graphic)
  this.refreshSensors = function() {
    var h = this.currentCycle[ this.currentImage ].height
    var w = this.currentCycle[ this.currentImage ].width

    this.left1 = [this.x, this.y+h-30]
    this.left2 = [this.x, this.y+h-10]

    this.right1 = [this.x+w, this.y+h-30]
    this.right2 = [this.x+w, this.y+h-10]

    this.top1 = [this.x+10, this.y+h-40]
    this.top2 = [this.x+w-10, this.y+h-40]

    this.bottom1 = [this.x+10, this.y+h]
    this.bottom2 = [this.x+w-10, this.y+h]
  }

  // move our character
  this.move = function() {
    // refresh our "sensors" - these will be used for movement & collision detection
    this.refreshSensors()

    // see if one of our movement keys is down -- if so, we should try and move
    // note that this character responds to the following key combinations:
    // The four directional arrows
    for (var i = 0; i < this.keycodes[0].length; i++) {
      if (keyIsDown(this.keycodes[0][i])) {
        // see which tile is to our left
        var tile1 = world.getTile(this.left1[0], this.left1[1])
        var tile2 = world.getTile(this.left2[0], this.left2[1])
  
  
        // is this tile solid?
        if (!world.isTileSolid(tile1) && !world.isTileSolid(tile2)) {
          // move
          this.x -= this.speed
        }
  
        // change artwork
        this.currentCycle = this.leftCycle
      }
    }
    
    for (var i = 0; i < this.keycodes[1].length; i++) {
      if (keyIsDown(this.keycodes[1][i])) {
        // see which tile is to our right
        var tile1 = world.getTile(this.right1[0], this.right1[1])
        var tile2 = world.getTile(this.right2[0], this.right2[1])
  
        // is this tile solid?
        if (!world.isTileSolid(tile1) && !world.isTileSolid(tile2)) {
          // move
          this.x += this.speed
        }
  
        // change artwork
        this.currentCycle = this.rightCycle
      }
    }

    for (var i = 0; i < this.keycodes[2].length; i++) {
      if (keyIsDown(this.keycodes[2][i])) {
        // see which tile is below us
        var tile1 = world.getTile(this.bottom1[0], this.bottom1[1])
        var tile2 = world.getTile(this.bottom2[0], this.bottom2[1])

        // is this tile solid?
        if (!world.isTileSolid(tile1) && !world.isTileSolid(tile2)) {
          // move
          this.y += this.speed
        }

        // change artwork
        this.currentCycle = this.downCycle
      }
    }
    
    for (var i = 0; i < this.keycodes[3].length; i++) {
      if (keyIsDown(this.keycodes[3][i])) {
        // see which tile is above us
        var tile1 = world.getTile(this.top1[0], this.top1[1])
        var tile2 = world.getTile(this.top2[0], this.top2[1])
  
        // is this tile solid?
        if (!world.isTileSolid(tile1) && !world.isTileSolid(tile2)) {
          // move
          this.y -= this.speed
        }
  
        // change artwork
        this.currentCycle = this.upCycle
      }
    }
    

    // increase current image to go to the next cycle image if a key is down
    // only do this every few frames since we don't want this to run too fast!
    for (var i = 0; i < this.keycodes.length; i++) {
      for (var j = 0; j < this.keycodes[i].length; j++) {
        if (keyIsDown(this.keycodes[i][j]) && frameCount % 10 == 0) {
          this.currentImage += 1
        }
      }
    }

    // cycle around to the beginning of the walk cycle, if necessary
    if (this.currentImage >= 6) {
      this.currentImage = 0
    }

  }

  this.startDisplay = function() {
    if (this.currentImageStart <= 9) {
      imageMode(CORNER)
      image(this.startGif[ this.currentImageStart ], this.x, this.y)

      if (frameCount % 10 == 0) {
        // move onto next frame
        this.currentImageStart += 1
      }
    } else {

      //go over all images in start state, move onto next state
      this.state = 1
      this.currentImageStart = 0
    }
  }

  this.dieDisplay = function() {
    if (this.currentImageDie <= 10) {
      imageMode(CORNER)
      image(this.dieGif[ this.currentImageDie ], this.x, this.y)

      if (frameCount % 10 == 0) {
        // move onto next frame
        this.currentImageDie += 1
      }
    } else {

      //go over all images in die state, move onto next state
      this.state = 3
      this.currentImageDie = 0
    }
  }
}
