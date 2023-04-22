const io = require('socket.io')(3000,{
    cors: {
        origin: "http://localhost:8080",
    },
});

io.on("connection", socket => {
    socket.on("send-name", (name,room)=> {
        console.log(room)
        if(room===''){
            socket.broadcast.emit("receive-name", name)
        }
        else{
            socket.to(room).emit("receive-name", name)  
        }
        console.log(name)
    })
})

