let ballsArray = []

class Balls {
	constructor(pos, type) {
		this.pos = pos
		this.size = 12
		this.type = type
		this.color = ballsTypes[type].color

		// Drawing
		this.draw()

		ballsArray.push(this)
	}

	draw() {
		stroke(this.color)
		strokeWeight(this.size)
		point(this.pos.x, this.pos.y)
	}

	erase() {
		stroke(scene.background)
		strokeWeight(this.size + 1)
		point(this.pos.x, this.pos.y)
	}
}

// Effect

// Speed
let speedBallEffect = () => {
	worm.speed = 1.7
	setTimeout(() => {
		worm.speed = worm.basicSpeed
	}, 4000)
}

// Big size
let increaseIntervalID
let bigBallEffect = () => {
	clearInterval(decreaseIntervalID)
	increaseIntervalID = setInterval(() => {
		if (worm.size >= 16) {
			clearInterval(increaseIntervalID)
		} else {
			worm.size++
		}
	}, 100)
	returnToNormalSize()
}

// Tiny size
let decreaseIntervalID
let tinyBallEffect = () => {
	clearInterval(increaseIntervalID)
	decreaseIntervalID = setInterval(() => {
		if (worm.size <= 3) {
			clearInterval(decreaseIntervalID)
		} else {
			worm.size--
		}
	}, 100)
	returnToNormalSize()
}

// Return to normal size
let sizeEffectIntervalID
let returnToNormalSize = () => {
	// Handle delay with interval
	clearInterval(sizeEffectIntervalID)
	worm.sizeEffectTimer = 14
	if (worm.sizeEffectTimer === 14) {
		sizeEffectIntervalID = setInterval(() => {
			worm.sizeEffectTimer--

			// When time is up : return to normal
			if (worm.sizeEffectTimer === 0) {
				clearInterval(sizeEffectIntervalID)

				// Decrease or increase size
				let returnIntervalID = setInterval(() => {
					worm.sizeEffectTimer++
					if (worm.size > worm.basicSize) {
						worm.size--
					} else if (worm.size < worm.basicSize) {
						worm.size++
					} else if (worm.size === worm.basicSize) {
						clearInterval(returnIntervalID)
					}
				}, 100)
			}
		}, 500)
	}
}

// Wall teleport
let wallBallEffect = () => {
	scene.wallEffectTimer += 14

	// Launch the effect only if it is not active, if not : just increase the timer
	if (scene.wallEffectTimer === 14) {
		worm.canGoThroughWall = true

		// Display wall border effect
		let wallIndexes = true
		canvas.canvas.style.border = 'solid yellow 2px'

		let intervalID = setInterval(() => {
			scene.wallEffectTimer--
			// Kill the effect when the time is up
			if (scene.wallEffectTimer === 0) {
				worm.canGoThroughWall = false
				clearInterval(intervalID)
				canvas.canvas.style.border = 'solid black 2px'
			}
			// Toggle the border effect
			else {
				wallIndexes === true ? (wallIndexes = false) : (wallIndexes = true)
				canvas.canvas.style.border = wallIndexes === true ? 'solid yellow 2px' : 'solid black 2px'
			}
		}, 500)
	}
}

// Clear effect
let clearBallEffect = () => {
	// Clear matrix
	scene.isClearing = true
	setTimeout(() => {
		scene.isClearing = false
	}, scene.selfCollisionDelay)
	let newPosLogMatrix = []
	for (let i = 0; i < scene.posLogMatrixWidth; i++) {
		let tab = []
		for (let j = 0; j < scene.posLogMatrixHeight; j++) {
			tab.push([])
		}
		newPosLogMatrix.push(tab)
	}
	posLogMatrix = newPosLogMatrix

	// Clear canvas
	background(scene.background)

	// Redraw effect balls
	for (const _ball of ballsArray) {
		_ball.draw()
	}
}

let ballsTypes = {
	speed: {
		color: 'red',
		effect: speedBallEffect,
	},
	big: {
		color: 'blue',
		effect: bigBallEffect,
	},
	tiny: {
		color: 'green',
		effect: tinyBallEffect,
	},
	wall: {
		color: 'yellow',
		effect: wallBallEffect,
	},
	clear: {
		color: 'pink',
		effect: clearBallEffect,
	},
}
