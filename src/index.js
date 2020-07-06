import './style/main.scss'
import p5 from 'p5'

const P5 = new p5(s)
let canvas = null
function s(sk) {
	sk.setup = () => {
		canvas = sk.createCanvas(600, 600).parent('canvasContainer')
		sk.background(10)
		sk.frameRate(60)
		sk.angleMode(sk.DEGREES)

		worm.setup()
	}

	sk.draw = () => {
		worm.go()
	}
}

let scene = {
	width: 600,
	height: 600,
	spawnMargin: 0.15,
}

let worm = {
	pos: P5.createVector(Math.random() * (scene.width - scene.spawnMargin * scene.width * 2) + scene.spawnMargin * scene.width, Math.random() * (scene.height - scene.spawnMargin * scene.height * 2) + scene.spawnMargin * scene.height),
	dir: Math.round(Math.random() * 360),
	speed: 1.2,
	control: { goRight: false, goLeft: false, sensitivity: 2 },
	skin: [],
	skinFrame: 0,

	setup() {
		console.log(this)
		P5.stroke('white')
		P5.strokeWeight(5)
		P5.point(this.pos.x, this.pos.y)

		this.setupSkin({ red: 20, lightBlue: 20 })

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
		newPos.x = this.pos.x + P5.cos(this.dir) * this.speed
		newPos.y = this.pos.y + P5.sin(this.dir) * this.speed
		this.pos = newPos

		// Drawing line
		if (this.skinFrame < this.skin.length - 1) {
			this.skinFrame++
		} else {
			this.skinFrame = 0
		}
		P5.stroke(this.skin[this.skinFrame])
		P5.line(this.pos.x, this.pos.y, newPos.x, newPos.y)
	},
}
