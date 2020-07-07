setup = () => {
	let canvas = createCanvas(600, 600).parent('canvasContainer')
	background(10)
	frameRate(60)
	angleMode(DEGREES)

	worm.setup()

	let socket = io.connect('localhost:3000')
	console.log(socket)

	// Fps displayer
	let fps = frameRate()
	fill(255)
	stroke(0)

	// let customDrawID = window.setInterval(() => {
	// 	console.log('bim')
	// }, 100)
}

draw = () => {
	if (!worm.dead) {
		worm.go()
		worm.dieTest()
	}

	fps = frameRate()
	noStroke()
	fill('black')
	square(0, 0, 70, 30)
	fill('white')
	text('FPS: ' + fps.toFixed(2), 5, 20)
}

let scene = {
	width: 600,
	height: 600,
	spawnMargin: 0.15,
}

let worm = {
	pos: null,
	dir: Math.round(Math.random() * 360),
	speed: 1,
	size: 8,
	control: { goRight: false, goLeft: false, sensitivity: 2 },
	skin: [],
	skinFrame: 0,
	dead: false,

	setup() {
		this.pos = createVector(Math.random() * (scene.width - scene.spawnMargin * scene.width * 2) + scene.spawnMargin * scene.width, Math.random() * (scene.height - scene.spawnMargin * scene.height * 2) + scene.spawnMargin * scene.height)
		console.log(this)
		stroke('white')
		strokeWeight(this.size)
		point(this.pos.x, this.pos.y)

		this.setupSkin({ purple: 20, blue: 20, green: 20, yellow: 20, orange: 20, red: 20 })

		this.go()

		window.addEventListener('keydown', (_event) => {
			switch (_event.code) {
				case 'KeyW':
					this.control.goRight = true
					break
				case 'KeyQ':
					this.control.goLeft = true
					break
			}
		})
		window.addEventListener('keyup', (_event) => {
			switch (_event.code) {
				case 'KeyW':
					this.control.goRight = false
					break
				case 'KeyQ':
					this.control.goLeft = false
					break
			}
		})
	},

	setupSkin(skin) {
		for (const _key in skin) {
			for (let i = 0; i < skin[_key]; i++) {
				this.skin.push(_key)
			}
		}
	},

	go() {
		// Adjust direction depending on control
		this.control.goRight === true ? (this.dir += this.control.sensitivity) : null
		this.control.goLeft === true ? (this.dir -= this.control.sensitivity) : null

		// Updating pos
		let newPos = {}
		newPos.x = this.pos.x + cos(this.dir) * this.speed
		newPos.y = this.pos.y + sin(this.dir) * this.speed
		this.pos = newPos

		// Drawing line
		if (this.skinFrame < this.skin.length - 1) {
			this.skinFrame++
		} else {
			this.skinFrame = 0
		}
		stroke(this.skin[this.skinFrame])
		line(this.pos.x, this.pos.y, newPos.x, newPos.y)
	},

	dieTest() {
		let x = this.pos.x + (cos(this.dir) * this.size) / 1.5
		let y = this.pos.y + (sin(this.dir) * this.size) / 1.5
		// console.log(x, y, get(x, y))
		if (this.pos.x < 0 || this.pos.x > scene.width || this.pos.y < 0 || this.pos.y > scene.height) {
			this.die()
		} else if (get(x, y)[0] !== 10) {
			this.die()
		}
	},

	die() {
		this.dead = true
		console.log('dead')
	},
}
