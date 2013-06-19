/*
* The Game
* BlockSnot is yet another asteroids-like.
* Except twitchy and weird.
*/

var Game = function(canvas, width, height){
  this.coquette = new Coquette(this, canvas, width, height, '#fff');
  this.Maths = new Maths();

  this.title = document.getElementById('title');
  this.title.style['color'] = this.Maths.randColor();
  this.titleOpacity = 1.0;

  this.description = document.getElementById('description');
  this.description.style['color'] = this.Maths.randColor();
  this.descriptionOpacity = 1.0;

  this.screens = {};
  this.screens.gameOver = document.getElementById('game-over');
  this.screens.win = document.getElementById('win');

  this.count = 0;
  this.state = 'playing';
  this.circleJerks = 0;
  this.jerksKilled = 0;
};

Game.prototype.init = function(){
  var self = this;

  this.coquette.entities.create(Block, { 
    size: { x: 3, y: 3 },
    pos: { x: document.width / 2, y: document.height / 2 - 20 },
    boundingBox: this.coquette.collider.RECTANGLE,
    color: self.Maths.randColor(),
    randomPosAmount: 3,
    speed: 10,
    foodEaten: 0
  });
};

Game.prototype.update = function(tick){
  var self = this;

  if ( this.state === 'over'){
    this.screens.gameOver.style['display'] = 'block';
    return;
  }

  if ( this.jerksKilled === 30 && this.circleJerks === 0 ){
    this.screens.win.style['display'] = 'block';
    return;
  }

  if (this.count < 250){
    this.count++;
    if (this.count % 25 === 0){
      this.titleOpacity = Math.round(this.titleOpacity * 10) / 10 - 0.1;
      this.title.style['opacity'] = this.titleOpacity;
      

      this.descriptionOpacity = Math.round(this.descriptionOpacity * 10) / 10 - 0.1;
      this.description.style['opacity'] = this.descriptionOpacity;


      this.coquette.entities.create(Food, {
        size: { x: 16, y: 16 },
        pos: { 
          x: self.Maths.randPosX(), 
          y: self.Maths.randPosY()
        },
        boundingBox: self.coquette.collider.RECTANGLE,
        color: self.Maths.randColor(),
        randomPosAmount: 5,
        speed: 10
      });
    }
  }
}

Game.prototype.draw = function(){
  var winTitle = this.screens.win.querySelector('h1');
  winTitle.style['color'] = this.Maths.randColor();

  var gameOverTitle = this.screens.gameOver.querySelector('h1');
  gameOverTitle.style['color'] = this.Maths.randColor();

  this.title.style['color'] = this.Maths.randColor();
  this.description.style['color'] = this.Maths.randColor();
}


/*
* Block
* The player
*/

var Block = function(game, settings){
  var self = this;

  for (var i in settings){
    this[i] = settings[i];
  }

  this.game = game;
  this.size = { x: settings.size.x, y: settings.size.y };

  window.addEventListener('click', function(e){
    self.changeSize(-1, -2);

    var v = self.game.Maths.vectorTo(self.pos, { x: e.x, y: e.y });

    self.game.coquette.entities.create(BlockSnot, {
      size: { x: 10, y: 10 },
      pos: { 
        x: self.pos.x + (self.size.x / 2) - 5, 
        y: self.pos.y + (self.size.y / 2) - 5
      },
      boundingBox: self.game.coquette.collider.RECTANGLE,
      randomPosAmount: 5,
      speed: 1,
      color: '#ff0000',
      vector: v,
      owner: self,
    });
  });
};

Block.prototype.update = function(){
  var self = this;

  if ( this.state === 'over'){
    return;
  }

  this.handleKeyboard();
  this.handleBoundaries();

  this.pos.x = this.game.Maths.rand(
    this.pos.x - this.randomPosAmount, 
    this.pos.x + this.randomPosAmount
  );

  this.pos.y = this.game.Maths.rand(
    this.pos.y - this.randomPosAmount,
    this.pos.y + this.randomPosAmount
  );

  if ( this.foodEaten === 5 && this.game.circleJerks + this.game.jerksKilled < 30 ){
    this.game.coquette.entities.create(CircleJerk, {
      size: { x: 16, y: 16 },
      pos: { 
        x: self.game.Maths.randPosX(), 
        y: self.game.Maths.randPosY()
      },
      boundingBox: self.game.coquette.collider.CIRCLE,
      color: self.game.Maths.randColor(),
      randomPosAmount: 5,
      speed: 10
    });

    this.game.circleJerks += 1;
  }
};

Block.prototype.draw = function(context){
  context.fillStyle = this.game.Maths.randColor();
  context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

Block.prototype.changeSize = function(size, randomPosAmount){
  if ( this.size.x > 1 ){
    this.size.x += size;
    this.size.y += size;
    this.randomPosAmount += randomPosAmount;
  } else {
    this.game.state = 'over';
  }
}

Block.prototype.collision = function(other, type){
  if ( other instanceof Food ){
    this.game.coquette.entities.destroy(other);
    this.changeSize(3, 2);
    this.foodEaten += 1;
  }

  if ( other instanceof CircleJerk ){
    this.changeSize(-1, 0.5);
  }
};

Block.prototype.uncollision = function(other, type){};

Block.prototype.handleKeyboard = function(){
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

  if (c.inputter.state(c.inputter.UP_ARROW)){
    this.changeSize(1, 0.7);
  }

  if (c.inputter.state(c.inputter.DOWN_ARROW)){
    this.changeSize(-1, -0.7);
  }
};

Block.prototype.handleBoundaries = function(){
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

Block.prototype.randColor = function(){
  var r = 100;
  var g = this.rand(200, 255);
  var b = this.rand(200, 255);
  var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  return rgb;
}


/*
* BlockSnot
* The bullets of the Block
*/

var BlockSnot = function(game, settings){
  for (var i in settings){
    this[i] = settings[i];
  }

  this.game = game;
  this.size = { x: settings.size.x, y: settings.size.y };
  this.pos = settings.pos;
  this.vel = settings.vector;
  console.log(this.owner);
};

BlockSnot.prototype.update = function(tick) {
  if ( this.state === 'over' ){
    return;
  }

  var mx = this.vel.x * tick;
  var my = this.vel.y * tick;
  this.pos.x += mx;
  this.pos.y += my;
};

BlockSnot.prototype.draw = function(context){
  context.fillStyle = this.game.Maths.randColor();
  context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

BlockSnot.prototype.collision = function(other, type){
  var game = this.game;

  if (other instanceof CircleJerk){
    game.coquette.entities.destroy(other);
    game.circleJerks -= 1;
    this.owner.changeSize(1, 1);
    game.jerksKilled += 1
  }

  if (other instanceof Food){
    game.coquette.entities.destroy(other);
    this.owner.changeSize(3, 2);
    game.coquette.entities.create(Food, {
      size: { x: 16, y: 16 },
      pos: { 
        x: game.Maths.randPosX(), 
        y: game.Maths.randPosY()
      },
      boundingBox: game.coquette.collider.RECTANGLE,
      color: game.Maths.randColor(),
      randomPosAmount: 5,
      speed: 10
    });
  }
};

BlockSnot.prototype.uncollision = function(other, type){};


/*
* Food
* For the Block to eat
*/

var Food = function(game, settings){
  for (var i in settings){
    this[i] = settings[i];
  }
  this.game = game;
  this.size = { x: settings.size.x, y: settings.size.y };
};

Food.prototype.update = function(){
  if ( this.state === 'over'){
    return;
  }

  if (this.game.count >= 250){
    this.pos.x = this.game.Maths.rand(
      this.pos.x - this.randomPosAmount, 
      this.pos.x + this.randomPosAmount
    );

    this.pos.y = this.game.Maths.rand(
      this.pos.y - this.randomPosAmount,
      this.pos.y + this.randomPosAmount
    );
  }

  this.handleBoundaries();
}

Food.prototype.draw = function(context){
  context.fillStyle = this.color;
  context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
};

Food.prototype.collision = function(other, type){};

Food.prototype.uncollision = function(other, type){};

Food.prototype.handleBoundaries = function(){
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


/*
* CircleJerk
* Jerks that fight the Block
*/

var CircleJerk = function(game, settings){
  for (var i in settings){
    this[i] = settings[i];
  }

  this.game = game;
  this.size = { x: settings.size.x, y: settings.size.y };
};

CircleJerk.prototype.update = function(){
  if ( this.state === 'over' ){
    return;
  }

  if (this.game.count == 250){
    this.pos.x = this.game.Maths.rand(
      this.pos.x - this.randomPosAmount, 
      this.pos.x + this.randomPosAmount
    );

    this.pos.y = this.game.Maths.rand(
      this.pos.y - this.randomPosAmount,
      this.pos.y + this.randomPosAmount
    );
  }

  this.handleBoundaries();
}

CircleJerk.prototype.draw = function(context){
  context.strokeStyle = this.game.Maths.randColor();
  context.lineWidth = 1;
  context.beginPath();
  context.arc(
    this.pos.x + this.size.x / 2,
    this.pos.y + this.size.y / 2,
    this.size.x / 2, 0, Math.PI * 2, true
  );
  context.closePath();
  context.stroke();
};

CircleJerk.prototype.collision = function(other, type){};

CircleJerk.prototype.uncollision = function(other, type){};

CircleJerk.prototype.handleBoundaries = function(){
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


/*
* Maths
* If only they taught game dev when I was in grade school.
* I probably would have loved math.
* Some of this was grabbed from https://github.com/maryrosecook/coquette/blob/master/demos/advanced/maths.js
*/

Maths = function(){};

Maths.prototype.normalise = function(vec) {
  var v = this.vToSyl(vec).toUnitVector();
  return this.vFromSyl(v);
};

Maths.prototype.vectorTo = function(start, end) {
  return this.normalise({
    x: end.x - start.x,
    y: end.y - start.y
  });
};

// from and to Sylvester
Maths.prototype.vToSyl = function(vec) { return $V([vec.x, vec.y || 0]); },
Maths.prototype.vFromSyl = function(vec) { return { x: vec.e(1), y: vec.e(2) } },

Maths.prototype.randPosX = function(){
  return this.rand(0, document.width);
};

Maths.prototype.randPosY = function(){
  return this.rand(0, document.height);
};
 
Maths.prototype.randColor = function(){
  var r = this.rand(0, 255);
  var g = this.rand(0, 255);
  var b = this.rand(0, 255);
  var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  return rgb;
};

Maths.prototype.rand = function(min, max){
  return Math.floor(Math.random() * (max - min+1)) + min;
};


/*
* Start the game
* When the browser has loaded the site
*/

window.addEventListener('load', function(){
  var game = new Game('game', document.width, document.height);
  game.init();
});