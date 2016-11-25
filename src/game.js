import 'pixi.js'

export default class Game {

  constructor() {
    this.config = {
      width: window.innerWidth - 100,
      height: window.innerHeight - 100,
      tileSize: 50,
      movementSpeed: 3,
    }

    this.textures = ['orange', 'blue', 'red']

    this.init()
  }

  init() {
    this.renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height,{backgroundColor : 0x1099bb});
    document.body.appendChild(this.renderer.view);

    window.addEventListener("keydown", this.activate.bind(this), false)
    window.addEventListener("keyup", this.deactivate.bind(this), false)

    var UP = false
    var RIGHT = false
    var DOWN = false
    var LEFT = false

    // create the root of the scene graph
    this.stage = new PIXI.Container();

    var tiles = new PIXI.Container();
    this.collidables = new PIXI.Container()

    for(var x = -100; x < 100; x++){
      for(var y = -100; y < 100; y++){
        if(Math.random() < 0.1) {
          var stone = PIXI.Sprite.fromImage(`static/images/tiles/stone.jpg`)
          stone.x = x * this.config.tileSize
          stone.y = y * this.config.tileSize
          this.collidables.addChild(stone)
        }
        var texture = this.textures[Math.floor(Math.random()*this.textures.length)]
        var tile = PIXI.Sprite.fromImage(`static/images/tiles/${texture}.png`)
        tile.x = x * this.config.tileSize
        tile.y = y * this.config.tileSize

        tiles.addChild(tile)
      }
    }

    this.player = PIXI.Sprite.fromImage('static/images/bunny.png')
    this.player.x = this.config.width / 2
    this.player.y = this.config.height / 2

    this.world = new PIXI.Container()
    this.world.addChild(tiles)
    this.world.addChild(this.collidables)

    this.stage.addChild(this.world)
    this.stage.addChild(this.player)

    // start animating
    this.animate();
  }

  activate(event) {
    this.deactivate(event, true)
  }

  deactivate (event, status = false) {
    switch(event.key) {
      case 'ArrowUp':
        this.UP = status || false
        break
      case 'ArrowDown':
        this.DOWN = status || false
        break
      case 'ArrowLeft':
        this.LEFT = status || false
        break
      case 'ArrowRight':
        this.RIGHT = status || false
        break
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    this.move()

    if(this.collision()) {
      this.move(-1)
    }



    // render the root container
    this.renderer.render(this.stage);
    // PIXI.keyboardManager.update();
  }

  move(modifier = 1) {
    if(this.UP) {
      this.world.y += this.config.movementSpeed * modifier
    }
    if(this.DOWN) {
      this.world.y -= this.config.movementSpeed * modifier
    }
    if(this.LEFT) {
      this.world.x += this.config.movementSpeed * modifier
    }
    if(this.RIGHT) {
      this.world.x -= this.config.movementSpeed * modifier
    }
    if(this.UP || this.DOWN || this.LEFT || this.RIGHT) {
      this.send('update', {
        x: this.world.x,
        y: this.world.y
      })
    }
  }

  collision() {
    var BAM = false
    this.collidables.children.forEach(child => {
      if(this.collide(child, this.player)) {
        BAM = true
        return
      }
    })

    return BAM
  }

  collide(object1, player) {
    return  object1.x + this.world.x < player.x + player.width &&
            object1.x + this.world.x + object1.width > player.x &&
            object1.y + this.world.y < player.y + player.height &&
            object1.height + object1.y + this.world.y > player.y
  }
}
