// our world object - this object handles our tiles, drawing the world and converting screen
// coordinates into game coordinates - see OverheadWorld.js for more information
var theWorld

// three different map modes
var mapTown
var mapDesert
var mapUnderwater

// two players
var boz
var lodumani
var players = []

// bubble
var bubbles = []
var bubbleGraphics = []
var expBubbleGraphics = []
let expBubbleGraphicsLeft = []
let expBubbleGraphicsRight = []
let expBubbleGraphicsUp = []
let expBubbleGraphicsDown = []

// states to check whether a character is dead or a bubble exploded, ect
// for sound effect control
let char_dies = false;
let bubble_exp = false;
let prepareSoundIsPlaying = false;
let mainthemeIsPlaying = false;
let winSoundIsPlaying = false;

// audio
let die_sound;
let explode_sound;
let prepare_sound;
let maintheme;
let win_sound;

// interface
var begin
var font
var state = 0 // 0: begin; 1: game; 2: end
var winner

// to calculate the length of the loading bar
var counter = 0;
var maxCounter = 0;


// handle the tile loading and creating our player object in preload before the game can start
function preload() {
    begin = loadImage("interface/BeginScene.png")
    font = loadFont('font/zorque.ttf')

    // audio
    die_sound = loadSound("audio/die.wav");
    explode_sound = loadSound("audio/explode.wav");
    prepare_sound = loadSound("audio/Prepare.mp3");
    maintheme = loadSound("audio/Village.mp3");
    win_sound = loadSound("audio/win.wav");

    // players
    // Boz: awsd - move; r - bubble
    // Lodumani: jikl - move; p - bubble
    boz = new PlayerAnimation("Boz")
    lodumani = new PlayerAnimation("Lodumani")

    winner = lodumani

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

    for (var j = 1; j < 6; j++) {
        for (var i = 0; i < 49; i++) {
            maxCounter++;
            var tempImage = loadImage('images' + j + '/' + i + '.png', updateCounter);
        }
    }
}

function updateCounter() {
    // increase our counter
    counter++;

    // use the counter to set the style on the '#progress_bar' div
    var progress_bar = select('#progress_bar');
    console.log(progress_bar);

    progress_bar.style('width', int(counter / maxCounter * 100) + "%");
}

function setup() {
    var theCanvas = createCanvas(750, 650);
    theCanvas.parent("#wrapper");
    theCanvas.style('display', 'block');
    theCanvas.style('margin', 'auto');
    prepare_sound.loop();
    mapTown = new Map('town')
    mapDesert = new Map('desert')
    mapUnderwater = new Map('underwater')
}

function draw() {
    // begin interface
    if (state == 0) {
        image(begin, 0, 0)

        textSize(60)
        text("Crazy", 150, 95)
        text("Arcade", 220, 160)

        let buttonW = 250
        let buttonH = 70
        let buttonX = 470
        let buttonY = 50

        stroke(0, 150, 250)
        strokeWeight(8)
        fill(0, 80, 180)
        rect(buttonX, buttonY, buttonW, buttonH, 15)
        rect(buttonX, buttonY + 100, buttonW, buttonH, 15)
        rect(buttonX, buttonY + 200, buttonW, buttonH, 15)

        if (mouseX >= buttonX && mouseX <= buttonX + buttonW && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
            fill(230, 180, 20)
            rect(buttonX, buttonY, buttonW, buttonH, 15)
            if (mouseIsPressed) {
                theWorld = new OverheadWorld(mapTown)
                players.push(new Player(0, 0, boz, theWorld))
                players.push(new Player(700, 580, lodumani, theWorld))
                state = 1
            }
        }

        if (mouseX >= buttonX && mouseX <= buttonX + buttonW && mouseY >= buttonY + 100 && mouseY <= buttonY + buttonH + 100) {
            fill(230, 180, 20)
            rect(buttonX, buttonY + 100, buttonW, buttonH, 15)
            if (mouseIsPressed) {
                theWorld = new OverheadWorld(mapDesert)
                players.push(new Player(0, 0, boz, theWorld))
                players.push(new Player(700, 580, lodumani, theWorld))
                state = 1
            }
        }

        if (mouseX >= buttonX && mouseX <= buttonX + buttonW && mouseY >= buttonY + 200 && mouseY <= buttonY + buttonH + 200) {
            fill(230, 180, 20)
            rect(buttonX, buttonY + 200, buttonW, buttonH, 15)
            if (mouseIsPressed) {
                theWorld = new OverheadWorld(mapUnderwater)
                players.push(new Player(0, 0, boz, theWorld))
                players.push(new Player(700, 580, lodumani, theWorld))
                state = 1
            }
        }


        fill(255)
        noStroke()
        textSize(30)
        textAlign(CENTER)
        textFont(font)
        text("Town", buttonX + buttonW / 2, buttonY + 50)
        text("Desert", buttonX + buttonW / 2, buttonY + 150)
        text("Underwater", buttonX + buttonW / 2, buttonY + 250)

    }

    // game interface
    else if (state == 1) {
        theWorld.displayGround()
        theWorld.refreshTileMap()

        // stop prepare sound
        prepare_sound.stop();

        // play maintheme
        if (!mainthemeIsPlaying) {
            mainthemeIsPlaying = true;
            maintheme.loop();

        }

        for (var i = 0; i < 2; i++) {
            // click mouse, the character reborns
            if (mouseIsPressed) {
                if (players[i].state == 3) {
                    players[i].state = 0
                }
            }

            // lives <= 0, character dies
            if (players[i].lives <= 0) {
                players[i].state = 2
                players[i].lives = 90
                char_dies = true;
            }

            //update occupied rows
            var r = players[i].row()
            theWorld.rows[r].occupied = 1
            theWorld.rows[r].players.push(players[i])
        }


        // remove the exploded bubbles
        for (var i = 0; i < bubbles.length; i++) {
            if (bubbles[i].currentFrame_expBubble_center == 3) {
                // change the explode state
                bubble_exp = true;
            }
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

        // occupied rows
        var ors = theWorld.occupiedRows()

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
                    } else if (p[j].state == 1) {
                        p[j].move()
                        p[j].display()
                        p[j].pickUpItem()
                    } else if (p[j].state == 2) {
                        p[j].dieDisplay()

                        // game result
                        if (p[j].name == "Lodumani") {
                            winner = boz
                        } else {
                            winner = lodumani
                        }
                        state = 2
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
                } else if (lastP[i].state == 1) {
                    lastP[i].move()
                    lastP[i].display()
                    lastP[i].pickUpItem()
                } else if (lastP[i].state == 2) {
                    lastP[i].dieDisplay()

                    // game result
                    if (lastP[i].name == "Lodumani") {
                        winner = boz
                    } else {
                        winner = lodumani
                    }
                    state = 2
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
        } else {
            theWorld.displayBlocksByRow(lOR)
        }


        for (var i = 0; i < theWorld.rows.length; i++) {
            theWorld.rows[i] = {
                occupied: 0,
                players: [],
                bubbles: []
            }
        }

        // sound effect
        if (bubble_exp) {
            explode_sound.play();
            bubble_exp = false;
        }

        if (char_dies) {
            die_sound.play();
            char_dies = false;
        }
    }

    // end interface
    else if (state == 2) {
        background(0, 189, 230)
        winner.display()

        mainthemeIsPlaying = false;
        maintheme.stop();

        if (!winSoundIsPlaying) {
            win_sound.play();
            winSoundIsPlaying = true;
        }

        fill(255)
        noStroke()
        textSize(80)
        textAlign(CENTER)
        textFont(font)
        text("WINNER!!", width / 2, 200)

        fill(255)
        noStroke()
        textSize(40)
        textAlign(CENTER)
        textFont(font)
        text("Restart", width / 2, 500)

        if (mouseX >= 290 && mouseX <= 465 && mouseY >= 465 && mouseY <= 500) {
            fill(0, 80, 180)
            textFont(font)
            text("Restart", width / 2, 500)
            if (mouseIsPressed) {
                state = 0
                winner.currentImage = 0
                bubbles = []
                players = []
                winSoundIsPlaying = false;
            }
        }
    }
}

function keyPressed() {

    // set bubbles
    if (state == 1) {
        if (key == 'r' || key == "R") {
            if (theWorld.bubbleMap[players[0].row()][players[0].col()] != 1) {
                bubbles.push(new Bubble(players[0].row(), players[0].col(), theWorld, players))
                theWorld.bubbleMap[players[0].row()][players[0].col()] = 1
            }

        }
        if (key == 'p' || key == "P") {
            if (theWorld.bubbleMap[players[1].row()][players[1].col()] != 1) {
                bubbles.push(new Bubble(players[1].row(), players[1].col(), theWorld, players))
                theWorld.bubbleMap[players[1].row()][players[1].col()] = 1
            }
        }
    }

    // cheat mode in presentation
    // press 'q' to change every element in lifeMap to 1
    if (key == 'q' || key == "Q") {
        console.log('Cheat mode on!')
        var lm = theWorld.lifeMap
        for (var i = 0; i < lm.length; i++) {
            for (var j = 0; j < lm[0].length; j++) {
                lm[i][j] = 1
            }
        }
    }

    // restart the game
    if (key == 'z' || key == "Z") {
        mapTown = new Map('town')
        mapDesert = new Map('desert')
        mapUnderwater = new Map('underwater')
        players.splice(0, 2)
        state = 0
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
        this.numTiles = 6
        this.solidTiles = { 1: true, 2: true, 3: true }
        this.tileMap = this.generateTileMap()
        this.lifeMap = this.generateLifeMap()
    }

    // generateTileMap: generate a random tile map
    // with the four corners and the bricks pattern fixed
    generateTileMap() {
        var map = new Array(13)

        // randomize the map
        for (var i = 0; i < 13; i++) {
            map[i] = new Array(15)
            for (var j = 0; j < 15; j++) {
                map[i][j] = Math.floor(Math.random() * 3)
            }
        }

        // fix four corners
        map[0][0] = 0
        map[0][1] = 0
        map[1][0] = 0

        map[12][0] = 0
        map[11][0] = 0
        map[12][1] = 0

        map[0][14] = 0
        map[0][13] = 0
        map[1][14] = 0

        map[12][14] = 0
        map[12][13] = 0
        map[11][14] = 0

        // fix the brick pattern
        var brick = random(0, 3)
        if (brick < 1) {
            for (var i = 1; i < 12; i += 2) {
                for (var j = 1; j < 14; j += 2) {
                    map[i][j] = 3
                }
            }
        } else if (brick < 2) {
            for (var i = 1; i < 12; i += 2) {
                for (var j = 2; j < 13; j += 4) {
                    map[i][j] = 3
                    map[i][j + 1] = 3
                    map[i][j + 2] = 3
                }
            }
        } else {
            for (var i = 1; i < 12; i += 4) {
                for (var j = 1; j < 15; j += 4) {
                    map[i][j] = 3
                    map[i + 1][j] = 3
                    map[i + 2][j] = 3
                }
            }
        }

        return map
    }

    // generateLifeMap: generate a random life map
    generateLifeMap() {
        var map = new Array(13)

        for (var i = 0; i < 13; i++) {
            map[i] = new Array(15)
            for (var j = 0; j < 15; j++) {
                map[i][j] = Math.floor(Math.random() * 3 + 1)
                map[i][j] *= 30
            }
        }
        return map
    }
}