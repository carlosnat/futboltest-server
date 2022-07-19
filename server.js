const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())
const port = 3000

let server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

let io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('score', (msg) => {
        console.log(msg);
        io.emit('score', msg);
    });
    socket.on('corner', (msg) => {
        console.log(msg);
        io.emit('corner', msg);
    });
    socket.on('foul', (msg) => {
        console.log(msg);
        io.emit('foul', msg);
    });
    socket.on('shoot', (msg) => {
        console.log(msg);
        io.emit('shoot', msg);
    });
    socket.on('timer', (msg) => {
        console.log(msg);
        io.emit('timer', msg);
    });
});

app.use(function(request, response, next) {
    request.io = io;
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})