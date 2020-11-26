// let bubbles = [];
// let bubbleGraphics = [];
// let expBubbleGraphics = [];

// function preload() {
//     for (let i = 1; i <= 3; i++) {
//         let filename = "bubble" + nf(i, 2) + ".png";
//         bubbleGraphics.push(loadImage("bubble/bounce/" + filename));
//     }

//     for (let i = 1; i <= 4; i++) {
//         let filename = str(i) + ".png";
//         expBubbleGraphics.push(loadImage("bubble/explode/center" + filename));
//     }
// }

// function setup() {
//     createCanvas(500, 500);
//     imageMode(CENTER);
// }

// function draw() {
//     background(255);

//     for (let i = 0; i < bubbles.length; i++) {
//         bubbles[i].display();
//     }
// }

// function keyPressed() {
//     if (key == ' ') {
//         bubbles.push(new Bubble(mouseX, mouseY));
//     }
// }

class Bubble {
    constructor(r, c, world, players) {
        this.row = r
        this.col = c
        this.world = world
        this.players = players

        this.x = c * 50;
        this.y = r * 50;

        this.state = 0;
        this.bounceTimes = 0;

        this.currentFrame_Bubble = 0;
        this.currentFrame_expBubble_center = 0;
        this.currentFrame_expBubble_surrounding = 0;
    }

    display() {
        // bounce
        if (this.state == 0) {
            image(bubbleGraphics[this.currentFrame_Bubble], this.x, this.y);
            if (frameCount % 10 == 0) {
                this.currentFrame_Bubble++;
            }

            if (this.currentFrame_Bubble >= bubbleGraphics.length) {
                this.currentFrame_Bubble = 0;
                this.bounceTimes++;
            }

            // the bubble bounces for 6 times, then explodes
            if (this.bounceTimes >= 6) {
                this.state = 1
            }
        }

        // explode
        else if (this.state == 1) {

            // check if the players are within its explode range
            var x = this.x
            var y = this.y
            for (var i = 0; i < players.length; i++) {
                var x_p = this.players[i].x + 25
                var y_p = this.players[i].y + 30

                if ((x_p>x && x_p<x+50 && y_p>y-50 && y_p<y+100) || 
                (x_p>x-50 && x_p<x+100 && y_p>y && y_p<y+50)) {
                    this.players[i].lives -= 1
                }
                console.log(this.players[i].lives)

            }

            // adjust the lifeMap of the overhead world
            // affect itself, up, down, left, right
            var r = this.row
            var c = this.col
            var lifeMap = this.world.lifeMap
            lifeMap[r][c] -= 1
            if(r > 0){
                lifeMap[r-1][c] -= 1
            }
            if (r < lifeMap.length - 1){
                lifeMap[r+1][c] -= 1
            }
            if (c > 0){
                lifeMap[r][c-1] -= 1
            }
            if (c < lifeMap[0].length - 1){
                lifeMap[r][c+1] -= 1
            }


            image(expBubbleGraphics[this.currentFrame_expBubble_center], this.x, this.y, 50, 50);
            if (frameCount % 10 == 0) {
                this.currentFrame_expBubble_center++;
            }

            if (this.currentFrame_expBubble_center >= expBubbleGraphics.length) {
                this.currentFrame_expBubble_center = 0;
            }

            image(expBubbleGraphicsLeft[this.currentFrame_expBubble_surrounding], this.x - 50, this.y, 50, 50);
            if (frameCount % 10 == 0) {
                this.currentFrame_expBubble_surrounding++;
            }

            image(expBubbleGraphicsRight[this.currentFrame_expBubble_surrounding], this.x + 50, this.y, 50, 50);
            if (frameCount % 10 == 0) {
                this.currentFrame_expBubble_surrounding++;
            }

            image(expBubbleGraphicsUp[this.currentFrame_expBubble_surrounding], this.x, this.y - 50, 50, 50);
            if (frameCount % 10 == 0) {
                this.currentFrame_expBubble_surrounding++;
            }

            image(expBubbleGraphicsDown[this.currentFrame_expBubble_surrounding], this.x, this.y + 50, 50, 50);
            if (frameCount % 10 == 0) {
                this.currentFrame_expBubble_surrounding++;
            }

            if (this.currentFrame_expBubble_surrounding >= expBubbleGraphicsLeft.length) {
                this.currentFrame_expBubble_surrounding = 0;
            }

            // update bubbleMap
            this.world.bubbleMap[this.row][this.col] = 0;
        }
    }
}