const io = require('socket.io')(3000,{
    cors: {
        origin: "https://krutik48.github.io/", 
    },
});

const driver_list = [];

io.on("connection", socket => {
    socket.emit('all_driver', driver_list);
    socket.on("send-client-detail", (driverName,X,Y,Angle,Speed)=> {
        driver_list.push({id: socket.id, name: driverName, x: X, y: Y, angle: Angle, speed: Speed});
        // socket.broadcast.emit("receive-name", name)
        // socket.to(room).emit("receive-name", name)  
        socket.broadcast.emit('all_driver', driver_list);
    })
    socket.on("send-client-detail-update", (X,Y,Angle,Speed)=> {
        for(let i = 0; i < driver_list.length; i++){
            if(driver_list[i].id === socket.id){
                driver_list[i].x = X;
                driver_list[i].y = Y;
                driver_list[i].angle = Angle;
                driver_list[i].speed = Speed;
            }
        }
        socket.broadcast.emit('all_driver', driver_list);
    })

    socket.on("send-message",(code,driver_id,msg)=>{
        socket.to(driver_id).emit("receive-message",code,msg,socket.id);
    })

    socket.on("disconnect", () => {
        console.log("disconnect")
        if(driver_list.length > 0){
            for(let i = 0; i < driver_list.length; i++){
                if(driver_list[i].id === socket.id){
                    driver_list.splice(i, 1);
                }
            }
        }
        socket.broadcast.emit("all_driver", driver_list)
    })
    console.log(socket.id)
})

