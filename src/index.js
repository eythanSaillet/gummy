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
	}

	sk.draw = () => {}
}
