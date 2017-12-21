global.uMap = new Map();
global.sMap = new Map();
exports.chat = (io, socket) => {
    let username = socket.handshake.query.username;
    let sid = Object.keys(io.sockets.sockets).pop();
    global.uMap.set(username, sid);
    global.sMap.set(sid, socket);
    io.emit('onlines', [...global.uMap.keys()]);
    socket.on('message', msg => {
        let obj = JSON.parse(msg);
        let _sid = global.uMap.get(obj.to);
        global.sMap.get(_sid).send(msg);
    })
    socket.on('disconnect', reason => {
        let sidArr = Object.keys(io.sockets.sockets);
        for (let key of global.sMap.keys()) {
            if (!sidArr.includes(key)) {
                global.sMap.delete(key);
            }
        }
        for (let [key, value] of global.uMap.entries()) {
            if (!sidArr.includes(value)) {
                global.uMap.delete(key);
            }
        }
        io.emit('onlines', [...global.uMap.keys()]);
    })
}
exports.chatRoom = (req, res) => {
    res.render('chatroom', {
        user: req.session.user,
    });
}