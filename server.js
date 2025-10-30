const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Serve your static HTML file
app.use(express.static(__dirname))

// To store all connected usernames
const users = new Set()

io.on('connection', (socket) => {

    // When a user joins
    socket.on('join', (user_name) => {
        socket.username = user_name
        users.add(user_name)
        io.emit('msg', `${user_name} has joined the chat`)
        io.emit('userList', Array.from(users)) 
    })

    // When a user sends a message
    socket.on('chatmessage', (inputvalue) => {
        io.emit('msg', `${socket.username}: ${inputvalue}`)
    })

    // When a user disconnects
    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username)   
            io.emit('msg', `${socket.username} has left the chat`)
            io.emit('userList', Array.from(users)) 
        }
    })
})

const port = 3000
server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
