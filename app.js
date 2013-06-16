var Game = function(canvas, width, height){
  var c = new Coquette(this, canvas, width, height, '#fff');

  c.entities.create(Blob, { 
    size: { x: 100, y: 100 },
    pos: { x: randPosX(), y: randPosY() },
    speed: 10,
    color: '#efefef',
    update: function(){
      if (c.inputter.state(c.inputter.UP_ARROW)) {
        this.pos.y -= this.speed;
      }
      if (c.inputter.state(c.inputter.DOWN_ARROW)) {
        this.pos.y += this.speed;
      }
      if (c.inputter.state(c.inputter.LEFT_ARROW)) {
        this.pos.x -= this.speed;
      }
      if (c.inputter.state(c.inputter.RIGHT_ARROW)) {
        this.pos.x += this.speed;
      }
      if (c.inputter.state(c.inputter.SHIFT)){
        this.pos.x = randPosX();
        this.pos.y = randPosY();
      }

      if (this.pos.y <= 0){
        this.pos.y = 0;
      }
      if (this.pos.y >= c.renderer.height - this.size.y){
        this.pos.y = c.renderer.height - this.size.y;
      }
      if (this.pos.x <= 0){
        this.pos.x = 0;
      }
      if (this.pos.x >= c.renderer.width - this.size.x){
        this.pos.x = c.renderer.width - this.size.x;
      }
    }
  });
}

var Blob = function(_, settings){
  for (var i in settings){
    this[i] = settings[i];
  }

  this.size = { x: settings.size.x, y: settings.size.y };

  this.draw = function(context){
    context.fillStyle = settings.color;
    context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  };

  this.collision = function(other, type){

  };

  this.uncollision = function(other, type){

  };
}

function randPosX(){
  return Math.floor(Math.random() * (document.width - 0+1)) + 0;
}

function randPosY(){
  return Math.floor(Math.random() * (document.height - 0+1)) + 0;
}

window.addEventListener('load', function(){
  new Game('game', document.width, document.height);
});