var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function () {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function (resp) {
        // console.log('usuarios conectados ', resp);
        renderizarUsuarios(resp);
    });

});

// escuchar
socket.on('disconnect', function () {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar información
socket.on('recibirMensaje', function (mensaje) {
    console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();
});

socket.on('listaUsuarios', function (mensaje) {
    console.log('Servidor:', mensaje);
    renderizarUsuarios(mensaje);
});

socket.on('usuarioDesconectado', function (mensaje) {
    console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();
});

socket.on('usuarioConectado', function (mensaje) {
    console.log('Se conecta un nuevo usuario ', mensaje);
    renderizarUsuarios(mensaje);
});

//mensajes privados
socket.on('mensajePrivado', function (mensaje) {
    console.log('mensaje privado: ', mensaje);
});