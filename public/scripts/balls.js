let ballsArray = []

class Balls {
	constructor(pos, type) {
		this.pos = pos
		this.size = 12
		this.type = type
		this.color = ballsTypes[type].color

		// Drawing
		this.draw()
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

let bigBallEffect = () => {
	increaseEffect('size', 15, 'basicSize', 14, 'sizeEffectTimer', 'increaseSizeIntervalID', 'decreaseSizeIntervalID', 'returnSizeIntervalID')
}
let tinyBallEffect = () => {
	decreaseEffect('size', 4, 'basicSize', 14, 'sizeEffectTimer', 'increaseSizeIntervalID', 'decreaseSizeIntervalID', 'returnSizeIntervalID')
}

// Big size
let increaseEffect = (parameter, value, basicValue, delay, effectTimer, increaseIntervalID, decreaseIntervalID, returnIntervalID) => {
	clearInterval(worm[decreaseIntervalID])
	worm[increaseIntervalID] = setInterval(() => {
		if (worm[parameter] >= value) {
			clearInterval(worm[increaseIntervalID])
		} else {
			worm[parameter]++
		}
	}, 100)
	returnToNormalEffect(parameter, basicValue, delay, effectTimer, returnIntervalID)
}

// Tiny size
let decreaseEffect = (parameter, value, basicValue, delay, effectTimer, increaseIntervalID, decreaseIntervalID, returnIntervalID) => {
	clearInterval(worm[increaseIntervalID])
	worm[decreaseIntervalID] = setInterval(() => {
		if (worm[parameter] <= value) {
			clearInterval(worm[decreaseIntervalID])
		} else {
			worm[parameter]--
		}
	}, 100)
	returnToNormalEffect(parameter, basicValue, delay, effectTimer, returnIntervalID)
}

// Return to normal size
let returnToNormalEffect = (parameter, basicValue, delay, effectTimer, returnIntervalID) => {
	// Handle delay with interval
	clearInterval(worm[returnIntervalID])
	worm[effectTimer] = delay
	if (worm[effectTimer] === delay) {
		worm[returnIntervalID] = setInterval(() => {
			worm[effectTimer]--

			// When time is up : return to normal
			if (worm[effectTimer] === 0) {
				clearInterval(worm[returnIntervalID])

				// Decrease or increase size
				let intervalID = setInterval(() => {
					worm[effectTimer]++
					if (worm[parameter] > worm[basicValue]) {
						worm[parameter]--
					} else if (worm[parameter] < worm[basicValue]) {
						worm[parameter]++
					} else if (worm[parameter] === worm[basicValue]) {
						clearInterval(intervalID)
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

	// Clear pos historic for die animation
	worm.posHistoric = []

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
