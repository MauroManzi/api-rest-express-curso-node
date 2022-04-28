const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db')
const express = require('express');
//const logger = require('./logger');
const app = express();
const Joi = require('joi');
const morgan = require('morgan');
const config = require('config');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Configuración de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

//uso de un mddleware de tercero - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado...');
    //console.log('morgan habilitado...');
}

//Trabajos con la base de datos
debug('Conectando con la base de datos');

//app.use(logger);

// app.use(function(req,res, next){
//     console.log('autenticando...');
//     next();
// })

const usuarios = [
    {id:1, nombre:'Mauro'},
    {id:2, nombre:'Roberto'},
    {id:3, nombre:'Ana'}
];

app.get('/', (req, res) => {
    res.send('Hola mundo desde express');

}); 

app.get('/api/usuarios', (req, res) => {
    res.send (usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado.');
    res.send(usuario);
});

app.post('/api/usuarios', (req,res) =>{
    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
                id: usuarios.length + 1,
                nombre: value.nombre
            };
            usuarios.push(usuario);
            res.send(usuario); 
    }
    else{
        //  404 Bad request
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

app.put('/api/usuarios/:id',(req,res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
   
    const {error, value} = validarUsuario(req.body.nombre);

    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    
    usuario.nombre = value.nombre;


})


app.delete('/api/usuarios/:id',(req,res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
})


const port = process.env.PORT || 3000;

app.listen(port, () =>{
    // console.log('Escuchando en el puerto ' + port);
    console.log(`Escuchando en el puerto ${port}`);
})


function existeUsuario(id){
    let usuario = usuarios.find(u => u.id === parseInt(id));
    return usuario;
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required(),
    });  
    return schema.validate({ nombre: nom});
}





//app.get(); //petición
// app.post(); //envio de datos hacia el servidor
// app.put(); //actualización
// app.delete(); //eliminación
