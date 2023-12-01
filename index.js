const http = require('http');
const server = http.createServer();
const port = 3000;
const Redis = require('ioredis');

const io = require('socket.io')(server, {
    cors: { origin: '*' }
});

//Web socket: Validar token
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    // Verificar y validar el token aquí (usando jsonwebtoken, por ejemplo)
    if (token) {
        return next(); // Permitir la conexión
    } else {
        console.log('Error al reconocer el token');
        return next(new Error('Autenticación fallida')); // Rechazar la conexión
    }
});

//Web socket: evento connection
io.on('connection', (socket) => {
    //Token del usuario
    let userId = socket.handshake.auth.userId;
    //Uno el id de usuario a una sala
    socket.join(userId);

    console.log('Un usuario se ha conectado, ID: ' + userId + ' socketId: ' + socket.id);

    //Web socket: Suscripcion al evento send_message (para escucharlo cuando viene del front)
    socket.on('send_message', (data) => {
        io.emit('send_message', data);
    });

    //Redis: Manejar los mensajes recibidos en el canal suscripto
    subscriber.on('message', (channel, message) => {
        console.log(`Mensaje recibido en el canal '${channel}': ${message}`);
        //Web socket: emitir un mensaje con web socket al front
        // io.emit('notification', message.message);

        //Web socket: Enviar un mensaje al usuario específico 
        if (JSON.parse(message).userId) {
            if (JSON.parse(message).userId === userId) {
                io.to(userId).emit('notification', JSON.parse(message).message);
            } else {
                console.log('error en la comparacion de id');
            };
        };
    });
});

//Express: Aviso de que el servidor esta levantado
server.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
});

//Redis connection
const subscriber = new Redis({
    host: 'host',
    port: 'port',
    password: 'pass'
});

//Redis: Suscribirse a un canal
subscriber.subscribe('duty_notificaciones', (err, count) => {
    if (err) {
        console.error('Error al suscribirse:', err);
    } else {
        console.log(`Suscripto al canal. Hay ${count} suscriptores.`);
    }
});

//Redis: Manejar errores generales de Redis
subscriber.on('error', (err) => {
    console.error('Error en conexión Redis:', err);
});