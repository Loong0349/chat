const express = require('express');
const users = express.Router();
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/User');
users.use(cors());

process.env.SECRET_KEY = 'secret';

//REGISTER & LOGIN
users.post('', (req, res) => {

    if(req.body.type == 'register') {

        const today = new Date();
        var userData = {
            username: req.body.username,
            password: req.body.password,
            roomjoin: "",
            created: today
        };

        User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            if(!user) {
                const hash = bcrypt.hashSync(userData.password, 10);
                userData.password = hash;
                User.create(userData)
                .then (() => {
                    res.json({msg:"created"})
                })
                .catch(err => {
                    res.send('error : ' + err);
                });
            } else {
                res.send('Username has been taken');
            }
        })
        .catch(err => {
            res.send('error : ' + err);
        });
    }

    else if(req.body.type == 'login') {

        User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            if (!user) {
                res.send("Username does not exist");
            }
            else if (bcrypt.compareSync(req.body.password, user.password)) {
                res.json({msg:"logged in"})
            }
            else {
                res.send('Wrong username and password combination');
            }
        })
        .catch(err => {
            res.send('error : ' + err);
        });
    }

    
});

users.post('/onlineusers', (req,res) => {
    User.findAll({
        where: {
            roomjoin: req.body.roomname
        }
    })
    .then(user => {
        let usersinroom = {
            user: []
        };

        for (i=0;i<user.length;i++) {
            usersinroom.user.push(user[i].dataValues);
        }

        let token = jwt.sign(usersinroom, process.env.SECRET_KEY, {
            expiresIn: 1440
        });
        res.json({token: token});
    })
    .catch(err => {
        res.send('error:' + err);
    });
})

users.post('/leave', (req,res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then((user) => {
        if (user) {
            User.update({
                roomjoin: ""
            }, {
                where: {
                    username: req.body.username
                }
            })
            .catch(err => {
                res.send('error:' + err);
            });
    
            res.json({msg:"updated"});
        }
    })
    .catch(err => {
        res.send('error:' + err);
    });
})

module.exports = users;