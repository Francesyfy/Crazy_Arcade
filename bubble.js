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
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        this.state = 0;
        this.bounceTimes = 0;
        
        this.currentFrame_Bubble = 0;
        this.currentFrame_expBubble = 0;
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
            image(expBubbleGraphics[this.currentFrame_expBubble], this.x, this.y);
            if (frameCount % 10 == 0) {
                this.currentFrame_expBubble++;
            }
    
            if (this.currentFrame_expBubble >= expBubbleGraphics.length) {
                this.currentFrame_expBubble = 0;
            }
        }
    }
}