'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class District extends Model {

    hospitals(){
        return this.embedsMany('App/Models/Hospital');
    }
}

module.exports = District
