let noiseScale=0.02;
let unitSize = 500;
function setup() {
    
    createCanvas(5000, 5000);
}


function mousePressed() {
    
}
function keyTyped(){
    if (key == ','){
        noiseScale *= 2;
        redraw();
    }
    if (key == '.'){
        noiseScale /= 2;
        redraw();
    }
    
    if (key == 'p'){
        print("saving");
        let timeStamp = year() + "-" + month() + "-" + day() + "-" + hour() + "-" + minute() + "-" + second();
        save('mosaic' + timeStamp);
    }
}


function draw() {
    background(255);

    for (let x=0; x < unitSize; x++) {
        for (let y=0; y < unitSize; y++) {
        
            let noiseVal = noise(x * noiseScale, y * noiseScale);
            if (random(0,1) > noiseVal){
                continue;
            }
            // fill(noiseVal*255);
            // if (random(0,1) > ){

            // }
            if (random(0,1) < 0.2){
                fill(random(255), random(255), random(255));
            }
            else{
                fill(noiseVal);
            }
            
            noStroke();
            let w = x * width/unitSize + random(-unitSize, unitSize);
            let h = y * width/unitSize + random(-unitSize, unitSize);
            let randOffset = noiseVal * y / 40;
            quad(w + random(-randOffset,randOffset), h + random(-randOffset,randOffset), w + random(-randOffset,randOffset), h + random(-randOffset,randOffset), w + random(-randOffset,randOffset), h + random(-randOffset,randOffset), w + random(-randOffset,randOffset), h + random(-randOffset,randOffset))
            // circle(w, h, noiseVal * 5);
            // line(x, noiseVal*80, x, height);
        }
    }
    noLoop();
}
