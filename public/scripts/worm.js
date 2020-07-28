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
		let size = this.size
		setTimeout(() => {
			posLogMatrix[Math.floor(pos.x / 60)][Math.floor(pos.y / 60)].push([pos, size])
		}, 400)
	},

	dieTest() {
		// Map border test
		if (this.pos.x < 0 || this.pos.x > scene.width || this.pos.y < 0 || this.pos.y > scene.height) {
			this.die()
		}
		// Worms collision test
		else {
			for (const _log of posLogMatrix[Math.floor(this.pos.x / 60)][Math.floor(this.pos.y / 60)]) {
				if (_log[0].dist(this.pos) < _log[1] / 2 + this.size / 2 && this.dead === false) {
					stroke('white')
					strokeWeight(1)
					point(this.pos)
					point(_log)
					this.die()
				}
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
