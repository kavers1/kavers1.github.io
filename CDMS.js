/* @pjs globalKeyEvents=true; 
 */

// Simulation of Cycloid Drawing Machine  - latest version is on https://github.com/jbum/CycloidDrawingMachine
//
// Physical machine designed by Joe Freedman  kickstarter.com/projects/1765367532/cycloid-drawing-machine
// Processing simulation by Jim Bumgardner    krazydad.com
//
//// let inchesToPoints = 72; // controls display scaling
let seventyTwoScale = inchesToPoints / 72.0; // Don't change this
//// let mmToInches = 1/25.4;
/*let setupTeeth = [
  ['DT',150,'CR',72],
  ['DT',120,'CR',94,'AN',90,'FR',34],
  [150,50,100,34,40],
  [144, 100, 72],
  [150, 98, 100],
  [150, 100, 74],
  [150,50,100,34,40,50,50],
];*/
let setupTeeth = [
    [150,72],
    [120,94,90,34],
    [150,50,100,34,40],
    [144, 100, 72],
    [150, 98, 100],
    [150, 100, 74],
    [150,50,100,34,40,50,50],
  ];

let setupMounts = [ // mount point measurements
  [0, 3.3838, 10.625],
  [1.5, 4.4798,  10],
  [0.8973, 1.5, 12],
  [4, 4, 0.8, 2, 8.625],
  [0.7, 2, 4, 8, 9],
  [0.7, 3.3838, 4, 0.21, 12.75, 5.5, 5.25],
  [2.5, 1.0, 14.0],
];

let setupPens = [
  [3.375,-55],
  [4.5,90],
  [7.5,-90],
  [4.75,-65],
  [4.5,-90],
  [3.125,-65],
  [6.5,-90],
];

let setupInversions = [
  [true],
  [false],
  [false],
  [false, false],
  [false, false],
  [false, false, false],
  [false],
];

let setupScenarios = [
  // setup 0    
    ["M:CM:CT",0,       //mount point named CM mounted on CT @ 0
     "G:TT:CM",150,0,    //gear 150 teeth named TT (turntable) mounted on CM pahse 0
     "M:CRP:LR9",0,     //mount point named CRP mounted on LR9 @ 0
     "G:CR:CRP:TT",72,0, //gear 72 teeth named CR (crank) mounted on CRP snug to TT phase 0
     "M:AP:LR1",0,      //mount point named SP mounted on LR1 @ 0
     "M:SP:CR",3.3838,  //mount point named AP mounted on gear CR @ 3.3838
     "R:R1:SP:AP",      //connection rod name R1 from SP to AP
     "M:EX:R1",10.625,  //mount point named EX mounted on crod R1 @ 10.625
     "P:PN:EX",3.375,-55 // Pen named PN mounted on EX lengthe 3.375 angle -55
    ],
  // setup 1
    ["M:CM:CT",0,
     "G:TT:CM",120,0,
     "M:CRP:LR1",0,
     "G:CR:CRP:TT",94,0,
     "M:MA:LR9",0,
     "G:GA:MA:TT",90,0,
     "M:MF:LR1",0,
     "G:GF:MF:CR",34,0,
     "M:SP:GF",1.5,
     "M:AP:GA",4.4798,
     "R:R1:SP:AP",
     "M:EX:R1",10,
     "P:PN:EX",4.5,90
    ],
  // setup 2
    ["M:CM:CT",0,
     "G:TT:CM",120,0,
     "M:CRP:LR8",0,
     "G:CR:CRP:TT",50,0,
     "M:MA:AR3",0,
     "G:GA:MA:CR",90,0,
     "G:GH:MA",34,0,  // can we check if same mount point is used to get stack on ?
     "M:MO:GA",0,
     "G:GO:MO:GH",40,0,
     "M:SP:LR1",0.8973,
     "M:AP:GO",1.5,
     "R:R1:SP:AP",
     "M:EX:R1",12,
     "P:PN:EX",7.5,-90,
    ],
    // setup 3
    ["M:CM:CT",0,
     "G:TT:CM",144,0,
     "M:CRP:LR9",0,
     "G:CR:CRP:TT",100,0,
     "M:MA:LR7",0,
     "G:GA:MA:TT",72,0,
     "M:SP:CR",4,
     "M:AP:GA",4,
     "R:R1:SP:AP",
     "M:SP2:LR1",0.8,
     "M:AP2:R1",2,
     "R:R2:SP2:AP2",
     "M:EX:R2",8.625,
     "P:PN:EX",4.75,-65
    ],
  // setup 4
    ["M:CM:CT",0,
     "G:TT:CM",150,0,
     "M:MA:LR10",0,
     "G:GA:MA:TT",98,0,
     "M:MB:LR7",0,
     "G:GB:MB:TT",100,0,
     "M:SP:LR1",0.7,
     "M:AP:GB",2,
     "R:R1:SP:AP",
     "M:SP2:GA",4,
     "M:AP2:R1",8,
     "R:R2:SP2:AP2",
     "M:EX:R2",3,
     "P:PN:EX",4.5,-90
   ],
  // setup 5
    ["M:CM:CT",0,
     "G:TT:CM",150,0,
     "M:MA:LR9",0,
     "G:GA:MA:TT",100,0,
     "M:MB:LR6",0,
     "G:GB:MB:TT",74,0,
     "M:SP:LR1",0.7,
     "M:AP:GB",3.3838,
     "R:R1:SP:AP",
     "M:SP2:GA",4,
     "M:AP2:R1",0.21,
     "R:R2:SP2:AP2",
     "M:SP3:R2",12.75,
     "M:AP3:R1",5.5,
     "R:R3:SP3:AP3",
     "M:EX:R3",5.25,
     "P:PN:EX",3.125,-65
    ],
  // setup 6
    ["M:CM:CT",0,
     "G:TT:CM",150,0,
     "M:MA:LR8",0,
     "G:GA:MA:TT",34,0,
     "M:MB:AR4",0.315,
     "G:AT:MB:GA",100,0,
     "G:AH:MB",34,0,
     "M:MD:AT",0,
     "G:OR:MD:AH",40,0,
     "M:ME:LR1",0.835,
     "G:FC:ME:TT",50,0,
     "M:MF:LR0",0.39,
     "G:FG:MF:FC",50,0,
     "M:SP:FG",2.5,
     "M:AP:OR",1,
     "R:R1:SP:AP",
     "M:EX:R1",14,
     "P:PN:EX",6.5,90
    ]
  ];

let bWidth = 18.14;
let bHeight = 11.51;
let pCenterX = 8.87;
let pCenterY = 6.61;
let toothRadius = 0.0956414*inchesToPoints;
let meshGap = 1.5*mmToInches*inchesToPoints; // 1.5 mm gap needed for meshing gears

let gFont = {};
let hFont = {};
let nFont = {};
let titlePic = {};


let setupMode = 0; // 0 = simple, 1 = moving pivot, 2 = orbiting gear, 3 = orbit gear + moving pivot

let activeGears = [];
let activeMountPoints = [];
let rails = [];
let activeConnectingRods = [];
let mountPoints = [];
let allCdmsObjects = [];


let selectedObject = null;
let crank = {};
let turnTable = {};
let slidePoint = {}; 
let anchorPoint = {}; 
let discPoint = {}; 
let penMount = {};
let crankRail = {};
let anchorRail = {};
let pivotRail = {};
let freeRail = {};

let cRod = {};
let penRig = {};
let selectPenRig = null;

let paper = {};
//const TWO_PI = 6.283185307179586476925286766559;

let paperScale = 1;
let paperWidth = 9*inchesToPoints*paperScale;
let crankSpeed = 6.283185307179586476925/720;  // rotation per frame  - 0.2 is nice.
let passesPerFrame = 1;
let hiresMode = false;

let isStarted = false;
let isMoving = false;
let penRaised = true;
let lastPenRaised = true;

let lastPX = -1;
let lastPY = -1;
let myFrameCount = 0;
let myLastFrame = -1;
let drawDirection = 1;
let recordCtr = 0;

let backgroundColor = '#808080';
let paperColor = '#ffffff';
let foregroundColor = '#c8c8c8';
let themecolor = {};
let selectedTheme = {};
let penColors = [];
let penColor = {};
let penColorIdx = 0;
let freeMode = false;

let penWidths = [0.5, 1, 2, 3, 5, 7];
let penWidth = 1;
let penWidthIdx = 1;
let loadError = 0; // 1 = gears can't snug

function preload() {
  titlePic = loadImage("../data/title_dark.png");

}
function setup() {
  selectedTheme = color(128,128,128,255); 
  // size(window.innerWidth, window.innerHeight); 
  penColors = [color(0,0,0), color(192,0,0), color(0,128,0), color(0,0,128), color(192,0,192)];
  penColor = color(0,0,0,1);
    
  let cnvs = createCanvas(1400,828); // create drawing canvas
  cnvs.parent('p5jsCanvas'); // assign to marked div in html

  ellipseMode(RADIUS);
  // mydebug("test");
  gFont = textFont("Courier").textSize( int(32*seventyTwoScale));
  hFont = textFont("Courier").textSize( int(18*seventyTwoScale));
  nFont = textFont("Courier").textSize(int(11*seventyTwoScale)); // loadFont("Notch-Font.vlw");
//  titlePic = loadImage("title_dark.png");

  gearInit();
  /* clear arrays */
  activeGears.length = 0;
  activeMountPoints.length = 0;
  activeConnectingRods.length = 0;
  rails.length = 0;
  mountPoints.length = 0;
  allCdmsObjects.length = 0;


  // Board Setup
  
  paper = createGraphics(int(paperWidth), int(paperWidth));

  discPoint = new MountPoint("CT", pCenterX, pCenterY);
  rails.push(discPoint); // center point special case of rail
  rails.push(new LineRail(2.22, 10.21,0.51,0.6,"LR0"));
  rails.push(new LineRail(3.1, 10.23, 3.1,0.5,"LR1"));
  rails.push(new LineRail(8.74, 2.41, 9.87,0.47,"LR2"));
  rails.push(new ArcRail(pCenterX, pCenterY, 6.54, radians(-68), radians(-5),"AR3"));
  rails.push(new ArcRail(8.91, 3.91, 7.79, radians(-25), radians(15),"AR4"));

  let rbegD = [
    4.82, 4.96, 4.96, 4.96, 4.96, 4.96
  ];
  let rendD = [
    7.08, 6.94, 8.46, 7.70, 7.96, 8.48
  ];
  let rang = [
    radians(-120), radians(-60), radians(-40), radians(-20), 0, radians(20)
  ];

  for (let i = 0; i < rbegD.length; ++i) {
      let x1 = pCenterX + cos(rang[i])*rbegD[i];
      let y1 = pCenterY + sin(rang[i])*rbegD[i];
      let x2 = pCenterX + cos(rang[i])*rendD[i];
      let y2 = pCenterY + sin(rang[i])*rendD[i];
      rails.push(new LineRail(x1, y1, x2, y2,"LR"+(5+i)));
  }

  setupButtons();
  doLoadSetup();
  drawingScenario(setupScenarios[setupMode],true);
  //drawingSetup(setupMode, true);
  buttonFeedback();
}

function addGear( setupIdx,  nom)
{
  let g = new Gear(setupTeeth[setupMode][setupIdx], setupIdx, nom);
  activeGears.push(g);
  return g;
}

function addMP( setupIdx,  nom,  chan)
{ 
  if (typeof chan === 'string' || chan instanceof String) {
    chan = getCmdsObj(chan);
  }
  let mp = new MountPoint(nom, chan, setupIdx<0?0:setupMounts[setupMode][setupIdx], setupIdx);
  if(chan instanceof Gear){
    chan.contributesToCycle = true;
  }
  activeMountPoints.push(mp);
  return mp;
}

function addCR( name,  slide,  anchor)
{
  if (typeof slide === 'string' || slide instanceof String) {
    slide = getCmdsObj(slide);
  }
  if (typeof anchor === 'string' || anchor instanceof String) {
    anchor = getCmdsObj(anchor);
  }
  let cr = new ConnectingRod(slide, anchor, -1, name);
  activeConnectingRods.push(cr);
  return cr;
}

function addPen( penMount) {
  if (typeof penMount === 'string' || penMount instanceof String) {
    penMount = getCmdsObj(penMount);
  }
  return new PenRig(setupPens[setupMode][0], setupPens[setupMode][1], penMount);
}

function updateSetup(){
  updateGearSetup(activeGears[0]);
}

function updateGearSetup(anchor){
  for (let g of anchor.meshGears.values()){
    g.snugTo(anchor);
    g.meshTo(anchor);
  }
  for (let g of anchor.meshGears.values()){
    updateGearSetup(g);
  }
  for (let g of anchor.stackGears.values()){
    updateGearSetup(g);
  }
}

function documentScenario(){
  if (activeGears.length > 0){
    let scenario = activeGears[0].documentScenario();
    for (let cr of activeConnectingRods){
      scenario = scenario + cr.documentScenario();
    }
    scenario = scenario + penRig.documentScenario();
    /// TODO store scenario
    return scenario;
  }
}

function drawingScenario(scenario,resetPaper){
  loadError = 0;

  if (resetPaper) {
    isStarted = false;
  }
  isStarted = false;
  penRaised = true;
  myFrameCount = 0;
/// TODO should be removed the double linking is no longer needed since we use named references
  for( let g of activeGears){
    g._cpt.owner = null; // remove circular link to allow garbage collection
  }
/* clear arrays */
  console.log("clear items")
  activeGears.length = 0;
  activeMountPoints.length = 0;
  activeConnectingRods.length = 0;
  penRig = null;
  draw();
  let name = "";
  let mountname = "";
  let mountname2 = "";
  ///TODO can't we provide the scenario as an argument, then we can setup rails by the same function
  //setupIdx = setupMode;
  //let scenario = setupScenarios[setupIdx];
  for (let idx=0 ; idx < scenario.length;idx++){
    let setupStr = scenario[idx];
    let setupElem = setupStr.split(":");
    name = setupElem[1];
    mountname = setupElem[2];
    if (setupElem.length > 3){
      mountname2 = setupElem[3];
    }
    else{
      mountname2 = null;
    }

    switch(setupElem[0]){
      case "M": // add mountpoint
            idx++;
            let mountlength = scenario[idx];
            let mp = addMountPointByName(name,mountname,mountlength);
          break;
      case "G": // add gear
            idx++;
            let teeth = scenario[idx];
            idx++;
            let phaseShift = scenario[idx];
            let g = addGearByName(name,mountname,teeth,phaseShift);
            if (g.cpt.itsChannel.objName === "CT" || g.cpt.objName === "CT"){
              //turnTable = g;
              g.showMount = false;
            }
            /// TODO how to know that we have to stack ??
            if (mountname2){
              console.log( "Snug to ", mountname2);
              g.snugTo(getGearByName(mountname2));
              g.meshTo(getGearByName(mountname2));
            }
          break;
      case "R": // add rod
            let rod = addConnectionRodByName(name,mountname,mountname2);
          break;
      case "P": // add pen
            idx++;
            let length = scenario[idx];
            idx++;
            let angle = scenario[idx];
            let pen = addPenByName(name,mountname,length,angle);
          break;
      case "L": // add lineRail
          break;
      case "A": // add arcRail
          break;
      case "H": // add hinge
          break;
    }
    draw();
  }
  
}

function addMountPointByName(name,mountname,mountlength){
  console.log("Add mountpoint ",name," on ",mountname," length ",mountlength);
  let mp = addMP(-1,name,mountname);
  mp.itsMountLength = mountlength;
}
function addGearByName(name,mountname,teeth,phaseShift){
  console.log("Add new gear ", name," with ", teeth, "teeth, mounted on ",mountname, " rotated by ", phaseShift," rads");
  let gear = addGear(2,name);
  gear.teeth = teeth;
  gear.phaseShift = phaseShift;
  if(getCmdsObj(mountname).isMount4) {
    gear.stackTo(getCmdsObj(mountname).isMount4);
  }
  else{
    gear.mountOn(mountname);
  }
  return gear;
}
function getGearByName(name){
  console.log("Find gear ",name);
  return getCmdsObj(name);
}
function addConnectionRodByName(name,mountpoint,mountpoint2){
  console.log("Add connection rod ",name, " from ", mountpoint, " to ", mountpoint2);
  cRod = addCR( name, mountpoint, mountpoint2);
}
function addPenByName(name,mountpoint,length,angle){
  console.log("Add pen ",name, " at ", mountpoint, " length ", length, " angle ", angle);
  penRig = addPen(mountpoint);
}
            
function drawingSetup( setupIdx,  resetPaper)
{
  let aRail = {};
  let bRail = {};
  let aGear = {};
  let bGear = {};
  let slidePoint2 = {};
  let anchorPoint2 = {};
  let cRod2 = {};
  let slidePoint3 = {};
  let anchorPoint3 = {};
  let cRod3 = {};
  let anchorTable = {};
  let anchorHub = {};
  let orbit = {};
  let fulcrumCrank = {};
  let fulcrumGear = {};
  

  setupMode = setupIdx;
  loadError = 0;

  if (resetPaper) {
    isStarted = false;
  }
  isStarted = false;
  penRaised = true;
  myFrameCount = 0;

  for( let g of activeGears){
    g._cpt.owner = null; // remove circular link to allow garbage collection
  }
/* clear arrays */
  activeGears.length = 0;
  activeMountPoints.length = 0;
  activeConnectingRods.length = 0;
//  mountPoints.length = 0;
  
   // Drawing Setup
  switch (setupIdx) {
  case 0: // simple set up with one gear for pen arm
    turnTable = addGear(0,"Turntable"); 
    crank = addGear(1,"Crank");
    //crankRail = rails[10];
    //pivotRail = rails[1];
    crpt = addMP(-1,"CRPT","LR10");
    crank.mountOn("CRPT");
    //crank.mount(crankRail,0);
    turnTable.mountOn(getCmdsObj("CT"));
    crank.snugTo("Turntable");
    crank.meshTo(getCmdsObj("Turntable"));

    slidePoint = addMP(0, "SP", getCmdsObj("LR1"));
    anchorPoint = addMP(1, "AP", getCmdsObj("Crank"));
    cRod = addCR(0, getCmdsObj("SP"), getCmdsObj("AP"));

    penMount = addMP(2, "EX", cRod);
    penRig = addPen(getCmdsObj("EX"));
    break;

  case 1: // moving fulcrum & separate crank
    turnTable = addGear(0,"Turntable"); 
    crank = addGear(1,"Crank");
    let anchor = addGear(2,"Anchor");
    fulcrumGear = addGear(3,"FulcrumGear");
    crankRail = rails[1];
    anchorRail = rails[10];
    pivotRail = rails[0];
    turnTable.mountOn(discPoint);

    crpt = addMP(-1,"CRPT",crankRail);
    //crank.mount(crankRail, 0); // will get fixed by snugto
    crank.mountOn(crpt); // will get fixed by snugto
    crank.snugTo(turnTable);
    crank.meshTo(turnTable);

    apt = addMP(-1,"ANPT",anchorRail);
    //anchor.mount(anchorRail,0);
    anchor.mountOn(apt);
    anchor.snugTo(turnTable);
    anchor.meshTo(turnTable);

    pvpt = addMP(-1,"PVPT",pivotRail);
    //fulcrumGear.mount(pivotRail, 0); // will get fixed by snugto
    fulcrumGear.mountOn(pvpt); // will get fixed by snugto
    fulcrumGear.snugTo(crank);    
    fulcrumGear.meshTo(crank);   

    slidePoint = addMP(0, "SP", fulcrumGear);
    anchorPoint = addMP(1, "AP", anchor);
    cRod = addCR(0, slidePoint, anchorPoint);
    penMount = addMP(2, "EX", cRod);
    penRig = addPen(penMount);

    break;
    
  case 2: // orbiting gear
    crankRail = rails[9];
    anchorRail = rails[4];
    pivotRail = rails[1];
    
    // Always need these...
    turnTable = addGear(0,"Turntable");
    crank = addGear(1,"Crank");    
    
    // These are optional
    anchorTable = addGear(2,"AnchorTable");
    anchorHub = addGear(3,"AnchorHub"); 
    orbit = addGear(4,"Orbit");
  
    //orbit.isMoving = true;
  
    // Setup gear relationships and mount points here...
    crank.mount(crankRail, 0);
    turnTable.mount(discPoint, 0);
    crank.snugTo(turnTable);
    crank.meshTo(turnTable);
  
    anchorTable.mount(anchorRail,0.315); // this is a hack - we need to allow the anchorTable to snug to the crank regardless of it's size...
    anchorTable.snugTo(crank);
    anchorTable.meshTo(crank);

    anchorHub.stackTo(anchorTable);
    
    orbit.mount(anchorTable,1.5);
    orbit.snugTo(anchorHub);
    orbit.meshTo(anchorHub);
  
    // Setup Pen
    slidePoint = addMP(0, "SP", pivotRail);
    anchorPoint = addMP(1, "AP", orbit);
    cRod = addCR(0, slidePoint, anchorPoint);
    penMount = addMP(2, "EX", cRod);
    penRig = addPen(penMount);
    break;

  case 3:// 2 pen rails, variation A
    pivotRail = rails[1];
    aRail = rails[10];
    bRail = rails[7];
    turnTable = addGear(0,"Turntable");
    aGear = addGear(1,"A");
    bGear = addGear(2,"B");

    turnTable.mount(discPoint, 0);
    aGear.mount(aRail, 0.5);
    aGear.snugTo(turnTable);
    aGear.meshTo(turnTable);

    bGear.mount(bRail, 0.5);
    bGear.snugTo(turnTable);
    bGear.meshTo(turnTable);

    slidePoint = addMP(0, "SP", aGear);
    anchorPoint = addMP(1, "AP", bGear);
    cRod = addCR(0, slidePoint, anchorPoint);

    slidePoint2 = addMP(2, "SP2", pivotRail);
    anchorPoint2 = addMP(3, "AP2", cRod);
    cRod2 = addCR(1, slidePoint2, anchorPoint2);
    penMount = addMP(4,"EX",cRod2);
    penRig = addPen(penMount);

    break;

  case 4: // 2 pen rails, variation B
    pivotRail = rails[1];
    aRail = rails[10];
    bRail = rails[7];
    turnTable = addGear(0,"TurnTable");
    aGear = addGear(1,"A");
    bGear = addGear(2,"B");

    turnTable.mount(discPoint, 0);
    aGear.mount(aRail, 0.5);
    aGear.snugTo(turnTable);
    aGear.meshTo(turnTable);

    bGear.mount(bRail, 0.5);
    bGear.snugTo(turnTable);
    bGear.meshTo(turnTable);

    slidePoint = addMP(0, "SP", pivotRail);
    anchorPoint = addMP(1, "AP", bGear);
    cRod = addCR(0, slidePoint, anchorPoint);

    slidePoint2 = addMP(2, "SP2", aGear);
    anchorPoint2 = addMP(3, "AP2", cRod);
    cRod2 = addCR(1, anchorPoint2, slidePoint2);

    penMount = addMP(4, "EX", cRod2);

    penRig = addPen(penMount);

    break;

  case 5: // 3 pen rails
    pivotRail = rails[1];
    aRail = rails[10];
    bRail = rails[7];
    turnTable = addGear(0,"Turntable");
    aGear = addGear(1,"A");
    bGear = addGear(2,"B");

    turnTable.mount(discPoint, 0);
    aGear.mount(aRail, 0.5);
    aGear.snugTo(turnTable);
    aGear.meshTo(turnTable);

    bGear.mount(bRail, 0.5);
    bGear.snugTo(turnTable);
    bGear.meshTo(turnTable);

    slidePoint = addMP(0, "SP", pivotRail);
    anchorPoint = addMP(1, "AP", bGear);
    cRod = addCR(0, slidePoint, anchorPoint);

    slidePoint2 = addMP(2, "SP2", aGear);
    anchorPoint2 = addMP(3, "AP2", pivotRail);
    cRod2 = addCR(1, slidePoint2, anchorPoint2);

    slidePoint3 = addMP(4, "SP3", cRod2);
    anchorPoint3 = addMP(5, "SA3", cRod);
    cRod3 = addCR(2, anchorPoint3, slidePoint3);
    penMount = addMP(6, "EX", cRod3);
    
    penRig = addPen(penMount);

    break;    
  case 6: // orbiting gear with rotating fulcrum (#1 and #2 combined)
    crankRail = rails[9];
    anchorRail = rails[4];
    // pivotRail = rails[1);
    let fulcrumCrankRail = rails[1];
    let fulcrumGearRail = rails[0];
    
    // Always need these...
    turnTable = addGear(0,"Turntable");//150
    
    crank = addGear(1,"Crank");       // 50               
    
    // These are optional
    anchorTable = addGear(2,"AnchorTable"); //100
    anchorHub = addGear(3,"AnchorHub");     //34          
    orbit = addGear(4,"Orbit");             //40
  
    fulcrumCrank = addGear(5,"FulcrumCrank");//50        
    fulcrumGear = addGear(6,"FulcrumOrbit");//50
  
    //orbit.isMoving = true;
  
    // Setup gear relationships and mount points here...
    crank.mount(crankRail, 0);  //LR9
    turnTable.mount(discPoint, 0); 
    crank.snugTo(turnTable);
    crank.meshTo(turnTable);
  
    anchorTable.mount(anchorRail,0.315);//LR4
    anchorTable.snugTo(crank);
    anchorTable.meshTo(crank);

    anchorHub.stackTo(anchorTable);
    
    orbit.mount(anchorTable,0);
    orbit.snugTo(anchorHub);
    orbit.meshTo(anchorHub);

    fulcrumCrank.mount(fulcrumCrankRail, 0.735+0.1); //LR1
    fulcrumGear.mount(fulcrumGearRail, 0.29-0.1); //LR0
    fulcrumCrank.snugTo(turnTable);
    fulcrumGear.snugTo(fulcrumCrank);    

    fulcrumCrank.meshTo(turnTable);
    fulcrumGear.meshTo(fulcrumCrank);   

    // Setup Pen
    slidePoint = addMP(0, "SP", fulcrumGear);
    anchorPoint = addMP(1, "AP", orbit);
    cRod = addCR(0, slidePoint, anchorPoint);
    penMount = addMP(2, "EX", cRod);
    penRig = addPen(penMount);

    break;

  }
  turnTable.contributesToCycle = true;
  turnTable.showMount = false;
  
}

function getColor(level, alpha=255)
{
  let clr = [level,level,level,alpha].map((value,index)=>{return int(value * themeColor.levels[index] / 255);});
  
  return color(clr);
}

function draw() 
{
  
  if (freeMode){
    themeColor = color('#ffff00a0');
  }
  else {
    themeColor =selectedTheme;
  }
  if (activeGears[0]){
    turnTable = activeGears[0];
  }
  // Crank the machine a few times, based on current passesPerFrame - this generates new gear positions and drawing output
  for ( let p = 0; p < passesPerFrame; ++p) {
    // console.log('drawing ',p,' of ',passesPerFrame,' passes');
    if (isMoving) {
      myFrameCount += drawDirection;
      // console.log('drawing direction:',drawDirection,' framecount :',myFrameCount);
      
      turnTable.crank(myFrameCount*crankSpeed); // The turntable is always the root of the propulsion chain, since it is the only required gear.
      // console.log('get penrig coordinates');
      // work out coords on unrotated paper
      let nib = penRig.getPosition();
      let dx = nib.x - pCenterX*inchesToPoints;
      let dy = nib.y - pCenterY*inchesToPoints;
      let a = atan2(dy, dx);
      let l = sqrt(dx*dx + dy*dy);
      let px = paperWidth/2 + cos(a-turnTable.rotation-turnTable.phase - turnTable.phaseShift)*l*paperScale;
      let py = paperWidth/2 + sin(a-turnTable.rotation-turnTable.phase - turnTable.phaseShift)*l*paperScale;
      //paper.beginDraw();
      if (!isStarted) {
        // paper.clear();
        paper.smooth(8);
        paper.noFill();
        paper.stroke(penColor);
        paper.strokeJoin(ROUND);
        paper.strokeCap(ROUND);
        paper.strokeWeight(penWidth);
        // paper.rect(10, 10, paperWidth-20, paperWidth-20);
        isStarted = true;
      } else if (!penRaised && !lastPenRaised) {
        paper.line(lastPX, lastPY, px, py);
        // console.log('Line from ',lastPX,lastPY,' to ',px,py);
      }
      
      //paper.endDraw();
      lastPX = px;
      lastPY = py;
      lastPenRaised = penRaised;
      // penRaised = false;
      if (myLastFrame != -1 && myFrameCount >= myLastFrame) {
        myLastFrame = -1;
        passesPerFrame = 1;
        penRaised = true;
        isMoving = false;
        isStarted = false;
        buttonFeedback();
        break;
      }
    }
  }
  // console.log ('draw machine background');
  // Draw the machine onscreen in it's current state
  background(backgroundColor); // set color '#808080'
  push();
    image(titlePic, 20, height-titlePic.height);
    // console.log('draw labels');
    drawFulcrumLabels();
    
    fill(foregroundColor); //set color '#c8c8c8'
    noStroke();

    let logoScale = inchesToPoints/72.0;
    // console.log('rails');
    for ( var ch of rails) {
       ch.draw();
    }
    if (freeMode) {
      for (var mp of mountPoints){
        mp.draw();
      }
    }
    // discPoint.draw();
    // console.log('gears');
    activeGears.forEach((item,index,arr)=>{
      if(index>0){
        item.draw();
      }
    });
    // console.log('draw turntabel');
    if (turnTable instanceof Gear) {
      turnTable.draw(); // draw this last
    }
    // console.log('draw penrig');
    if (penRig) {
      penRig.draw();
    }
    // display number of cycles
    fill(0, 0, 255);
    textFont('Courier',24);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text( str(Math.floor(turnTable.rotation / 2 / PI)) +"/"+ str(computeCyclicRotations()),titlePic.width * 2,height-titlePic.height/2);
    
    textStyle(NORMAL);
    textFont('Courier',12);
  
    push();
      translate(pCenterX*inchesToPoints, pCenterY*inchesToPoints);
      rotate(turnTable.rotation+turnTable.phase+turnTable.phaseShift);
      image(paper, -paperWidth/(2*paperScale), -paperWidth/(2*paperScale), paperWidth/paperScale, paperWidth/paperScale);
    pop();
 

    helpDraw(); // draw help if needed

  pop();
}

let isShifting = false;

function keyReleased() {
  //if (key == CODED) {
    if (keyCode == SHIFT)
      isShifting = false;
  //}
}

function keyPressed() {
  switch (key) {
   case ' ':
      isMoving = !isMoving;
      myLastFrame = -1;
      // println("Current cycle length: " + myFrameCount / (TWO_PI/crankSpeed));
     buttonFeedback();

      break;
   case '?':
     toggleHelp();
     break;
   case '0':
     isMoving = false;
     passesPerFrame = 0;
     myLastFrame = -1;
     buttonFeedback();
     // println("Current cycle length: " + myFrameCount / (TWO_PI/crankSpeed));
     break;
   case '1':
     passesPerFrame = 1;
     isMoving = true;
     buttonFeedback();
     break;
   case '2':
   case '3':
   case '4':
   case '5':
   case '6':
   case '7':
   case '8':
   case '9':
      passesPerFrame = int(map((key-'0'),2,9,10,360));
      isMoving = true;
      buttonFeedback();
      break;
   case 'a':
   case 'b':
   case 'c':
   case 'd':
   case 'e':
   case 'f':
   case 'g':
     deselect();
     let setups ='abcdefg';
     let setup = setups.indexOf(key);
     if( setup < 0) break;
     drawingScenario(setupScenarios[setup],false);
     //drawingSetup(setup, false);
     doSaveSetup();
     buttonFeedback();
     break;
   case 'X':
   case 'x':
     clearPaper();
     break;
  case 'p':
    // Swap pen mounts - need visual feedback
    break;
  case '~':
  case '`':
    completeDrawing();
    buttonFeedback();
    break;
  case '[':
    advancePenColor(-1);
    break;
  case ']':
    advancePenColor(1);
    break;
  case '<':
    advancePenWidth(-1);
    break;
  case '>':
    advancePenWidth(1);
    break;
  case '/':
    invertConnectingRod();
    break;
  case '+':
    /// DONE pendown
    penRaised = false;
    break;
  case '-':
    /// DONE penup
    penRaised = true;
    break;
  case '=':
    let direction = (key == '+' || key == '='? 1 : -1);
    nudge(direction, keyCode);
    break;
  default:
    switch (keyCode) {
    case UP_ARROW:
    case DOWN_ARROW:
    case LEFT_ARROW:
    case RIGHT_ARROW:
      let direction = (keyCode == RIGHT_ARROW || keyCode == UP_ARROW? 1 : -1);
      nudge(direction, keyCode);
      break;
    case SHIFT:
      isShifting = true;
      break;
    case 33: //pgdwn
      if(selectedObject && selectedObject instanceof Gear){
        selectedObject.phaseShift -= 2*Math.PI/selectedObject.teeth;
      }
      break;
    case 34: //pgup
      if(selectedObject && selectedObject instanceof Gear){
        selectedObject.phaseShift += 2*Math.PI/selectedObject.teeth;
      }
      break;
    default:
     break;
    }
    break;
  }
}

function mouseDragged()
{
  drag();
}

function mouseReleased() {
  if (freeMode && selectedObject == null){
    doDrop();
  }
  else{
    dropObject();
//    isDragging = false;
  }
  updateSetup();
  cursor(ARROW);
}

function mousePressed() 
{
  let d = 0;
  let closest = 2000;
  let selection = null;
  if (!freeMode || (mouseButton === RIGHT)){
    deselect();
    cursor(ARROW);
  }
  
  d = penRig.isClicked(mouseX, mouseY);
  if (d >= 0 && d <= closest) {
    selection = penRig;
    closest = d;
  }

  for ( let cr of activeConnectingRods) {
    d = cr.isClicked(mouseX, mouseY);
    if (d >= 0 && d < closest ) {
      selection = cr;
      closest = d;
    }
  }
  
  /// TODO check if axel of gear is selected for movement does only work on if meshing is possible
  /// is needed for free positioning

  for ( let g of activeGears) {
    d = g.isClicked(mouseX, mouseY);
    if (d >= 0 && d < closest) {
        selection = g;
        closest = d;
    }
  }
  if (freeMode){
    for ( let mp of mountPoints) {
      d = mp.isClicked(mouseX, mouseY);
      if ( d >= 0 ) {
        selection = mp;
        closest = d;
      }
    }
  }

  for ( let mp of activeMountPoints) {
    d = mp.isClicked(mouseX, mouseY);
    if ( d >= 0 ) {
      selection = mp;
      closest = d;
    }
  }

  if (selection && selectedObject != selection){
    deselect();
    selection.select();
    selectedObject = selection;
    if (selection instanceof Gear){
      cursor('grab');
    } else if(selection instanceof ConnectingRod){
      cursor(ARROW);
    } else if(selection instanceof PenRig){
      penRig.getSelectionCursor(mouseX,mouseY);
    } else if( selection instanceof MountPoint){
      cursor('../assets/RailPoint.png',16,8);
      if (freeMode){ // remove channel constraint will be reinstated at drop
        selection.itsChannel = null;
      }
    } else{
      //cursor(ARROW);
    }

  }
}

function toggleFreeMode() 
{
  if (freeMode) {
    freeMode = false;
  } else {
    selectedTheme = themeColor;
    freeMode = true;
  }
}

function doDrop()
{

    // nothing selected or clicked on
  // if in freemode add new mount point at mouse point and start tracking it 
  let mp = new MountPoint("FREEMP",mouseX/inchesToPoints,mouseY/inchesToPoints);
  selectedObject = mp;
  console.log("added free mountpoint");
  activeMountPoints.push(mp);
}