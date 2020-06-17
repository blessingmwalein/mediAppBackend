'use strict'
const Botchat = use('App/Models/Botchat')

class BotchatController {
    async index({response}){

    }

    async store({response, request}){
        const messageInfo = request.only(['patient_id', 'patient_message', 'bot_,message', ])
    }
}

module.exports = BotchatController
