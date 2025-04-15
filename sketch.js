// P5 JS EXPLORING PATTERNS FROM THE COLLECTION OF DESIGN MUSEUM GENT GENT.
// CREATIVE REUSE / CREATIVE-CODING
// Olivier Van D'huynslager

// PARAMETERS FOR DRAWING
let img;
let tilesX = 50;
let tilesY = tilesX;
let tileW, tileH;
let posH;
let design, sourceImage;
let invert = false;
let originalImg;

// Desired scaled size for GCode output
const targetWidth = 3200;
const targetHeight = 800;

// BOUNDARY BOX
let maskWidth, maskHeight;

function loadImageIntoCanvas(url) {
    loadImage(url, (loadedImg) => {
        img = loadedImg;
        originalImg = loadedImg;  // Store original image
        redraw(); // Trigger redraw after image loads
    }, () => {
        console.error("Error loading image.");
    });

    window.selectedImage = url;
    console.log("Image updated:", window.selectedImage);
}

function setup() {
    const container = document.getElementById("canvasWrapper");
    canvas = createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent("canvasWrapper");

    noLoop(); // Prevent continuous drawing

    // Add event listeners for UI controls
    document.getElementById("image-pixels").addEventListener("input", handleUpdate);
    document.getElementById("threshold").addEventListener("input", handleUpdate);
    document.getElementById("image-pos-y").addEventListener("input", handleUpdate);
    document.getElementById("show-box").addEventListener("change", handleUpdate);
    document.getElementById("invert-colors").addEventListener("change", handleInvertChange);

    window.addEventListener("resize", () => {
        resizeCanvas(container.clientWidth, container.clientHeight);
        redraw(); // Redraw when resized
    });


    // Initialize PGraphics
    design = createGraphics(900, 900);
    sourceImage = createGraphics(900, 900);

    // initialize line direction
    document.getElementById("vertical-lines").checked = true;
}

function draw() {
    if (!img) return;
    background(255);
    clear();
    generateDesign();
}

function generateDesign(shouldTranslate = true) {
    posH = parseInt(document.getElementById("image-pos-y").value);
    let showBox = document.getElementById("show-box").checked;

    design.clear();
    design.push();

    if (shouldTranslate) {
        translate(window.innerWidth / 2, window.innerHeight / 2);
    }

    img.resize(900, 0);

    // If invert is true, apply the invert filter, else reset to original image
    if (invert) {
        img = originalImg.get(); // Apply the invert filter to the image
        img.filter(INVERT);
    } else {
        img = originalImg.get(); // Reset to original image
    }

    imageMode(CENTER);

    const threshold = parseInt(document.getElementById("threshold").value);
    tilesX = Math.max(parseInt(document.getElementById("image-pixels").value), 1);
    tilesY = tilesX;

    tileW = img.width / tilesX;
    tileH = img.height / tilesY;

    noStroke();
    let offsetX = -img.width / 2;
    let offsetY = -img.height / 2;

    for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
            let px = parseInt(x * tileW);
            let py = parseInt(y * tileH);
            if (px < 0 || py < 0 || px >= img.width || py >= img.height) continue;
            const c = img.get(px, py);
            const b = brightness(c);
            fill(b > threshold ? 255 : 0);
            rect(offsetX + x * tileW, offsetY + y * tileH, tileW, tileH);
        }
    }

    // Draw Mask
    rectMode(CENTER);
    noFill();
    setLineDash([2, 10, 2, 10]);
    strokeWeight(3);
    stroke("orange");

    if (showBox) {
        rect(0, 0 + posH, 900, 196);
    }

    design.pop();
}

function generateGCode() {
    posH = parseInt(document.getElementById("image-pos-y").value);
    if (!img || img.width === 0 || img.height === 0) {
        console.error("Invalid image dimensions. Cannot generate GCODE.");
        return;
    }

    let gcode = [];
    gcode.push("G21 ; Set units to millimeters");
    gcode.push("G90 ; Absolute positioning");
    gcode.push("G28 ; Home all axes");
    gcode.push("G17 ; XY plane");
    gcode.push("G1 Z5 F500 ; Raise Z axis for safety");

    tilesX = Math.max(parseInt(document.getElementById("image-pixels").value, 10), 1);
    const threshold = parseInt(document.getElementById("threshold").value);
    tilesY = tilesX;
    tileW = 900 / tilesX;
    tileH = 900 / tilesY;

    const scaleX = 145 / 900; //3200 / 100 / 900;
    const scaleY = 45 / (900 / 4); //800 / 100 / (900 / 4);
    const maskYStart = ((900 - (900 / 4)) / 2) + posH;
    const maskYEnd = maskYStart + (900 / 4);

    const vertical = document.getElementById("vertical-lines").checked
    const horizontal = document.getElementById("horizontal-lines").checked

    let penDown = false;
    let lastScaledX = 0;
    let lastScaledY = 0;

    if (vertical){
      for (let x = 0; x < tilesX; x++) {
          for (let y = 0; y < tilesY; y++) {
              let px = parseInt(x * tileW);
              let py = parseInt(y * tileH);

              if (py < maskYStart || py > maskYEnd) continue;

              const c = img.get(px, py);
              const b = brightness(c);

              if (b < threshold) {
                  const scaledX = x * tileW * scaleX;
                  const scaledY = (y * tileH - maskYStart) * scaleY;

                  if (!penDown) {
                      gcode.push(`G1 X${scaledX.toFixed(2)} Y${scaledY.toFixed(2)} F1500`);
                      gcode.push("G1 Z0 F500 ; Pen down");
                      penDown = true;
                  }
                  lastScaledX = scaledX;
                  lastScaledY = scaledY;
                  
              } else {
                  if (penDown) {
                      gcode.push(`G1 X${lastScaledX.toFixed(2)} Y${lastScaledY.toFixed(2)} F1500`);
                      gcode.push("G1 Z5 F500 ; Pen up");
                      penDown = false;
                  }
              }
          }
          if (penDown) {
              gcode.push("G1 Z5 F500 ; Pen up");
              penDown = false;
          }
      }
    }

    if (horizontal){
      penDown = false;
      lastScaledX = 0;
      lastScaledY = 0;

    
      for (let y = 0; y < tilesY; y++) {
          for (let x = 0; x < tilesX; x++) {
      
              let px = parseInt(x * tileW);
              let py = parseInt(y * tileH);

              if (py < maskYStart || py > maskYEnd) continue;

              const c = img.get(px, py);
              const b = brightness(c);

              if (b < threshold) {
                  const scaledX = x * tileW * scaleX;
                  const scaledY = (y * tileH - maskYStart) * scaleY;

                  if (!penDown) {
                      gcode.push(`G1 X${scaledX.toFixed(2)} Y${scaledY.toFixed(2)} F1500`);
                      gcode.push("G1 Z0 F500 ; Pen down");
                      penDown = true;
                  }
                  lastScaledX = scaledX;
                  lastScaledY = scaledY;
                  
              } else {
                  if (penDown) {
                      gcode.push(`G1 X${lastScaledX.toFixed(2)} Y${lastScaledY.toFixed(2)} F1500`);
                      gcode.push("G1 Z5 F500 ; Pen up");
                      penDown = false;
                  }
              }
          }
          if (penDown) {
              gcode.push("G1 Z5 F500 ; Pen up");
              penDown = false;
          }
      }
    }


    gcode.push("G1 Z5 ; Raise Z for completion");
    gcode.push("G1 X0 Y0 F1500; got back to origin");
    gcode.push("M30 ; Program stop");

    let name = document.getElementById("sketchname").value;
    if ( name.length > 0 ){
           saveGCodeFile(gcode.join("\n"), name + ".ngc");
    }
    else
    {
        saveGCodeFile(gcode.join("\n"), "output.ngc");
    }
}

function saveGCodeFile(content, filename) {
    let blob = new Blob([content], { type: 'text/plain' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function savePNG() {
    let name = document.getElementById("sketchname").value;
    save(`${name}.png`);
}

async function fetchPatterns(collection) {
    let url = `https://data.designmuseumgent.be/v1/pattern-api?collection=${collection}`;
    let response = await fetch(url).then(response => response.json());
    return response["GecureerdeCollectie.bestaatUit"];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

// Handles UI changes
function handleUpdate() {
    redraw();
}

function handleInvertChange() {
    invert = document.getElementById("invert-colors").checked; // Update the invert flag based on the checkbox
    console.log("Invert flag:", invert); // Log the value for debugging
    console.log("CHANGE")
    redraw(); // Trigger redraw after invert checkbox change
}
