var Game = function(canvas, width, height){
  this.coquette = new Coquette(this, canvas, width, height, '#fff');
  this.Maths = new Maths();
};

Game.prototype.init = function(){
  var self = this;

  this.coquette.entities.create(Blob, { 
    size: { x: 100, y: 100 },
    pos: { x: self.Maths.randPosX(), y: self.Maths.randPosY() },
    boundingBox: this.coquette.collider.RECTANGLE,
    speed: 10,
    color: '#efefef'   
  });
};

/*
  function(blob){
    window.addEventListener('click', function(e){
      c.entities.create(BlobSnot, {
        size: { x: 10, y: 10 },
        pos: { 
          x: blob.pos.x + (blob.size.x / 2) - 5, 
          y: blob.pos.y + (blob.size.y / 2) - 5
        },
        boundingBox: c.collider.RECTANGLE,
        speed: 10,
        color: '#ff0000'
      });
    });
  });
*/

var Blob = function(game, settings){
  for (var i in settings){
    this[i] = settings[i];
    console.log(i)
  }

  this.game = game;
  this.size = { x: settings.size.x, y: settings.size.y };
}

Blob.prototype.draw = function(context){
  context.fillStyle = this.color;
  context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

Blob.prototype.collision = function(other, type){};

Blob.prototype.uncollision = function(other, type){};

Blob.prototype.update = function(){
  this.handleKeyboard();
  this.handleBoundaries();
};

Blob.prototype.handleKeyboard = function(){
  var c = this.game.coquette;

  if (c.inputter.state(c.inputter.W)) {
    this.pos.y -= this.speed;
  }

  if (c.inputter.state(c.inputter.S)) {
    this.pos.y += this.speed;
  }

  if (c.inputter.state(c.inputter.A)) {
    this.pos.x -= this.speed;
  }

  if (c.inputter.state(c.inputter.D)) {
    this.pos.x += this.speed;
  }

  if (c.inputter.state(c.inputter.SHIFT)){
    this.pos.x = randPosX();
    this.pos.y = randPosY();
  }
};

  
Blob.prototype.handleBoundaries = function(){
  var c = this.game.coquette;

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

var BlobSnot = function(game, settings){
  for (var i in settings){
    this[i] = settings[i];
  }
  this.game = game;
  this.size = { x: settings.size.x, y: settings.size.y };
};

BlobSnot.prototype.draw = function(context){
  context.fillStyle = settings.color;
  context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

BlobSnot.prototype.collision = function(other, type){};

BlobSnot.prototype.uncollision = function(other, type){};


Maths = function(){};

Maths.prototype.randPosX = function(){
  return Math.floor(Math.random() * (document.width - 0+1)) + 0;
}

Maths.prototype.randPosY = function(){
  return Math.floor(Math.random() * (document.height - 0+1)) + 0;
}

window.addEventListener('load', function(){
  var game = new Game('game', document.width, document.height);
  game.init();
});