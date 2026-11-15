// Javascript support goes here...

let useDebugging = false;

function mydebug(msg) {
  if (useDebugging) {
    console.log("Debug: " + msg);
  }
}

function jsLoadSetups(csetup) {
  // Load default setups from cookies
  if ($.cookie('.cdms_v7_setups')) {
    mydebug("Got Setup: " + $.cookie('.cdms_v7_setups'));
    var cs = $.parseJSON($.cookie('.cdms_v7_setups'));
    csetup.setupMode = cs.setupMode;
    csetup.setupTeeth = cs.setupTeeth;
    csetup.setupMounts = cs.setupMounts;
    csetup.setupPens = cs.setupPens;
    csetup.setupInversions = cs.setupInversions;
    csetup.penColorIdx = cs.penColorIdx;
    csetup.penWidthIdx = cs.penWidthIdx;

  }
}

function jsSaveSetups(csetup) {
  // Save the setups here to the cdms_setups cookie
  csl = {'setupMode':csetup.setupMode,
         'setupTeeth':csetup.setupTeeth, 
         'setupMounts':csetup.setupMounts, 
         'setupPens':csetup.setupPens, 
         'setupInversions':csetup.setupInversions,
         'penColorIdx':csetup.penColorIdx,
         'penWidthIdx':csetup.penWidthIdx,
       };
  var setupJson = JSON.stringify(csl);
  mydebug(setupJson);
  $.cookie('.cdms_v7_setups', setupJson, {expires:7});
}

function getButtonID(e) {
  var elem = $(e.currentTarget);  // switched from target to currentTarget to get the target of the click handler
  var ctr = 0;
  while (elem.attr('id') == undefined && ctr < 5) {
    elem = elem.parent();
    ctr += 1;
  }
  return elem.attr('id');
}

function buttonFeedback()
{
/// TODO
  // p5.getitem ????
//  var processingInstance = getItem('CDMS');
//  var setupMode = 0;
//  var passesPerFrame = 0;
//  var drawDirection = 0;
//  var isMoving = 0;
/*
  if (processingInstance !== null && processingInstance !== undefined){
    setupMode = processingInstance.getSetupMode();
    passesPerFrame = processingInstance.getPassesPerFrame();
    drawDirection = processingInstance.getDrawDirection();
    isMoving = processingInstance.getIsMoving();
  } 
*/
  var playMode = 'pause';
  if (isMoving && passesPerFrame != 0) {
    if (drawDirection == -1) {
      if (passesPerFrame < 10)
        playMode = 'rr';
      else
        playMode = 'rrr';
    } else {
      if (passesPerFrame < 10)
        playMode = 'play';
      else if (passesPerFrame < 720)
        playMode = 'ff';
      else
        playMode = 'fff';
    }
  }
  $('.bcmd').removeClass('active');
  $('#lcmd\\:setup\\:' + setupMode).addClass('active');
  $('#lcmd\\:'+playMode).addClass('active');
  mydebug("feedback " + setupMode + " " + playMode);
}

function setupButtons() {
  $('.bcmd').on('click', function(evt) {
    var id = getButtonID(evt);
    var tokens = id.split(':');
    var cmd = tokens[1];
    var subCmd = tokens.length >= 2? tokens[2] : '';
    
    issueCmd(cmd, subCmd);
    buttonFeedback();
  });
  $('.credits-btn').on('click', function(evt) {
    $('#CDMS-credits').toggle();
  });
  buttonFeedback();
  // var canvas = document.getElementById("CDMS");
  // var ctx = canvas.getContext("2d");
  // ctx.scale(0.5,0.5);
}
/// TODO snappper werd verwijderd, geen idee of we dit nog nodig hebben
function makeSnapshot(pgraphics, rotation, fileName) 
{
  push();
     translate(width/2, height/2);
     rotate(rotation);
     save(pgraphics,fileName );
  pop();

}

///TODO mail saved canvas