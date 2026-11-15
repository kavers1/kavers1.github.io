// Snapper - for paper snapshots

function setup() {
    let cnvs = createCanvas(648,648);
    cnvs.parent('p5jsCanvas');

    noLoop();
}

function draw() {
    background(255);
}

function snapPicture( paper,  rotation,  filename) {
   background(255);

   pushMatrix();
      translate(width/2, height/2);
      rotate(rotation);
      image(paper, -paper.width/2, -paper.width/2);
   popMatrix();
   save(filename);
   saveCanvas(filename, 'jpg');
}
