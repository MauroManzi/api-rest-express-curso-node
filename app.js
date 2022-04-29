const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db')
const express = require('express');
//const logger = require('./logger');
const app = express();
const morgan = require('morgan');
const config = require('config');
const usuarios = require('./routes/usuarios');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

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

app.get('/', (req, res) => {
    res.send('Hola mundo desde express');

}); 

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    // console.log('Escuchando en el puerto ' + port);
    console.log(`Escuchando en el puerto ${port}`);
})


//app.get(); //petición
// app.post(); //envio de datos hacia el servidor
// app.put(); //actualización
// app.delete(); //eliminación
