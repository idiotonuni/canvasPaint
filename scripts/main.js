document.addEventListener("DOMContentLoaded", function(event) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = (window.innerWidth)*0.8;
  canvas.height = 500;
  document.body.appendChild(canvas);

  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();

  console.log(window);

  //handle keyboard controls
  var lineWidth = 10;
  var lineColor = document.getElementById("color").value;
  var mouseDown = false;
  var lastRecordedPosition = {
    x:null,
    y:null
  };

  window.addEventListener('mousedown',function(e){
    mouseDown = true;
    //console.log(e);
  },false);

  window.addEventListener('mouseup',function(e){
    mouseDown = null;
    lastRecordedPosition = {
      x:null,
      y:null
    };
    //console.log(e);
  });

  function draw(e){
    if(mouseDown){
      var pos = getMousePos(canvas, e);
      posx = pos.x;
      posy = pos.y;
      ctx.fillStyle = lineColor;
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
      ctx.beginPath();
      ctx.arc(posx,posy,lineWidth/2,0,2*Math.PI);
      ctx.fill();
      lastRecordedPosition.x = posx;
      lastRecordedPosition.y = posy;
      //ctx.fillRect(posx, posy, 4, 4);
    }
  }

  window.addEventListener('mousemove', draw, false);

  function detectLeftButton(evt) {
    evt = evt || window.event;
    var button = evt.which || evt.button;
    return button == 1;
}

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

document.getElementById("number").addEventListener('change',function(){
  lineWidth = this.value;
})

document.getElementById("color").addEventListener('change',function(){
  lineColor = this.value;
})

});
