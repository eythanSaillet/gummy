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
	socket.emit('updatePlayersList', scene.players)
	socket.broadcast.emit('updatePlayersList', scene.players)

	// socket.on('key', (key) => {
	// 	console.log(key)
	// })

	// Worm info receive
	socket.on('go', transmitWormInfo)
	function transmitWormInfo(info) {
		console.log(info)
		socket.broadcast.emit('otherPlayersInfo', info)
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
		socket.broadcast.emit('updatePlayersList', scene.players)
	}
}
