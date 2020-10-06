let socket, canvas, posLogMatrix

let scene = {
	width: 600,
	height: 600,
	spawnMargin: 0.15,
	background: 10,
	posLogMatrixWidth: 40,
	posLogMatrixHeight: 40,
	selfCollisionDelay: 400,
	isClearing: false,
	wallEffectTimer: 0,
	otherPlayersPos: {},
	isReady: false,
}

setup = () => {
	canvas = createCanvas(scene.width, scene.height).parent('canvasContainer')
	background(scene.background)
	frameRate(60)
	angleMode(DEGREES)
	// strokeCap(SQUARE)

	socket = io.connect('localhost:3000')

	socket.on('connect', function () {
		console.log(socket.id + ' connected')
	})

	// Update online players list
	const $playersList = document.querySelector('.playerInfoContainer')
	socket.on('updatePlayersList', (players, readyPlayers) => {
		$playersList.innerHTML = 'Players : </br></br>'
		for (const _player of players) {
			let $span = document.createElement('span')
			$span.innerHTML = _player
			if (readyPlayers.includes(_player)) {
				$span.style.color = 'green'
			}
			$playersList.appendChild($span)
		}
	})

	// Update game state
	const $gameState = document.querySelector('.gameState')
	socket.on('gameState', (state) => {
		$gameState.innerHTML = state
	})

	// Launch game
	socket.on('start', () => {
		worm.setup()
	})

	// Listen ball displayer
	socket.on('effect', (info) => {
		ballsArray.push(new Balls(createVector(info.pos.x, info.pos.y), info._ball))
	})

	// ballsArray.push((ball1 = new Balls(createVector(250, 250), 'speed')))
	// ballsArray.push((ball2 = new Balls(createVector(300, 300), 'big')))
	// ballsArray.push((ball3 = new Balls(createVector(100, 430), 'tiny')))
	// ballsArray.push((ball4 = new Balls(createVector(50, 400), 'speed')))
	// ballsArray.push((ball5 = new Balls(createVector(400, 50), 'big')))
	// ballsArray.push((ball6 = new Balls(createVector(185, 332), 'tiny')))
	// ballsArray.push((ball7 = new Balls(createVector(400, 400), 'wall')))
	// ballsArray.push((ball8 = new Balls(createVector(200, 200), 'wall')))
	// ballsArray.push((ball11 = new Balls(createVector(230, 230), 'wall')))
	// ballsArray.push((ball12 = new Balls(createVector(210, 240), 'wall')))
	// ballsArray.push((ball9 = new Balls(createVector(450, 400), 'clear')))
	// ballsArray.push((ball10 = new Balls(createVector(150, 230), 'clear')))

	// Setup position log matrix
	posLogMatrix = []
	for (let i = 0; i < scene.posLogMatrixWidth; i++) {
		let tab = []
		for (let j = 0; j < scene.posLogMatrixHeight; j++) {
			tab.push([])
		}
		posLogMatrix.push(tab)
	}

	// Setup socket
	socket.on('otherPlayersInfo', (info) => {
		drawOtherPlayers(info)
		posLogMatrix[Math.floor(info.pos.x / 60)][Math.floor(info.pos.y / 60)].push([createVector(info.pos.x, info.pos.y), info.size])
	})

	// Paint grid
	// stroke(40)
	// strokeWeight(1)
	// for (let i = 0; i < scene.posLogMatrixWidth; i++) {
	// 	line((i * scene.width) / scene.posLogMatrixWidth, 0, (i * scene.width) / scene.posLogMatrixWidth, scene.height)
	// }
	// for (let i = 0; i < scene.posLogMatrixWidth; i++) {
	// 	line(0, (i * scene.height) / scene.posLogMatrixHeight, scene.width, (i * scene.height) / scene.posLogMatrixHeight)
	// }

	// Fps displayer
	let fps = frameRate()
	fill(255)
	stroke(0)
}

draw = () => {
	if (!worm.dead && worm.canGo) {
		worm.go()
		worm.dieTest()

		// Test balls proximity
		for (let i = ballsArray.length - 1; i >= 0; i--) {
			let distance = worm.pos.dist(ballsArray[i].pos)
			if (distance < ballsArray[i].size / 2 + worm.size / 2) {
				// Execute ball effect
				ballsTypes[ballsArray[i].type].effect()
				// Erase ball from the canvas
				ballsArray[i].erase()
				// Remove ball from the array
				ballsArray.splice(i, 1)
			}
		}
	}

	// Draw framerate
	fps = frameRate()
	noStroke()
	fill('black')
	square(0, 0, 60, 10)
	fill('white')
	text('FPS: ' + fps.toFixed(0), 5, 20)
}

drawOtherPlayers = (info) => {
	// Draw other players
	if (scene.otherPlayersPos[info.id] === undefined) {
		scene.otherPlayersPos[info.id] = {}
		scene.otherPlayersPos[info.id].x = info.pos.x
		scene.otherPlayersPos[info.id].y = info.pos.y
	} else {
		strokeWeight(info.size)
		stroke(info.skin)
		line(scene.otherPlayersPos[info.id].x, scene.otherPlayersPos[info.id].y, info.pos.x, info.pos.y)

		scene.otherPlayersPos[info.id].x = info.pos.x
		scene.otherPlayersPos[info.id].y = info.pos.y
	}
}

fillPosLogMatrix = (info) => {
	let pos = createVector(info.pos.x, info.pos.y)
	let size = info.size
	setTimeout(() => {
		if (!scene.isClearing) {
			posLogMatrix[Math.floor(pos.x / 60)][Math.floor(pos.y / 60)].push([pos, size])
		}
	}, scene.selfCollisionDelay)
}

document.querySelector('.readyButton').addEventListener('click', () => {
	// worm.setup()
	if (!scene.isReady) {
		scene.isReady = true
		socket.emit('ready')
	}
})
document.querySelector('.pauseButton').addEventListener('click', () => {
	worm.canGo === true ? (worm.canGo = false) : (worm.canGo = true)
})

// Tab change event
document.addEventListener('visibilitychange', function () {
	document.title = document.visibilityState
})

dieAnimation = (posHistoric) => {
	let i = posHistoric.length
	let intervalID = setInterval(() => {
		i--
		if (i !== 0) {
			if (posHistoric[i - 1] !== null) {
				strokeWeight(posHistoric[i - 1][1])
				stroke('grey')
				line(posHistoric[i][0].x, posHistoric[i][0].y, posHistoric[i - 1][0].x, posHistoric[i - 1][0].y)
			} else {
				i -= 2
			}
		} else {
			clearInterval(intervalID)
		}
	}, 5)
}
