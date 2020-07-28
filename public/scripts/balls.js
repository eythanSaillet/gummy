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
let bigBallEffect = () => {
	let increaseIntervalID = setInterval(() => {
		worm.size++
		if (worm.size === 15) {
			clearInterval(increaseIntervalID)
		}
	}, 100)
	setTimeout(() => {
		let decreaseIntervalID = setInterval(() => {
			worm.size--
			if (worm.size === worm.basicSize) {
				clearInterval(decreaseIntervalID)
			}
		}, 100)
	}, 4000)
}

// Tiny size
let tinyBallEffect = () => {
	let decreaseIntervalID = setInterval(() => {
		worm.size--
		if (worm.size === 4) {
			clearInterval(decreaseIntervalID)
		}
	}, 100)
	setTimeout(() => {
		let increaseIntervalID = setInterval(() => {
			worm.size++
			if (worm.size === worm.basicSize) {
				clearInterval(increaseIntervalID)
			}
		}, 100)
	}, 4000)
}

// Wall teleport
let wallBallEffect = () => {
	worm.canGoThroughWall = true

	// Display wall effect
	let wallIndexes = true
	canvas.canvas.style.border = 'solid yellow 2px'
	let intervalID = setInterval(() => {
		wallIndexes === true ? (wallIndexes = false) : (wallIndexes = true)
		canvas.canvas.style.border = wallIndexes === true ? 'solid yellow 2px' : 'solid black 2px'
	}, 500)

	// Kill the effect after a delay
	setTimeout(() => {
		worm.canGoThroughWall = false

		clearInterval(intervalID)
		canvas.canvas.style.border = 'solid black 2px'
	}, 6000)
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
