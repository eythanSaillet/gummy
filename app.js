let express = require('express')
let app = express()
let port = process.env.PORT || 3000
let server = app.listen(port)

app.use(express.static('public'))

console.log('Server is running')

let socket = require('socket.io')
let io = socket(server)

io.sockets.on('connection', newConnection)

function newConnection(socket) {
	console.log('New connection : ' + socket.id)
	socket.emit('id', socket.id)
}
