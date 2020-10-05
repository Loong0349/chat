const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require('./models/User');
const Room = require('./models/Room');

//ROUTERS
const Users = require('./routes/Users');
const Rooms = require('./routes/Rooms');

app.use("/users", Users);
app.use("/rooms", Rooms);

const formatMessage = require('./utils/message');
const botName = 'ChatRoom Bot';

//PORT
const PORT = process.env.PORT || 3000;

//SERVER
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Listening on port : ${PORT}`));

//SOCKET.IO
const io = socketio(server);
io.on('connection', (socket) => {

    const userInfo = {
        username : string = "",
        room : string = ""
    };

    const oldData = {
        message: ""
    }

    //WHEN USER JOIN ROOM
    socket.on('joinRoom', ({username, room}) => {
        userInfo.username = username;
        userInfo.room = room;

        User.findOne({
            where: {
                username: username
            }
        })
        .then(() => {
            User.update({
                roomjoin: room
            }, {
                where: {
                    username: username
                }
            })
            .catch(err => {
                res.send('error:' + err);
            });
        })
        .catch(err => {
            res.send('error:' + err);
        });

        socket.join(room);

        socket.emit('message', formatMessage(botName, 'Welcome to ChatRoom!'));

        socket.broadcast.to(room).emit('message', formatMessage(botName, `${username} has joined the chat`));

        io.to(room).emit("updateUser");

    });

    //LISTEN TO USER'S MESSAGE
    socket.on('chatMessage', (msg) => {
        io.to(userInfo.room).emit('message', formatMessage(userInfo.username, msg));

        getData(userInfo.room);

        Room.findOne({
            where: {
                roomname: userInfo.room
            }
        })
        .then(() => {
            Room.update({
                message: oldData.message + JSON.stringify(formatMessage(userInfo.username, msg)) + "@"
            }, {
                where: {
                    roomname: userInfo.room
                }
            })
            .catch(err => {
                console.log('error:' + err);
            });
            
        })
        .catch(err => {
            console.log('error:' + err);
        });
    });

    function getData(roomname) {

        Room.findOne({
            where: {
                roomname: roomname
            }
        })
        .then(room => {
            if(room) {
                oldData.message = room.message;
            }
        })
        .catch(err => {
            console.log('error:' + err);
        });
    }

    //WHEN USER DISCONNECT
    socket.on('disconnect', () => {

        User.findOne({
            where: {
                username: userInfo.username
            }
        })
        .then(() => {
            User.update({
                roomjoin: ""
            }, {
                where: {
                    username: userInfo.username
                }
            })
            .catch(err => {
                console.log('error:' + err);
            });
        })
        .catch(err => {
            console.log('error:' + err);
        });

        io.to(userInfo.room).emit('message', formatMessage(botName, `${userInfo.username} has left the chat`));

        io.to(userInfo.room).emit("updateUser");
    });
});