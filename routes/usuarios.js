const express = require('express');
const ruta = express.Router();
const Joi = require('joi');

const usuarios = [
    {id:1, nombre:'Mauro'},
    {id:2, nombre:'Roberto'},
    {id:3, nombre:'Ana'}
];

ruta.get('/', (req, res) => {
    res.send (usuarios);
});

ruta.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado.');
    res.send(usuario);
});

ruta.post('/', (req,res) =>{
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

ruta.put('/:id',(req,res) =>{
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


ruta.delete('/:id',(req,res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios);
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


module.exports = ruta;