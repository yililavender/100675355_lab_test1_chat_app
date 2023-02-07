var chatRoom = require('./ChatRoom.js');
var messageModel = require('./Message')
var cors = require('cors')

var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors())
app.use(express.json());
app.use(chatRoom);

var dbUrl = 'mongodb+srv://yililavender:eAqZVy4SZiJU9rPy@cluster0.asthkb5.mongodb.net/comp3133_labs?retryWrites=true&w=majority'
mongoose.connect(dbUrl , { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('mongodb connected',err);
    }else{
        console.log('Successfully mongodb connected');
    }
})

io.on('connection', (socket) => {
  console.log('Connection created...')

  socket.emit('welcome', `Welcome to Chat. Your ID is ${socket.id}`)
  //New message from client
  socket.on('message', (data) => {
    const msg = {
      sender: socket.id,
      message: data.message,
      from_user: data.username
    }
     //These will send to all the client except sender
    socket.broadcast.emit('newMessage', msg)
    })

  //Join New room
  socket.on('join', (roomName) => {
        socket.join(roomName)
        //Send all client 
        const msg = {
            from_user: username,
            message: 'Joined the room successfully'
        }
        socket.broadcast.to(roomName).emit('newMessage', msg)
  })

  socket.on('room_messages', (data) => {
    const msg = new messageModel()

    const message = {
      name: data.username,
      msg: data.message,
    }
    //To all client in room
    socket.broadcast.to(data.room).emit('newMessage', message)
  })

  socket.on("typing", () => {
    socket.broadcast.emit({ user: socket.username }, " is typing...")
  })

  //Dicsonected
    socket.on('disconnect', () => {
        console.log(`${socket.id} Client Disconnected...`)
    })
})

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});