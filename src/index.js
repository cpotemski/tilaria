import 'pixi.js'

// dummy images from https://dummyimage.com/50x50/fff/000

var WIDTH = window.innerWidth - 100
var HEIGHT = window.innerHeight - 100
var TILE_SIZE = 50
var MOVEMENT_SPEED = 3

var textures = ['orange', 'blue', 'red']

var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

window.addEventListener("keydown", activate, false)
window.addEventListener("keyup", deactivate, false)

var UP = false
var RIGHT = false
var DOWN = false
var LEFT = false

function activate(event) {
  deactivate(event, true)
}

function deactivate (event, status = false) {
  switch(event.key) {
    case 'ArrowUp':
      UP = status || false
      break
    case 'ArrowDown':
      DOWN = status || false
      break
    case 'ArrowLeft':
      LEFT = status || false
      break
    case 'ArrowRight':
      RIGHT = status || false
      break
  }
}

// create the root of the scene graph
var stage = new PIXI.Container();

var tiles = new PIXI.Container();
var collidables = new PIXI.Container()

for(var x = -100; x < 100; x++){
  for(var y = -100; y < 100; y++){
    if(Math.random() < 0.1) {
      var stone = PIXI.Sprite.fromImage(`static/images/tiles/stone.jpg`)
      stone.x = x * TILE_SIZE
      stone.y = y * TILE_SIZE
      collidables.addChild(stone)
    }
    var texture = textures[Math.floor(Math.random()*textures.length)]
    var tile = PIXI.Sprite.fromImage(`static/images/tiles/${texture}.png`)
    tile.x = x * TILE_SIZE
    tile.y = y * TILE_SIZE

    tiles.addChild(tile)
  }
}


var player = PIXI.Sprite.fromImage('static/images/bunny.png')
player.x = WIDTH / 2
player.y = HEIGHT / 2

var world = new PIXI.Container()
world.addChild(tiles)
world.addChild(collidables)

stage.addChild(world)
stage.addChild(player)

// start animating
animate();

// collision();

function animate() {
  requestAnimationFrame(animate);

  move()
  if(collision()) {
    move(-1)
  }



  // render the root container
  renderer.render(stage);
  // PIXI.keyboardManager.update();
}

function move(modifier = 1) {
  if(UP) {
    world.y += MOVEMENT_SPEED * modifier
  }
  if(DOWN) {
    world.y -= MOVEMENT_SPEED * modifier
  }
  if(LEFT) {
    world.x += MOVEMENT_SPEED * modifier
  }
  if(RIGHT) {
    world.x -= MOVEMENT_SPEED * modifier
  }
}

function collision() {
  var BAM = false
  collidables.children.forEach(child => {
    if(collide(child, player)) {
      BAM = true
      return
    }
  })

  return BAM
}

function collide(object1, player) {
  return  object1.x + world.x < player.x + player.width &&
          object1.x + world.x + object1.width > player.x &&
          object1.y + world.y < player.y + player.height &&
          object1.height + object1.y + world.y > player.y
}
