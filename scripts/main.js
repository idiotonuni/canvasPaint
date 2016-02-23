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
  var lineWidth = 10;
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
      //draw a circle at the current position
      drawStroke(draw);
    }
  }

//this function draws the main "brush"
function drawStroke(draw){
  ctx.fillStyle = draw.color;
  ctx.beginPath();
  ctx.arc(draw.x,draw.y,draw.width/2,0,2*Math.PI);
  ctx.fill();
  lastRecordedPosition.x = draw.x;
  lastRecordedPosition.y = draw.y;
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
  var pos = getMousePos(canvas, e);
  var draw = {
    color: lineColor,
    x: pos.x,
    y: pos.y
  }
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

});
