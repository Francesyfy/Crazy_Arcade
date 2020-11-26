function PlayerAnimation(name) {

    // Boz or Lodumani
    this.name = name

    // set up holders for all of our walk cycle images
    this.leftCycle = []
    this.rightCycle = []
    this.upCycle = []
    this.downCycle = []

    // load in all of our walk cycle images
    for (var i = 0; i < 6; i++) {
        var filename = str(i) + ".png"
        this.downCycle.push(loadImage("characters/" + this.name + "/down/" + filename))
        this.upCycle.push(loadImage("characters/" + this.name + "/up/" + filename))
        this.leftCycle.push(loadImage("characters/" + this.name + "/left/" + filename))
        this.rightCycle.push(loadImage("characters/" + this.name + "/right/" + filename))
    }

    // set up and load start and die gif images
    this.startGif = []
    for (var i = 0; i < 10; i++) {
        var filename = str(i) + ".png"
        this.startGif.push(loadImage("characters/" + this.name + "/start/" + filename))
    }

    this.dieGif = []
    for (var i = 0; i < 11; i++) {
        var filename = str(i) + ".png"
        this.dieGif.push(loadImage("characters/" + this.name + "/die/" + filename))
    }

    this.currentImage = 0

    this.display = function () {
        if (this.currentImage <= 8) {
            imageMode(CORNER)
            image(this.startGif[this.currentImage], width / 2 - 50, 280, 100, 130)

            if (frameCount % 10 == 0) {
                this.currentImage += 1
            }
        } else {
            image(this.startGif[8], width / 2 - 50, 280, 100, 130)
        }
    }
}