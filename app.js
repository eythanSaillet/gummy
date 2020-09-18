let express = require('express')
let app = express()
let port = process.env.PORT || 3000
let server = app.listen(port)

app.use(express.static('public'))

console.log('Server is running')

let socket = require('socket.io')
let io = socket(server)

// Global scene info

scene = {
	players: [],
	wormsPos: [],
}

// New connection
io.sockets.on('connection', newConnection)

function newConnection(socket) {
	console.log('New connection : ' + socket.id)
	socket.emit('id', socket.id)
	scene.players.push(socket.id)

	// socket.on('key', (key) => {
	// 	console.log(key)
	// })

	// Worm pos receive
	socket.on('go', getWormPos)
	function getWormPos(pos) {
		console.log(pos)
		socket.broadcast.emit('otherPlayersInfo', pos)
	}

	// Worm die receive
	socket.on('die', wormDie)
	function wormDie() {
		console.log('dead')
		console.log(socket.id)
	}

	// Deconnection
	socket.on('disconnect', disconnect)

	function disconnect() {
		console.log('Disconnection : ' + socket.id)

		for (let index = 0; index < scene.players.length; index++) {
			if (socket.id === scene.players[index]) {
				scene.players.splice(index, 1)
			}
		}
	}
}
