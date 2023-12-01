const Redis = require('ioredis');

// Configuración de conexión para publicación
const publisher = new Redis({
    host: 'host',
    port: 'port',
    password: 'pass'
});

// Función para enviar mensajes al canal
function enviarMensajeAlCanal(mensaje) {
    publisher.publish('duty_notificaciones', mensaje, (err, count) => {
        if (err) {
            console.error('Error al publicar el mensaje:', err);
        } else {
            console.log(`Mensaje enviado al canal. ${count} suscriptores recibieron el mensaje.`);
        }
    });
}

// Enviar mensajes al canal usando la función definida anteriormente
enviarMensajeAlCanal('Hola!');