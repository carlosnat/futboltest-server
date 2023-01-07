const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const trilat = require('trilat');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())
const port = 3030

let server = app.listen(process.env.PORT || port, () => {
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

    socket.on('lineup', (msg) => {
        console.log(msg);
        io.emit('lineup', msg);
    });
});

app.use(function (request, response, next) {
    request.io = io;
    next();
});

app.options('/', cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/rssi-measures', cors(), (req, res) => {
    /*const macVerde = 'DB:85:2D:78:87:E1'
    const macNegra = 'E2:3D:21:BC:4D:94'
    const macBlanca = 'C2:02:20:33:C2:62'*/
    
    const input = req.body.map( item => {
        item.distance = getRange(item.rssiConst, item.rssi)
        console.log('received', [item.address, parseFloat(item.posx), parseFloat(item.posy), parseFloat(item.rssiConst), item.distance])
        return [parseFloat(item.posx), parseFloat(item.posy), item.distance]
    })

    const output = trilat(input);
    //console.log(output)
    res.send(output)
})

const getRange = (txCalibratedPower, rssi) => {
    var ratio_db = parseFloat(txCalibratedPower) - parseFloat(rssi);
    const N = 2
    const denominador = 10*N
    var ratio_linear = Math.pow(10, ratio_db / denominador);

    var r = Math.sqrt(ratio_linear);
    return r;
}