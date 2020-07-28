let socket, posLogMatrix
setup = () => {
	let canvas = createCanvas(600, 600).parent('canvasContainer')
	background(10)
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

	// Setup position log matrix
	let posLogMatrixWidth = 20
	let posLogMatrixHeight = 20
	posLogMatrix = []
	for (let i = 0; i < posLogMatrixWidth; i++) {
		let tab = []
		for (let j = 0; j < posLogMatrixHeight; j++) {
			tab.push([])
		}
		posLogMatrix.push(tab)
	}
	console.log(posLogMatrix)

	// Fps displayer
	let fps = frameRate()
	fill(255)
	stroke(0)
}

draw = () => {
	if (!worm.dead && worm.canGo) {
		worm.go()
		// let colors = worm.getSensorInfos()
		worm.dieTest()

		// Test balls proximity
		for (let i = ballsArray.length - 1; i >= 0; i--) {
			let distance = worm.pos.dist(ballsArray[i].pos)
			if (distance < 12) {
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

let scene = {
	width: 600,
	height: 600,
	spawnMargin: 0.15,
}

let player = {}

// Debug : check color on click
function mouseClicked() {
	console.log(get(mouseX, mouseY))
}
