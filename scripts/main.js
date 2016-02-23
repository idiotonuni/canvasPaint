document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  //console.log(canvas);
  var ctx = canvas.getContext("2d");
  canvas.width = (window.innerWidth)*0.8;
  canvas.height = 500;
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

  //called from the mousemove event
  function draw(e){
    //only draw if mouseDown == true
    if(mouseDown){
      //get current cursor position inside the canvas
      var pos = getMousePos(canvas, e);

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
  lastRecordedPosition.x = draw.x;
  lastRecordedPosition.y = draw.y;

  //if calling from click function then unset lastRecordedPosition values
  if(draw.click){
    lastRecordedPosition.x = null;
    lastRecordedPosition.y = null;
  }
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
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

//add mousemove listener to draw when moving
window.addEventListener('mousemove', draw, false);

//change color and line width variables
document.getElementById("number").addEventListener('change',function(){
  lineWidth = this.value;
})

document.getElementById("color").addEventListener('change',function(){
  lineColor = this.value;
})

//check if the mouse is currently down
document.getElementById("canvas").addEventListener('mousedown',function(e){
  mouseDown = true;
},false);

document.getElementById("canvas").addEventListener('click',function(e){
  lastRecordedPosition = {
    x:null,
    y:null
  };
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


});
