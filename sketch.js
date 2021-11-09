//https://www.openprocessing.org/sketch/157576
let pg;
let trail;
var num = 5000;
var noiseScale = 500, noiseStrength = 1;
var particles = [num];
var debrises = []; //I KNOW ITS NOT GRAMMATICALLY CORRECT BUT CODE CLARITY THANKS
var riverStarts = [[0.2, 100], [0.5, 200], [0.9, 125]];

var timeScale = 1.4;
let unitSize = 100;
var currentSeed = 0;
// var bigWidth = 2880;
// var bigHeight = 2010;
var isImaging = false;
function setup() {
    // for (let i = 0; i < 3; i++){
        
    // }
    createCanvas(windowWidth, windowHeight);

    noiseSeed(542);
    background(0);
    if (isImaging){
        pixelDensity(4.0);
    }
    else{
        pixelDensity(1.0);
    }
    noStroke();
    for (let i = 0; i < num; i++) {
        var angle = 0; //any value to initialize
        var dir = createVector(cos(angle), sin(angle));
        var speed = random(0.5, 2);
        if (random(0,1) > 0.5){
            let loc = createVector(random(width), 0, 2);
            this.intensity = 0.5;
            particles[i] = new Particle(loc, dir, speed, 0.5);
            continue;
        }
        var loc = getLoc();
        particles[i] = new Particle(loc, dir, speed, 1);
    }
    print(particles);
    pg = createGraphics(windowWidth, windowHeight);
    trail = createGraphics(windowWidth, windowHeight);

    //create debris
    for (let x=0; x < unitSize; x++) {
        for (let y=0; y < unitSize; y++) {
            let color = [];
            let noiseVal = noise(x * noiseScale, y * noiseScale);
            if (random(0,1) > noiseVal){
                continue;
            }
            if (random(0,1) < 0.2){
                color = [random(255),random(255),random(255)];
            }
            else{
                color = [255*noiseVal,255*noiseVal,255*noiseVal];
            }
            let w = x * windowWidth/unitSize + random(-unitSize, unitSize);
            let h = y * windowHeight/unitSize + random(-unitSize, unitSize);
            debrises.push(new Debris(w, h, color));
            
        }
    }
}

function getLoc(){
    // let offset = 100;
    let start = random(riverStarts)
    let w = start[0] * width + random(-start[1], start[1]);
    // print(h);
    return createVector(w, 0, 2);
}
function keyTyped (){
    if (key == ","){
        timeScale *= 1.2;
    }
    if (key == "."){
        timeScale *= 0.8;
    }
    if (key == 'p'){
        print("saving");
        let timeStamp = year() + "-" + month() + "-" + day() + "-" + hour() + "-" + minute() + "-" + second();
        save('water_'+currentSeed+ "_" + timeStamp);
    }
    if (key == 'r'){
        currentSeed = frameCount;
        noiseSeed(currentSeed);
    }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    fill(255, 1);

    // circle(mouseX, mouseY, 75)
    if (frameCount < 5){
        
        background(0);
    }
    // background(0);
    trail.fill(0, 10);
    trail.noStroke();
    trail.rect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].run();
    }
    // push();
    // fill(255, 4);
    pg.clear();
    // pg.stroke(255);
    pg.fill(0);
    pg.noStroke();
    pg.circle(mouseX, mouseY, 75);
    if (mouseY > 2*height/3){
        for (let i = 0; i <debrises.length; i++){
        debrises[i].run();
    }
    }
    pg.fill(0,0);
    pg.stroke(255);
    pg.circle(mouseX, mouseY, 75);
    
    image(trail, 0,0);
    image(pg, 0, 0);
    
}
class Debris {
    constructor(_x, _y, _color){
        let randOffset = (height-_y) / 40;
        this.color = _color;
        this.cx = _x;
        this.cy = _y;
        this.x0 = random(-randOffset,randOffset);
        this.y0 = random(-randOffset,randOffset);
        this.x1 = random(-randOffset,randOffset);
        this.y1 = random(-randOffset,randOffset);
        this.x2 = random(-randOffset,randOffset);
        this.y2 = random(-randOffset,randOffset);
        this.x3 = random(-randOffset,randOffset);
        this.y3 = random(-randOffset,randOffset);

        this.offset = [0,0];
    }
    run() {
        if (dist(mouseX, mouseY, this.cx, this.cy) < 75/2){
            pg.noStroke();
            pg.fill(this.color[0], this.color[1], this.color[2])
            pg.quad(this.cx + this.x0, this.cy + this.y0, this.cx + this.x1, this.cy + this.y1, this.cx + this.x2, this.cy + this.y2, this.cx + this.x3, this.cy + this.y3);
        }
        
    }
}
class Particle {
    constructor(_loc, _dir, _speed, _intensity) {
        this.loc = _loc;
        this.dir = _dir;
        this.speed = _speed;
        this.intensity = _intensity;
        // this.offset = createVector(-width, height * 0.5, 2);
        // var col;
    }
    run() {
        this.move();
        this.checkEdges();
        this.update();
    }
    move() {
        let angle = -PI/2 + noise(this.loc.x / noiseScale, this.loc.y / noiseScale, frameCount/noiseScale/100) * TWO_PI * noiseStrength; //0-2PI

        // let angle = -PI/2 + noise(this.loc.x / noiseScale, this.loc.y / noiseScale, 100* noise(frameCount / 100) / noiseScale * timeScale) * TWO_PI * noiseStrength; //0-2PI
        this.dir.x = cos(angle);
        this.dir.y = sin(angle);
        var vel = this.dir.copy();
        // let mouseVector = createVector(0 , height/2, 2);

        let mouseVector = createVector(mouseX , mouseY, 2);
        let distance = mouseVector.dist(this.loc);
        mouseVector.sub(this.loc);
        
        mouseVector.div(pow(distance, 2) / -50);

        // // print(distance);
        // vel.add(mouseVector);
        if (distance < 70){
            vel.add(mouseVector);
        }
        vel.y += 0.1;
        let dToCenter = width/2 - this.loc.x
        if (dToCenter < 0){
            vel.x += 0.001 * pow(dToCenter + 10, 1);
        }
        if (dToCenter > 0){
            vel.x += 0.001 * pow(dToCenter + 10, 1);
        }
        
        // vel.x -= mouseX - this.loc.x;
        // vel.y -= mouseY - this.loc.y;
        var d = 1;  //direction change 
        vel.mult(this.speed * d * timeScale); //vel = vel * (speed*d)
        this.loc.add(vel); //loc = loc + vel
    }
    checkEdges() {
        //float distance = dist(width/2, height/2, loc.x, loc.y);
        //if (distance>150) {
        if (this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.loc.y > height) {
            if (random(0,1) > 0.5){
                this.loc = createVector(random(width), 0, 2);
                this.intensity = 0.5;
                return;
            }
            let loc = getLoc();
            this.loc.x = loc.x;
            this.loc.y = loc.y;
            this.intensity = 1;
            // this.loc.x = random(width * 1.2);
            // this.loc.y = random(height);
        }
    }
    update() {
        // fill(this.dir.x * 255, this.dir.y * 255, 255);
        trail.fill(this.dir.y * this.intensity, abs(this.dir.x) * 255 * this.intensity, 255 * this.intensity);
        trail.ellipse(this.loc.x, this.loc.y, 2);
    }
}