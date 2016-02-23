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

  //console.log(window);

  //handle keyboard controls
  var lineWidth = 10;
  var lineColor = document.getElementById("color").value;
  var mouseDown = false;
  var lastRecordedPosition = {
    x:null,
    y:null
  };

  function draw(e){
    //only draw if mouseDown == true
    if(mouseDown){
      var pos = getMousePos(canvas, e);
      var draw = {
        color: lineColor,
        width: lineWidth,
        x: pos.x,
        y: pos.y
      };
      if(lastRecordedPosition.x!=null){
        if(Math.abs(draw.x-lastRecordedPosition.x)>lineWidth*.4||Math.abs(draw.y-lastRecordedPosition.y)>lineWidth*.4){
          drawPath(draw);
        }
      }
      drawStroke(draw);
    }
  }

function drawStroke(draw){
  ctx.fillStyle = draw.color;
  ctx.beginPath();
  ctx.arc(draw.x,draw.y,draw.width/2,0,2*Math.PI);
  ctx.fill();
  lastRecordedPosition.x = draw.x;
  lastRecordedPosition.y = draw.y;
}

function drawPath(draw){
  ctx.beginPath();
  ctx.moveTo(lastRecordedPosition.x,lastRecordedPosition.y);
  ctx.lineTo(draw.x,draw.y);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.stroke();
}

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

window.addEventListener('mouseup',function(e){
  mouseDown = null;
  lastRecordedPosition = {
    x:null,
    y:null
  };
});

});
