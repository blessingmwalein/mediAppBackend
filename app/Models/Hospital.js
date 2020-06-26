'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Hospital extends Model {

    district(){
        return this.embedsOne('App/Models/District')
    }
    appointments(){
        return this.hasMany('App/Models/Appointment')
    }
    patients(){
        return this.hasMany('App/Models/Patient', '_id', 'hospital_id')
    }
}

module.exports = Hospital
