const choo = require('choo')
const html = require('choo/html')
const app = choo()
import Game from './game'

app.model({
  state: {
    position: {
      x: 0,
      y: 0
    }
  },
  reducers: {
    update: (data, state) => ({ position: data })
  }
})

const game = new Game()
const mainView = (state, prev, send) => {
  game.send = send
  return html`
    <main>
      <div>Position: ${state.position.x}|${state.position.y}</div>
    </main>
  `
}

app.router((route) => [
  route('/', mainView)
])

const tree = app.start()
document.body.appendChild(tree)
