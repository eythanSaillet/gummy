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
	readyPlayers: ['dcsdcs'],
	gameState: 'waiting',
}

// New connection
io.sockets.on('connection', newConnection)

function newConnection(socket) {
	console.log('New connection : ' + socket.id)
	socket.emit('id', socket.id)
	scene.players.push(socket.id)
	io.sockets.emit('updatePlayersList', scene.players, scene.readyPlayers)
	// socket.emit('updatePlayersList', scene.players)
	// socket.broadcast.emit('updatePlayersList', scene.players)

	// Worm ready
	socket.on('ready', () => {
		// Update ready player list
		console.log(socket.id + ' is ready')
		scene.readyPlayers.push(socket.id)
		io.sockets.emit('updatePlayersList', scene.players, scene.readyPlayers)

		// Launch the game if all players are ready
		if (testIfPlayersAreReady()) {
			console.log('starting')
			start(5)
		}
	})

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
		socket.broadcast.emit('updatePlayersList', scene.players, scene.readyPlayers)
	}
}

function testIfPlayersAreReady() {
	let readyPlayers = 0
	for (const _player of scene.players) {
		if (scene.readyPlayers.includes(_player)) {
			readyPlayers++
		}
	}
	if (readyPlayers === scene.players.length && scene.gameState === 'waiting') {
		scene.gameState = 'starting'
		return true
	}
	return false
}

function start(delay) {
	let time = delay
	io.sockets.emit('gameState', `Sarting in ${time}`)
	let startLoop = () => {
		setTimeout(() => {
			time--
			io.sockets.emit('gameState', `Sarting in ${time}`)
			if (time === 0) {
				io.sockets.emit('start')
				console.log('start')
			} else {
				startLoop()
			}
		}, 1000)
	}
	startLoop()
}
