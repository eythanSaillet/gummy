let ballsArray = []

class Balls {
	constructor(pos, type) {
		this.pos = pos
		this.type = type

		// Drawing
		stroke(ballsTypes[type].color)
		strokeWeight(10)
		point(this.pos.x, this.pos.y)

		ballsArray.push(this)
	}

	erase() {
		stroke(10)
		strokeWeight(12)
		point(this.pos.x, this.pos.y)
	}
}

// Effect

// Speed
let speedBallEffect = () => {
	const tempSpeed = worm.speed
	worm.speed = 1.7
	setTimeout(() => {
		worm.speed = tempSpeed
	}, 4000)
}
let bigBallEffect = () => {
	const tempBig = worm.size
	worm.size = 15
	setTimeout(() => {
		worm.size = tempBig
	}, 4000)
}
let tinyBallEffect = () => {
	const temptiny = worm.size
	worm.size = 4
	setTimeout(() => {
		worm.size = temptiny
	}, 4000)
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
}
