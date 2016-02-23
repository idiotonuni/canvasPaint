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
      posx = pos.x;
      posy = pos.y;
      if(lastRecordedPosition.x!=null){
        if(Math.abs(posx-lastRecordedPosition.x)>4||Math.abs(posy-lastRecordedPosition.y)>4){
          ctx.beginPath();
          ctx.moveTo(lastRecordedPosition.x,lastRecordedPosition.y);
          ctx.lineTo(posx,posy);
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = lineColor;
          ctx.stroke();
        }
      }
      var draw = {
        color: lineColor,
        x: posx,
        y: posy
      }
      /*ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.arc(posx,posy,lineWidth/2,0,2*Math.PI);
      ctx.fill();
      lastRecordedPosition.x = posx;
      lastRecordedPosition.y = posy;*/
      //ctx.fillRect(posx, posy, 4, 4);
    }
  }

function drawStroke(draw){
  ctx.fillStyle = draw.color;
  ctx.beginPath();
  ctx.arc(draw.posx,draw.posy,lineWidth/2,0,2*Math.PI);
  ctx.fill();
  lastRecordedPosition.x = draw.posx;
  lastRecordedPosition.y = draw.posy;
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
  posx = pos.x;
  posy = pos.y;
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(posx,posy,lineWidth/2,0,2*Math.PI);
  ctx.fill();
  lastRecordedPosition.x = posx;
  lastRecordedPosition.y = posy;
},false);

window.addEventListener('mouseup',function(e){
  mouseDown = null;
  lastRecordedPosition = {
    x:null,
    y:null
  };
});

});
