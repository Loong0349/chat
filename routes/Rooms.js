const express = require('express');
const rooms = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const Room = require('../models/Room');
rooms.use(cors());

process.env.SECRET_KEY = 'secret';

const oldData = {
    users: "",
    message: ""
};

const user = {
    users: ""
};

function getData(roomname) {

    Room.findOne({
        where: {
            roomname: roomname
        }
    })
    .then(room => {
        if(room) {
            oldData.users = room.roomuser;
            oldData.message = room.message;
        }
    })
}

function getUser(roomname) {
    
    Room.findOne({
        where: {
            roomname: roomname
        }
    })
    .then(room => {
        user.users = room.roomuser
    })
    .catch(err => {
        res.send('error:' + err);
    });
}

function searchUser(username) {
    let users = "";

    console.log(user);
    let array = user.users.split("@");

    for(let i= 0; i<array.length; i++) {
        if (array[i] == username) {
            array.splice(i, 2);
        }
    }
    console.log(array);
    if(array.length != 1) {
        users = array.join("@");
    } else {
        users = "@";
    }
    console.log(users);
    return users;
}

rooms.post('/join', (req, res) => {


    getData(req.body.roomname);

    const today = new Date();
    var roomData = {
        roomname: req.body.roomname,
        roomuser: "@" + req.body.username + "@",
        message: "@",
        created: today
    };

    Room.findOne({
        where: {
            roomname: req.body.roomname
        }
    })
    .then(room => {
        if(!room) {
            Room.create(roomData)
            .then(() => {
                res.json({msg:"created"});
            })
            .catch(err => {
                res.send('error:' + err);
            })
        } else if (room){
            Room.findOne({
                where: {
                    [Op.and]: {
                        roomuser: {
                            [Op.substring]: "@" + req.body.username + "@"
                        },
                        roomname: req.body.roomname
                    }
                }
            })
            .then(room => {
                if(!room) {
                    Room.update({
                        roomuser: oldData.users + req.body.username + "@"
                    }, {
                        where: {
                            roomname: req.body.roomname
                        }
                    })
                    .then( () => {
                        res.json({msg:"updated"});
                    })
                    .catch(err => {
                        res.send('error:' + err);
                    })
                }
                else {
                    res.json({msg:"updated"});
                }
            })
            .catch(err => {
                res.send('error:' + err);
            })
        }
    })
    .catch(err => {
        res.send('error:' + err);
    });

})

rooms.post('/availableroom', (req,res) => {
    Room.findAll({
        where: {
            roomuser: {
                [Op.substring]: "@" + req.body.username + "@"
            }
        }
    })
    .then(room => {
        let chatroom = {
            rooms: []
        };

        for (i=0;i<room.length;i++) {
            chatroom.rooms.push(room[i].dataValues);
        }

        let token = jwt.sign(chatroom, process.env.SECRET_KEY, {
            expiresIn: 1440
        });
        res.json({token: token});
    })
    .catch(err => {
        res.send('error:' + err);
    });
})

rooms.post('/message', (req,res) => {
    Room.findOne({
        where: {
            roomname: req.body.roomname
        }
    })
    .then(msg => {
        let token = jwt.sign(msg.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
        });
        res.json({token: token});
    })
    .catch(err => {
        res.send('error:' + err);
    });
})

 rooms.post('/leave', (req,res) => {
    getUser(req.body.roomname);

    let oldUser = searchUser(req.body.username);

    Room.update({
        roomuser: oldUser
    },{
        where: {
            roomname: req.body.roomname
        }
    })
    .then(() => {
        res.json({msg:"updated"});
    })
    .catch(err => {
        res.send('error:' + err);
    });

})

module.exports = rooms;