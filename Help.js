let drawHelp = false;
let helpStartMS = {} ;//millis();
let helpLines = [
    "Keyboard Shortcuts:",
    "",
    "0-9        set drawing speed",
    "a-g        change setups",
    "arrows     change gears and mount points",
    "x          erase the paper",
    "[ ]        change pen color",
    "< >        change pen width",
    "/          invert connecting rod",
    "~          draw entire cycle",
    "pgup pgdwn change phase of selected gear",
    "- +        pen up / down"
];

function helpDraw() 
{
  if (drawHelp) {
    let elapsed = millis() - helpStartMS;
    let alpha = constrain(map(elapsed, 10*1000, 13*1000, 1, 0),0,1);
    if (alpha <= 0.0001) {
      drawHelp = false;
    }
    noStroke();

    let hx = width-500*seventyTwoScale;
    let hy = 30*seventyTwoScale-100*constrain(map(elapsed,0,300,1,0),0,1);
    
    fill(255,alpha*alpha*192);
    rect(hx-8, 0, width-(hx-8), hy + 22*helpLines.length);

    fill(100, alpha*alpha*255);

    textFont(hFont);
    textAlign(LEFT);
    for ( i = 0; i < helpLines.length; ++i) {
      text(helpLines[i], hx, hy+22*i);
    }
  }
}

function toggleHelp() 
{
  if (drawHelp) {
    drawHelp = false;
  } else {
    drawHelp = true;
    helpStartMS = millis();
  }
}
