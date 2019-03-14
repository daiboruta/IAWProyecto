import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Evento = new Schema({
    
    nombre: {

        type: String
    },

    fechainicio: {

        type: Date
    },

    fechafin: {

        type: Date
    },

    lugar: {

        type: String
    },

    ramas: {

        type: [String]
    },

    creadopor: {

        type: String //mas adelante acá va el user
    }
});

export default mongoose.model('Evento', Evento);