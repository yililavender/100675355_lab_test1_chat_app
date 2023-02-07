var express = require('express');
var app = express();
var http = require('http').Server(app);
var cors = require('cors')
var io = require('socket.io')(http)
var bodyParser = require('body-parser')
var userModel = require('./User');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));

app.get(["/", "/login"], async (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.post("/login/username/:username", async (req, res) => {
    const user = await userModel.findOne({ 
        username: req.body.username, 
        password: req.body.password 
    })

    try {
        if (user.length != 0) {
            res.send('username', user.req.body.username)
            res.redirect("/chatroom")
        } else {
            res.send(JSON.stringify({ status: false, message: "No user found" }))
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get("/logout", async (req, res) => {

    res.sendFile(__dirname + '/login.html')
})

app.get("/register", async (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

app.post("/register", async (req, res) => {
    const user = new userModel(req.body)

    try {
        await user.save((err) => {
            if (err) {
                res.send(err)
            } else {
                res.send(user);
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
    res.sendFile(__dirname + "/login.html")
})

app.get("/chatroom", async (req, res) => {
    res.sendFile(__dirname + '/chatroom.html')
})


module.exports = app