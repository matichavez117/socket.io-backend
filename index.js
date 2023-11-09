const http = require('http');
const server = http.createServer();
const port = 3000;

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('se ha conectado un cliente');

    //Suscripcion al evento send_message (para escucharlo cuando viene del front)
    socket.on('send_message', (data) => {
        io.emit('send_message', data);
    });
});

server.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
});
