document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  //console.log(canvas);
  var ctx = canvas.getContext("2d");
  canvas.width = (window.innerWidth)*0.8;
  canvas.height = (window.innerHeight)*0.78;
  document.body.appendChild(canvas);

  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();

  //global variables
  var brushShape = document.getElementById("brush").value;
  var lineWidth;
  if(isNaN(document.getElementById("number").value)){
    lineWidth = 10;
  }else {
    lineWidth = document.getElementById("number").value;
  }
  var lineColor = document.getElementById("color").value;
  var mouseDown = false;
  var lastRecordedPosition = {
    x:null,
    y:null
  };
  var lastRecordedPositionForLine = {
    x: 0,
    y: 0
  };
  var canvasDimensions = canvas.getBoundingClientRect();
  //array for storing touches
  var ongoingTouches = new Array();
  //handle keyboard controls
  var keysDown = {};

  //setting brush preview
  document.getElementById("brush-preview").style.height = lineWidth+"px";
  document.getElementById("brush-preview").style.width = lineWidth+"px";
  document.getElementById("brush-preview").style.backgroundColor = lineColor;
  if(brushShape=="circle")
    document.getElementById("brush-preview").style.borderRadius = "50%";

  //called from the mousemove event
  function draw(e){
    //only draw if mouseDown == true
    if(mouseDown){
      //get current cursor position inside the canvas
      var pos = getMousePos(canvas, e);
      //console.log(pos);

      //create a draw object, I don't really think this is strictly necesary but I did it anyway
      var draw = {
        color: lineColor,
        width: lineWidth,
        shape: brushShape,
        x: pos.x,
        y: pos.y
      };
      //if the mouse is still dowm, and the cursor has moved more than 40% of the lineWidth,
      //then draw a path from the previous drawn position to the current position
      if(lastRecordedPosition.x!=null){
        if(Math.abs(draw.x-lastRecordedPosition.x)>lineWidth*.4 || Math.abs(draw.y-lastRecordedPosition.y)>lineWidth*.4){
          drawPath(draw);
        }
      }
      //draw a shape at the current position
      drawStroke(draw);
    }
  }

//this function draws the main "brush"
function drawStroke(draw){
  ctx.fillStyle = draw.color;
  if(draw.shape=="circle"){
    ctx.beginPath();
    ctx.arc(draw.x,draw.y,draw.width/2,0,2*Math.PI);
    ctx.fill();
  }else if (draw.shape=="square") {
    ctx.fillRect(draw.x-draw.width/2,draw.y-draw.width/2,draw.width,draw.width);
    //ctx.fill();
  }
  if(draw.click){
    if(16 in keysDown){
      var path = {
        startX: draw.x,
        startY: draw.y,
        endX: lastRecordedPositionForLine.x,
        endY: lastRecordedPositionForLine.y,
        width: draw.width,
        color: draw.color
      }
      drawMultiPath(path);
    }
  }else{
    lastRecordedPosition.x = draw.x;
    lastRecordedPosition.y = draw.y;
  }


  if(draw.previousX){
    var path = {
      startX: draw.x,
      startY: draw.y,
      endX: draw.previousX,
      endY: draw.previousY,
      color: draw.color,
      width: draw.width
    }
    drawMultiPath(path);
  }
}

function drawMultiPath(path){
  ctx.beginPath();
  ctx.moveTo(path.startX,path.startY);
  ctx.lineTo(path.endX,path.endY);
  ctx.lineWidth = path.width;
  ctx.strokeStyle = path.color;
  ctx.stroke();
}

//this function is used to draw a line for connecting points
function drawPath(draw){
  ctx.beginPath();
  ctx.moveTo(lastRecordedPosition.x,lastRecordedPosition.y);
  ctx.lineTo(draw.x,draw.y);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.stroke();
}

//this function finds the current cursor position in the canvas
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  if(evt.clientX){
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }else if(evt.targetTouches){
    //console.log(evt.targetTouches);
    return {
      x: evt.targetTouches[0].clientX - rect.left,
      y: evt.targetTouches[0].clientY - rect.top
    };
  }
}

//add mousemove listener to draw when moving
window.addEventListener('mousemove', draw, false);

//change color and line width variables
document.getElementById("number").addEventListener('change',function(){
  lineWidth = this.value;
  //console.log(document.getElementById("brush-preview"));
  document.getElementById("brush-preview").style.height = lineWidth+"px";
  document.getElementById("brush-preview").style.width = lineWidth+"px";
})

document.getElementById("color").addEventListener('change',function(){
  lineColor = this.value;
  document.getElementById("brush-preview").style.backgroundColor = this.value;
})

//check if the mouse is currently down
document.getElementById("canvas").addEventListener('mousedown',function(e){
  mouseDown = true;
},false);

document.getElementById("canvas").addEventListener('click',function(e){
  var pos = getMousePos(canvas, e);
  var draw = {
    width: lineWidth,
    color: lineColor,
    shape: brushShape,
    x: pos.x,
    y: pos.y,
    click: true
  };
  drawStroke(draw);
},false);


//check if the mouse releases anywhere in the window
window.addEventListener('mouseup',function(e){
  mouseDown = null;
  lastRecordedPositionForLine.x = lastRecordedPosition.x;
  lastRecordedPositionForLine.y = lastRecordedPosition.y;
  lastRecordedPosition = {
    x:null,
    y:null
  };
});

//add event listener to the clear button
document.getElementById("clear").addEventListener('click',function(){
  if(confirm("Are you sure you want to erase everything?")){
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fill();
  }
})

//add event listener to the brush selector
document.getElementById("brush").addEventListener('change',function(){
  brushShape = this.value;
  if(this.value=="square"){
    document.getElementById("brush-preview").style.borderRadius = "0px";
  }else if(this.value=="circle"){
    document.getElementById("brush-preview").style.borderRadius = "50%";
  }

  lastRecordedPosition = {
    x:null,
    y:null
  };
})

document.getElementById("save").addEventListener('click',function(){
  // save canvas image as data url (png format by default)
  var dataURL = canvas.toDataURL();
  // set canvasImg image src to dataURL
  // so it can be saved as an image
  //document.getElementById('canvasImg').src = dataURL;
  window.open(dataURL,"Your Drawing");
},false);
// save canvas image as data url (png format by default)

//add touch event handlers
canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchmove", handleMove, false);

//touch event functions
function handleStart(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    //console.log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));

    var draw = {
      x: touches[i].pageX - canvasDimensions.left,
      y: touches[i].pageY - canvasDimensions.top,
      width: lineWidth,
      color: lineColor,
      shape: brushShape,
      click: true
    }
    drawStroke(draw);
    console.log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      //console.log("continuing touch "+idx);

      var draw = {
        x: touches[i].pageX - canvasDimensions.left,
        y: touches[i].pageY - canvasDimensions.top,
        previousX: ongoingTouches[idx].pageX - canvasDimensions.left,
        previousY: ongoingTouches[idx].pageY - canvasDimensions.top,
        width: lineWidth,
        color: lineColor,
        shape: brushShape
      }
      drawStroke(draw);
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      //console.log(".");
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}


function handleEnd(evt) {
  evt.preventDefault();
  console.log("touchend");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      var draw = {
        x: touches[i].pageX - canvasDimensions.left,
        y: touches[i].pageY - canvasDimensions.top,
        previousX: ongoingTouches[idx].pageX - canvasDimensions.left,
        previousY: ongoingTouches[idx].pageY - canvasDimensions.top,
        width: lineWidth,
        color: lineColor,
        shape: brushShape
      }

      drawStroke(draw);
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  console.log("touchcancel.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1);  // remove it; we're done
  }
}


function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}


function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}


//key event handler
addEventListener("keydown",function(e){
  keysDown[e.keyCode] = true;
  console.log("shift down")
  e.preventDefault();
}, false);

addEventListener("keyup",function(e){
  delete keysDown[e.keyCode];
  console.log("shift up")
  e.preventDefault();
}, false);

});
