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
}

setup = () => {
	canvas = createCanvas(scene.width, scene.height).parent('canvasContainer')
	background(scene.background)
	frameRate(60)
	angleMode(DEGREES)
	// strokeCap(SQUARE)

	socket = io.connect('localhost:3000')

	socket.on('connect', function () {
		console.log('connected')
	})

	let ball1 = new Balls(createVector(250, 250), 'speed')
	let ball2 = new Balls(createVector(300, 300), 'big')
	let ball3 = new Balls(createVector(100, 430), 'tiny')
	let ball4 = new Balls(createVector(50, 400), 'speed')
	let ball5 = new Balls(createVector(400, 50), 'big')
	let ball6 = new Balls(createVector(185, 332), 'tiny')
	let ball7 = new Balls(createVector(400, 400), 'wall')
	let ball8 = new Balls(createVector(200, 200), 'wall')
	let ball11 = new Balls(createVector(230, 230), 'wall')
	let ball12 = new Balls(createVector(210, 240), 'wall')
	let ball9 = new Balls(createVector(450, 400), 'clear')
	let ball10 = new Balls(createVector(150, 230), 'clear')

	// Setup position log matrix
	posLogMatrix = []
	for (let i = 0; i < scene.posLogMatrixWidth; i++) {
		let tab = []
		for (let j = 0; j < scene.posLogMatrixHeight; j++) {
			tab.push([])
		}
		posLogMatrix.push(tab)
	}
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

document.querySelector('.playButton').addEventListener('click', () => {
	worm.setup()
})
document.querySelector('.pauseButton').addEventListener('click', () => {
	worm.canGo === true ? (worm.canGo = false) : (worm.canGo = true)
})

let player = {}

// Tab change event
document.addEventListener('visibilitychange', function () {
	document.title = document.visibilityState
	console.log(document.visibilityState)
})
