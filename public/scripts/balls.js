let ballsArray = []

class Balls {
	constructor(pos, type, effect) {
		this.pos = pos
		this.type = type
		this.effect = effect

		// Drawing
		stroke('white')
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
