const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        console.log(data);

        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                mensaje: 'nombre/sala necesario'
            })
        }

        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala)

        client.broadcast.to(data.sala).emit('usuarioConectado', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('recibirMensaje', crearMensaje('Administrador', `${data.nombre} ingresó al chat`));

        callback(personas);
    });

    client.on('disconnect', () => {
        let personaDesconectada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaDesconectada.sala).emit('usuarioDesconectado', crearMensaje('Administrador', `${personaDesconectada.nombre} ha salido del chat`))
        client.broadcast.to(personaDesconectada.sala).emit('listaUsuarios', usuarios.getPersonasPorSala(personaDesconectada.sala));
    })

    client.on('enviarMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('recibirMensaje', mensaje);

        callback(mensaje);
    });

    //mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});