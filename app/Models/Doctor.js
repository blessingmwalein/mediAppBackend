'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Doctor extends Model {

    appointments(){
        return this.hasMany('App/Models/Appointment')
    }
}

module.exports = Doctor
