
// https://stackoverflow.com/questions/6865832/detecting-if-a-point-is-of-a-line-segment
// https://jsfiddle.net/c06zdxtL/2/
// Tested and Working
function calcNearestRatioOnLine(line1, line2, pnt) {
  let Dx = line2.x - line1.x;
  let Dy = line2.y - line1.y;
  let L2 = ((Dx * Dx) + (Dy * Dy));
  if (L2 == 0) return 0;
  return (((pnt.x - line1.x) * Dx) + ((pnt.y - line1.y) * Dy)) / L2;
}

function calcNearestPointOnLine(line1, line2, pnt) {
  let Dx = line2.x - line1.x;
  let Dy = line2.y - line1.y;
  let L2 = ((Dx * Dx) + (Dy * Dy));
  if (L2 == 0) return false;
  let r = (((pnt.x - line1.x) * Dx) + ((pnt.y - line1.y) * Dy)) / L2;

  return {
    x: line1.x + (r * Dx),
    y: line1.y + (r * Dy)
  };
}

function calcNearestPointOnSegment(line1, line2, pnt) {
  let Dx = line2.x - line1.x;
  let Dy = line2.y - line1.y;
  let L2 = ((Dx * Dx) + (Dy * Dy));
  if (L2 == 0) return false;
  let r = constrain((((pnt.x - line1.x) * Dx) + ((pnt.y - line1.y) * Dy)) / L2,0,1);

  return {
    x: line1.x + (r * Dx),
    y: line1.y + (r * Dy)
  };
}

function calcDistancePointToLine(line1, line2, pnt) {
  let Dx = line2.x - line1.x;
  let Dy = line2.y - line1.y;
  let L2 = ((Dx * Dx) + (Dy * Dy));
  if (L2 == 0) return false;
  let s = (((line1.y - pnt.y) * Dx) - ((line1.x - pnt.x) * Dy)) / L2;
  return Math.abs(s) * Math.sqrt(L2);
}

function calcIsInsideLineSegment(line1, line2, pnt) {
  let Dx = line2.x - line1.x;
  let Dy = line2.y - line1.y;
  let L2 = ((Dx * Dx) + (Dy * Dy));
  if (L2 == 0) return false;
  let r = (((pnt.x - line1.x) * Dx) + ((pnt.y - line1.y) * Dy)) / L2;

  return (0 <= r) && (r <= 1);
}

function calcIsInsideThickLineSegment(line1, line2, pnt, lineThickness) {
  let Dx = line2.x - line1.x;
  let Dy = line2.y - line1.y;
  let L2 = ((Dx * Dx) + (Dy * Dy));
  if (L2 == 0) return false;
  let r = (((pnt.x - line1.x) * Dx) + ((pnt.y - line1.y) * Dy)) / L2;

  //Assume line thickness is circular
  if (r < 0) { // before line1 point 
    //Outside line1
    return (Math.sqrt(((line1.x - pnt.x) * (line1.x - pnt.x)) + ((line1.y - pnt.y) * (line1.y - pnt.y))) <= lineThickness);
  } else if ((0 <= r) && (r <= 1)) {
    //On the line segment
    let s = (((line1.y - pnt.y) * Dx) - ((line1.x - pnt.x) * Dy)) / L2;
    return (Math.abs(s) * Math.sqrt(L2) <= lineThickness);
  } else {
    //Outside line2
    return (Math.sqrt(((line2.x - pnt.x) * (line2.x - pnt.x)) + ((line2.y - pnt.y) * (line2.y - pnt.y))) <= lineThickness);
  }
}
  
function calcDistanceToThickLineSegment(line1, line2, pnt, lineThickness) {
  let Dx = line2.x - line1.x;
  let Dy = line2.y - line1.y;
  let L2 = ((Dx * Dx) + (Dy * Dy));
  if (L2 == 0) return false;
  let r = (((pnt.x - line1.x) * Dx) + ((pnt.y - line1.y) * Dy)) / L2;
  let d = 0;

  //Assume line thickness is circular
  if (r < 0) { // before line1 point 
    //Outside line1
    d = Math.sqrt(((line1.x - pnt.x) * (line1.x - pnt.x)) + ((line1.y - pnt.y) * (line1.y - pnt.y)))
    return ( d <= lineThickness ? d : -1);
  } else if ((0 <= r) && (r <= 1)) {
    //On the line segment
    let s = (((line1.y - pnt.y) * Dx) - ((line1.x - pnt.x) * Dy)) / L2;
    d = Math.abs(s) * Math.sqrt(L2);
    return (d <= lineThickness ? d : -1);
  } else {
    //Outside line2
    d = Math.sqrt(((line2.x - pnt.x) * (line2.x - pnt.x)) + ((line2.y - pnt.y) * (line2.y - pnt.y)));
    return (d <= lineThickness ? d : -1);
  }
}

function saveFilename( prefix)
{
  let sf = prefix + year() + "-" + month() + "-" + day() + "_" + hour() + "." + minute() + "." + second() + ".png";
  return sf;
}


function getSetupString()
{
  let ss = "Setup\t" + ((char) (65+ setupMode)) + "\n";
  ss += "Gear Teeth\t";
  for ( let i = 0; i < setupTeeth[setupMode].length; ++i) {
    if (i > 0)  ss += "\t";
    ss += setupTeeth[setupMode][i];
  }
  ss += "\nMount Points\t";
  for ( let i = 0; i < setupMounts[setupMode].length; ++i) {
    if (i > 0)  ss += "\t";
    ss += setupMounts[setupMode][i];
  }
  ss += "\n";
  ss += "Pen\t" + penRig.len + "\t" + penRig.angle + "°" + "\n";
  return ss;
}

function GCD( a, b) {
   if (b==0) return a;
   return GCD(b,a%b);
}


// Compute total turntable rotations for current drawing
function computeCyclicRotations() {
  let a = 1; // running minimum
  let idx = 0;
  for ( let g of activeGears) {
    if (g.contributesToCycle && g != turnTable) {
      let ratioNom = turnTable.teeth;
      let ratioDenom = g.teeth;
      if (g.isMoving) { // ! cheesy hack for our orbit configuration, assumes anchorTable,anchorHub,orbit configuration
        ratioNom = turnTable.teeth * (activeGears[idx-1].teeth + g.teeth);
        ratioDenom = activeGears[idx-2].teeth * g.teeth;
        let gcd = GCD(ratioNom, ratioDenom);
        ratioNom /= gcd;
        ratioDenom /= gcd;
      }
      let b = min(ratioNom,ratioDenom) / GCD(ratioNom, ratioDenom);
      // println(g.teeth  + " " + ratioNom + "/" + ratioDenom + "  b = " + b);
      a = max(a,max(a,b)*min(a,b)/ GCD(a, b));
    }
    idx += 1;
  }
  return a;
}

function invertConnectingRod()
{
  if (selectedObject instanceof ConnectingRod) {
    selectedObject.invert();
  } else if (activeConnectingRods.length == 1) {
    activeConnectingRods[0].invert();
  } else {
    // ignore it
    // println("Please select a connecting rod to invert");
  }
}

function completeDrawing()
{
    myFrameCount = 0;
    penRaised = false;
    let totalRotations = computeCyclicRotations();
    // println("Total turntable cycles needed = " + totalRotations);
    let framesPerRotation = int(TWO_PI / crankSpeed);
    myLastFrame = framesPerRotation * totalRotations + 1;
    passesPerFrame = 360*2;
    isMoving = true;
}

function clearPaper() 
{
  paper = createGraphics(paperWidth, paperWidth);
  
  paper.smooth(8);
  paper.noFill();
  paper.stroke(penColor);
  paper.strokeJoin(ROUND);
  paper.strokeCap(ROUND);
  paper.strokeWeight(penWidth);

}

function nudge(direction, kc)
{
  if (selectedObject != null) {
    selectedObject.nudge(direction, kc);
  }
  doSaveSetup();
}

isDragging = false;
startDragX = 0;
startDragY= 0;

function drag() {
  if (selectedObject != null) {
    let direction=0, keycode=0;

    if (!isDragging) {
      startDragX = pmouseX;
      startDragY = pmouseY;
      isDragging = true;
    }
    //!!  for ConnectingRod - use a similar system as for penrig to move it's mountpoint - do NOT do swaps (maybe do them by double-clicking on swivel?)
    //
    if (selectedObject instanceof Gear) {
      let g = selectedObject;
      let dm = dist(mouseX, mouseY, g.cpt.x, g.cpt.y);
      let ds = dist(startDragX, startDragY, g.cpt.x, g.cpt.y);
      if (abs(dm-ds) > 10) {
        direction = (dm > ds)? 1 : -1;
        keycode = (direction == 1)? UP_ARROW: DOWN_ARROW;
        startDragX = mouseX;
        startDragY = mouseY;
      }
    } else if (selectedObject instanceof PenRig) {
      // For pen arm, use startX, endX to get closest anchor point on pen arm.  Then reposition/rotate so that anchorP is as close as possible to mouseX/mouseY
      // using proper penarm quantization.
      // we solve rotation first (using mouse -> arm pivot, translated for parent), then length is fairly easy.
      //
      
        let pr = selectedObject;
        pr.track(mouseX,mouseY);

        setupPens[setupMode][1] = pr.angle;
        setupPens[setupMode][0] = pr.len;
        doSaveSetup();
        startDragX = mouseX;
        startDragY = mouseY;
    } else { // mount point, rail, connection rod
      selectedObject.track(mouseX, mouseY,freeMode);
      direction = 0;
    } 
    if (direction){
      nudge(direction,keycode);
    }
  }
}

function dropObject() {
  isDragging = false;
  if (selectedObject instanceof MountPoint ){
    if(! selectedObject.itsChannel){ // check if we dropped on a channel
      let clst = getClosest(false);
      while (clst[0] &&  // remove selected object or its owning gear
             (clst[0].item === selectedObject ||
              clst[0].item.cpt === selectedObject)){
                clst.shift();
      }
      if (clst[0] && (clst[0].item instanceof LineRail || 
          clst[0].item instanceof ArcRail ||
          clst[0].item instanceof Gear)) {
        selectedObject.itsChannel = clst[0].item; // assign contraining rail or gear
        if (selectedObject.owner) {
          selectedObject.owner.itsChannel = selectedObject.itsChannel; /// TODO this should not be the case a gear should not have a channel but refer to ht channel of the mountpoint
        }
        selectedObject.track(mouseX, mouseY); // adjust mountLength
      }
    }
    if( selectedObject.itsChannel){
      let pt = selectedObject.itsChannel.getPosition(selectedObject.itsMountLength);
      selectedObject.x = pt.x;
      selectedObject.y = pt.y;
      if (selectedObject.setupIdx >= 0) {
        setupMounts[setupMode][selectedObject.setupIdx] = selectedObject.itsMountLength;
      }
    }
  }
}

function getClosest(){
  let d = 0;
  let candidate = [];
  /// TODO need to check rails
  /// TODO need to avoid selecting the child component
  d = penRig.isClicked(mouseX, mouseY);
  if (d > 0)  {
    candidate.push({dist:d,item:penRig});
  }

  for ( let cr of activeConnectingRods) {
    d = cr.isClicked(mouseX, mouseY);
    if (d > 0 ) {
      candidate.push({dist:d,item:cr});
    }
  }
  
  for ( let g of activeGears) {
    d = g.isClicked(mouseX, mouseY);
    if (d > 0 ) {
      candidate.push({dist:d,item:g});
    }
  }

  if (freeMode){
    for ( let mp of mountPoints) {
      d = mp.isClicked(mouseX, mouseY);
      if ( d > 0 ) {
        candidate.push({dist:d,item:mp});
      }
    }
  }

  for ( let mp of activeMountPoints) {
    d = mp.isClicked(mouseX, mouseY);
    if ( d > 0 ) {
      candidate.push({dist:d,item:mp});
    }
  }
  for ( let r of rails) {
    d = r.isClicked(mouseX, mouseY);
    if ( d > 0 ) {
      candidate.push({dist:d,item:r});
    }
  }
  candidate.sort((a,b)=>a.dist-b.dist);
  return candidate;
}

function deselect() {
  if (selectedObject != null) {
    selectedObject.unselect();
    selectedObject = null;
  }
}

function advancePenColor( direction) {
  penColorIdx = (penColorIdx + penColors.length + direction) % penColors.length;
  penColor = penColors[penColorIdx]; 
  //paper.beginDraw();
  paper.stroke(penColor);
  //paper.endDraw();
  if (direction != 0) {
    doSaveSetup();
  }
}

function advancePenWidth( direction) {
  penWidthIdx = (penWidthIdx + penWidths.length + direction) % penWidths.length;
  penWidth = penWidths[penWidthIdx]; 
  //paper.beginDraw();
  paper.strokeWeight(penWidth);
  //paper.endDraw();
  if (direction != 0) {
    doSaveSetup();
  }
}

function drawFulcrumLabels() { // steunpunt labels
    textFont(nFont);
    textAlign(CENTER);
    fill(64);
    stroke(92);
    strokeWeight(0.5);
    push();
      translate(3.1*inchesToPoints, 10.23*inchesToPoints);
      rotate(PI/2);
      let nbrNotches = 39;
      let startNotch = 0.25*inchesToPoints;
      let notchIncr = 0.25*inchesToPoints;
      let minNotch = 0.9*inchesToPoints;
      let lilNotch = minNotch/2;
      let widIncr = 1.722*inchesToPoints/nbrNotches;
      let notchSize = minNotch;
      let notchX = -startNotch;
      for ( let n = 0; n < 39; ++n) {
        line(notchX,0,notchX,n % 2 == 1? notchSize : lilNotch);
        if (n % 2 == 1) {
          text("" + int(n/2+1),notchX,lilNotch); 
        }
        notchSize += widIncr;
        notchX -= notchIncr;
      }
    pop();

}

class CDMSSetup {
  constructor( setupMode,  penColorIdx,  penWidthIdx, setupTeeth, setupMounts, setupPens, setupInversions)
  {
    this.penColorIdx = penColorIdx || 0;
    this.penWidthIdx = penWidthIdx || 0; 
    this.setupMode = setupMode || 0;
    this.setupTeeth = setupTeeth || [[]];
    this.setupMounts = setupMounts || [[]];
    this.setupPens = setupPens || [[]];
    this.setupInversions = setupInversions || [[]];
  }
}
 
function getSetupMode()
  {
    return setupMode;
  }
  
  function getDrawDirection()
  {
    return drawDirection;
  }
  
  function getPassesPerFrame()
  {
    return passesPerFrame;
  }
  
  function getIsMoving()
  {
    return isMoving;
  }
  function doSaveSetup()
  {
    let tsetup = new CDMSSetup(setupMode, penColorIdx, penWidthIdx, setupTeeth, setupMounts, setupPens, setupInversions);
    jsSaveSetups(tsetup);
  }

  function doLoadSetup()
  {
    let tsetup = new CDMSSetup(setupMode, penColorIdx, penWidthIdx, setupTeeth, setupMounts, setupPens, setupInversions);
    jsLoadSetups(tsetup);
    setupTeeth = tsetup.setupTeeth;
    setupMounts = tsetup.setupMounts;
    setupPens = tsetup.setupPens;
    setupInversions = tsetup.setupInversions;
    setupMode = tsetup.setupMode;
    penColorIdx = tsetup.penColorIdx;
    penWidthIdx = tsetup.penWidthIdx;
    advancePenColor(0);
    advancePenWidth(0);
  }

  function doSnapshot() 
  {
    //
    // background(255);
    // image(paper,0,0);
    // save("untitled.png");
    makeSnapshot(paper, turnTable.rotation, saveFilename("cdm_"));
  }

  function issueCmd( cmd,  subcmd) {
    if (!cmd.localeCompare("play")) {
        passesPerFrame = 1;
        isMoving = true;
        penRaised = false;
        drawDirection = 1;
        myLastFrame = -1;
    } else if (!cmd.localeCompare("pause")) {
        isMoving = false;
        drawDirection = 1;
        myLastFrame = -1;
    } else if (!cmd.localeCompare("ff")) {
        passesPerFrame = 10;
        penRaised = false;
        drawDirection = 1;
        isMoving = true;
    } else if (!cmd.localeCompare("fff")) {
        drawDirection = 1;
        penRaised = false;
        completeDrawing();
    } else if (!cmd.localeCompare("rr")) {
        drawDirection = -1;
        passesPerFrame = 1;
        penRaised = false;
        isMoving = true;
    } else if (!cmd.localeCompare("rrr")) {
        drawDirection = -1;
        passesPerFrame = 10;
        penRaised = false;
        isMoving = true;
    } else if (!cmd.localeCompare("erase")) {
        clearPaper();
    } else if (!cmd.localeCompare("setup")) {
        let setupMode = int(subcmd);
        deselect();
        penRaised = true;
        drawingScenario(setupScenarios[setupMode],false);
        //drawingSetup(setupMode, false);
        doSaveSetup();
    } else if (!cmd.localeCompare("snapshot")) {
      doSnapshot();
    } else if (!cmd.localeCompare("help")) {
      toggleHelp();
      // alert("Help is coming soon...");
    } else if (!cmd.localeCompare("freehand")) {
      toggleFreeMode();
    }else if (!cmd.localeCompare("addpen")) {
      drawingScenario(setupMode,false);
    }
  }


