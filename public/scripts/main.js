let socket
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

	let ball1 = new Balls(createVector(250, 250), 'testType', () => {
		console.log('speeeeeeed')
	})
	let ball2 = new Balls(createVector(300, 300), 'testType', () => {
		console.log('biiiiiiiig')
	})
	let ball3 = new Balls(createVector(100, 430), 'testType', () => {
		console.log('invert')
	})

	// Fps displayer
	let fps = frameRate()
	fill(255)
	stroke(0)
}

draw = () => {
	if (!worm.dead && worm.canGo) {
		worm.go()
		let colors = worm.getSensorInfos()
		worm.dieTest(colors)

		// Test balls proximity
		for (let i = ballsArray.length - 1; i >= 0; i--) {
			let distance = worm.pos.dist(ballsArray[i].pos)
			if (distance < 12) {
				console.log('took')
				ballsArray[i].effect()
				ballsArray[i].erase()
				ballsArray.splice(i, 1)
			}
		}
	}

	// Draw framerate
	fps = frameRate()
	noStroke()
	fill('black')
	square(0, 0, 70, 30)
	fill('white')
	text('FPS: ' + fps.toFixed(0), 5, 20)
}

document.querySelector('.playButton').addEventListener('click', () => {
	worm.setup()
})

let scene = {
	width: 600,
	height: 600,
	spawnMargin: 0.15,
}

let player = {}
