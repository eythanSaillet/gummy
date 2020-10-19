const { v4: uuidv4 } = require('uuid');
let express = require('express')
let app = express()
let port = process.env.PORT || 3000
let server = app.listen(port)

app.use(express.static('public'))

console.log('Server is running')

let socket = require('socket.io')
let io = socket(server)

// Global scene info

let scene = {
	// SAME INFO THAN CLIENT SIDE
	width: 600,
	height: 600,
	spawnMargin: 0.15,
	//
	maximumBalls: 10,
	players: [],
	readyPlayers: [],
	wormsPos: [],
	gameState: 'waiting',
	balls: [],
	maxBalls: 10,
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
			start(3)
		}
	})

	// socket.on('key', (key) => {
	// 	console.log(key)
	// })

	// Worm info receive
	socket.on('go', transmitWormInfo)
	function transmitWormInfo(info) {
		socket.broadcast.emit('otherPlayersInfo', info)
	}

	// Worm die receive
	socket.on('die', wormDie)
	function wormDie() {
		console.log('dead :' + socket.id)
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

	// Ball info broadcast
	socket.on('effectBroadcast', (_id) => {
		io.sockets.emit('effectBroadcast', _id)
		for (let i = scene.balls.length - 1; i >= 0; i--) {
			if (_id === scene.balls[i].id) {
				scene.balls.splice(i, 1)
			}
		}
	})

	// Reset
	socket.on('reset', () => {
		
		// Reset serv info
		scene.readyPlayers = []
		io.sockets.emit('reset', scene.players, scene.readyPlayers)
		scene.wormsPos = []
		scene.gameState = 'waiting'
		clearInterval(ballDisplayerIntervalID)
		scene.balls = []

		io.sockets.emit('updatePlayersList', scene.players, scene.readyPlayers)
	})
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
				// START GAME
				console.log('start')
				io.sockets.emit('start')
				startBallDisplayer()
			} else {
				startLoop()
			}
		}, 1000)
	}
	startLoop()
}

// Ball effect displayer

let ballsProb = {
	speed: 0.004,
	big: 0.004,
	tiny: 0.0099,
	wall: 0.004,
	clear: 0.004,
}

let ballDisplayerIntervalID
function startBallDisplayer() {
	ballDisplayerIntervalID = setInterval(() => {
		if (scene.balls.length < scene.maxBalls) {
			for (const _ball in ballsProb) {
				if (Math.random() < ballsProb[_ball] * scene.players.length) {
					let pos = {
						x: Math.random() * (scene.width - scene.spawnMargin * scene.width * 2) + scene.spawnMargin * scene.width,
						y: Math.random() * (scene.height - scene.spawnMargin * scene.height * 2) + scene.spawnMargin * scene.height,
					}
					let id = uuidv4()
					io.sockets.emit('displayEffect', { pos, _ball, id})
					scene.balls.push({pos, id})
				}
			}
		}
	}, 100)
}
