import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Evento from './models/Evento';
import ctrlAuth from './controllers/authentication'

require('./models/User');
require('./config/passport');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'SECRET_VAR',
  userProperty: 'payload'
});
var ctrlCalendarios = require('./controllers/calendariopropio');

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/calendario', {useNewUrlParser: true}); //Conexion con la base

const connection = mongoose.connection;
connection.once('open', () => {
    
    console.log('MongoDB database connection established successfully!');
});

app.use('/', router);
app.listen(4000, () => console.log('Express server running on port 4000'));

//Mensaje para accesos no autorizados
app.use(function (err, _req, res, _next) {
    
    if (err.name === 'UnauthorizedError') {
      
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});

//Autenticacion
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Listar todos los eventos
router.route('/eventos', auth, ctrlCalendarios.calendarioRead).get((req, res) => {
    
    Evento.find((err, eventos) => {
        
        if (err)
            console.log(err);
        else
            res.json(eventos);
    });
});

//Obtener un evento por id
router.route('/eventos/:id', auth, ctrlCalendarios.calendarioRead).get((req, res) => {
    
    Evento.findById(req.params.id, (err, evento) => {
        
        if (err)
            console.log(err);
        else
            res.json(evento);
    })
});

//Obtener eventos que ocurran en un rango de fechas
router.route('/eventos/rango', auth, ctrlCalendarios.calendarioRead).post((req, res) => {

    const query = Evento.find().or([{fechainicio: {$gte: req.body.fechainicio, $lte: req.body.fechafin}}, {fechafin: {$gte: req.body.fechainicio, $lte: req.body.fechafin}}, {fechainicio: {$lte: req.body.fechainicio}, fechafin: {$gte: req.body.fechafin}}]);
    //const querydos = Evento.find().where('fechafin').gte(req.body.fechainicio).lte(req.body.fechafin);

    query.exec((err, eventos) => {

        if (err)
            console.log(err);
        else {
            //console.log(eventos);
            res.json(eventos);
        }
    });
});

//Agregar un evento
router.route('/eventos/crear', auth, ctrlCalendarios.calendarioRead).post((req, res) => {
    
    let evento = new Evento(req.body);
    
    evento.save()
        .then(issue => {
            
            res.status(200).json({'evento': 'Creado exitosamente'});
        })
        .catch(err => {
            
            res.status(400).send('Falló la creación del evento');
        });
});

//Editar un evento
router.route('/eventos/editar/:id', auth, ctrlCalendarios.calendarioRead).post((req, res) => {
    
    Evento.findById(req.params.id, (err, evento) => {
        
        if (!evento)
            return next(new Error('No se pudo encontrar el evento'));
        else {
            
            evento.nombre = req.body.nombre;
            evento.fechainicio = req.body.fechainicio;
            evento.fechafin = req.body.fechafin;
            evento.lugar = req.body.lugar;
            evento.ramas = req.body.ramas;
            evento.creadopor = req.body.creadopor;

            evento.save().then(issue => {
                
                res.json('Evento editado');
            }).catch(err => {
                
                res.status(400).send('No se pudo editar el evento');
            });
        }
    });
});

//Eliminar un evento
router.route('/eventos/eliminar/:id', auth, ctrlCalendarios.calendarioRead).get((req, res) => {
    
    Evento.findOneAndDelete({_id: req.params.id}, (err, issue) => {
        
        if (err)
            res.json("No fue posible eliminar el evento (" + err + ")");
        else
            res.json('Evento eliminado');
    });
});