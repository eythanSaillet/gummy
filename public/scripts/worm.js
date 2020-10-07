// Import skins
let skins
window
	.fetch('../skins.json')
	.then((_response) => _response.json())
	.then((_skins) => {
		skins = _skins
	})

let worm = {
	id: null,
	canGo: false,
	pos: null,
	// dir: Math.round(Math.random() * 360),
	dir: 90,
	basicSpeed: 1,
	speed: null,
	basicSize: 8,
	size: null,
	control: { goRight: false, goLeft: false, sensitivity: 1.5 },
	skin: [],
	skinFrame: 0,
	dead: false,
	canGoThroughWall: false,
	sizeEffectTimer: 0,
	increaseSizeIntervalID: null,
	decreaseSizeIntervalID: null,
	returnSizeIntervalID: null,
	posHistoric: [],

	setup() {
		this.id = socket.id

		this.canGo = true

		this.pos = createVector(Math.random() * (scene.width - scene.spawnMargin * scene.width * 2) + scene.spawnMargin * scene.width, Math.random() * (scene.height - scene.spawnMargin * scene.height * 2) + scene.spawnMargin * scene.height)

		this.speed = this.basicSpeed
		this.size = this.basicSize

		strokeWeight(this.size)
		this.setupSkin(skins.acidTong)

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

		// Send pos to server
		socket.emit('go', { id: worm.id, pos: { x: newPos.x, y: newPos.y }, size: worm.size, skin: worm.skin[worm.skinFrame] })

		// Fill pos historic for dead animation
		this.posHistoric.push([newPos, worm.size])
	},

	// fillPosLogMatrix() {
	// 	let pos = this.pos
	// 	let size = this.size
	// 	setTimeout(() => {
	// 		if (!scene.isClearing) {
	// 			posLogMatrix[Math.floor(pos.x / 60)][Math.floor(pos.y / 60)].push([pos, size])
	// 		}
	// 	}, scene.selfCollisionDelay)
	// },

	// fillPosLogMatrix = (info) => {
	// let pos = createVector(info.pos.x, info.pos.y)
	// let size = info.size
	// 	setTimeout(() => {
	// 		if (!scene.isClearing) {
	// 			posLogMatrix[Math.floor(info.pos.x / 60)][Math.floor(info.pos.y / 60)].push([pos, size])
	// 		}
	// 	}, scene.selfCollisionDelay)
	// }

	dieTest() {
		// Map border test
		if (this.pos.x < 0 || this.pos.x > scene.width || this.pos.y < 0 || this.pos.y > scene.height) {
			if (this.canGoThroughWall) {
				this.pos.x < 0 ? (this.pos.x = this.pos.x = scene.width) : null
				this.pos.x > scene.width ? (this.pos.x = 0) : null
				this.pos.y < 0 ? (this.pos.y = scene.height) : null
				this.pos.y > scene.height ? (this.pos.y = 0) : null
				this.posHistoric.push(null)
			} else {
				this.die()
			}
		}
		// Worms collision test
		else {
			const testRange = [
				[0, 1],
				[1, 1],
				[1, 0],
				[1, -1],
				[0, -1],
				[-1, -1],
				[-1, 0],
				[-1, 1],
			]
			// Testing collision in each case around the player
			for (const _range of testRange) {
				// Test if the case exist
				if (typeof posLogMatrix[Math.floor((this.pos.x + _range[0]) / 60)][Math.floor((this.pos.y + _range[1]) / 60)] !== 'undefined') {
					for (const _log of posLogMatrix[Math.floor((this.pos.x + _range[0]) / 60)][Math.floor((this.pos.y + _range[1]) / 60)]) {
						if (_log[0].dist(this.pos) < _log[1] / 2 + this.size / 2 && this.dead === false) {
							stroke('white')
							strokeWeight(1)
							point(this.pos)
							point(_log)
							this.die()
						}
					}
				}
			}

			// Fill posLogMatrix
			fillPosLogMatrix(worm)
		}
	},

	die() {
		this.dead = true
		console.log('dead')

		// Play animation
		dieAnimation(this.posHistoric)

		// Send death info to server
		socket.emit('die', worm.id)
	},

	ballsTest(colors) {
		if (colors.front === 255 || colors.left === 255 || colors.right === 255) {
			return false
		} else {
			return true
		}
	},
}
