let worm = {
	id: null,
	canGo: false,
	pos: null,
	// dir: Math.round(Math.random() * 360),
	dir: 90,
	speed: 1,
	size: 8,
	control: { goRight: false, goLeft: false, sensitivity: 1.5 },
	skin: [],
	skinFrame: 0,
	dead: false,

	setup() {
		console.log(socket.id)
		this.id = socket.id

		this.canGo = true

		this.pos = createVector(Math.random() * (scene.width - scene.spawnMargin * scene.width * 2) + scene.spawnMargin * scene.width, Math.random() * (scene.height - scene.spawnMargin * scene.height * 2) + scene.spawnMargin * scene.height)

		strokeWeight(this.size)
		this.setupSkin({ purple: 20, blue: 20, green: 20, yellow: 20, orange: 20, red: 20 })

		window.addEventListener('keydown', (_event) => {
			socket.emit('key', _event.code)
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
		let newPos = createVector()
		newPos.x = this.pos.x + cos(this.dir) * this.speed
		newPos.y = this.pos.y + sin(this.dir) * this.speed
		this.pos = newPos

		// Drawing line
		if (this.skinFrame < this.skin.length - 1) {
			this.skinFrame++
		} else {
			this.skinFrame = 0
		}
		strokeWeight(this.size)
		stroke(this.skin[this.skinFrame])
		line(this.pos.x, this.pos.y, newPos.x, newPos.y)

		// Fill posLogMatrix
		this.fillPosLogMatrix()
	},

	fillPosLogMatrix() {
		let pos = this.pos
		setTimeout(() => {
			posLogMatrix[Math.floor(pos.x / 30)][Math.floor(pos.y / 30)].push(pos)
		}, 200)
	},

	getSensorInfos() {
		// Get position of 3 possible collision points
		let frontSensor = {
			x: this.pos.x + cos(this.dir) * this.size * 0.8 - 1,
			y: this.pos.y + sin(this.dir) * this.size * 0.8 - 1,
		}
		let leftSensor = {
			x: this.pos.x + cos(this.dir - 90) * this.size * 0.8 - 1,
			y: this.pos.y + sin(this.dir - 90) * this.size * 0.8 - 1,
		}
		let rightSensor = {
			x: this.pos.x + cos(this.dir + 90) * this.size * 0.8,
			y: this.pos.y + sin(this.dir + 90) * this.size * 0.8,
		}
		// Debug : draw sensor
		stroke('white')
		strokeWeight(1)
		point(frontSensor.x, frontSensor.y)
		point(leftSensor.x, leftSensor.y)
		point(rightSensor.x, rightSensor.y)
		point(this.pos.x, this.pos.y)

		// Get colors on these points
		let colors = {
			front: get(frontSensor.x, frontSensor.y)[0],
			left: get(leftSensor.x, leftSensor.y)[0],
			right: get(rightSensor.x, rightSensor.y)[0],
		}
		return colors
	},

	dieTest() {
		// Map Border test
		if (this.pos.x < 0 || this.pos.x > scene.width || this.pos.y < 0 || this.pos.y > scene.height) {
			this.die()
		}
		// Obstacle test
		// else if (colors.front > 10 || colors.left > 10 || colors.right > 10) {
		// 	this.die()
		// }
		for (const _position of posLogMatrix[Math.floor(this.pos.x / 30)][Math.floor(this.pos.y / 30)]) {
			if (_position.dist(this.pos) < 10) {
				console.log(this.pos, _position, _position.dist(this.pos))
				stroke('white')
				strokeWeight(1)
				point(this.pos)
				point(_position)
				this.die()
			}
		}
	},

	die() {
		this.dead = true
		console.log('dead')
	},

	ballsTest(colors) {
		if (colors.front === 255 || colors.left === 255 || colors.right === 255) {
			return false
		} else {
			return true
		}
	},
}
