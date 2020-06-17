'use strict'
const Botchatmessage = use('App/Models/Botchatmessage')
const Botchat = use('App/Models/Botchat')
const Polarity =use('App/Models/Polarity')

class BotchatmessageController {

    async store({request, response}){

        const botmessageinfo = request.only(['bot_message', 'patient_message','time_to_reply', 'polarity','patient_id'])

        const botchat = await Botchat.create({
            patient_id:botmessageinfo.patient_id
        });
        
        const  botmessage= await Botchatmessage.create({
            bot_message:botmessageinfo.bot_message,
            patient_message:botmessageinfo.patient_message,
            time_to_reply:botmessageinfo.time_to_reply,
            bot_chat_id:botchat.id
        })

       const polarity = botmessage.savePolarity(botmessageinfo.polarity, botmessage._id)

        return response.json({message:botmessage, polarity:polarity})
    }

    async show({response, params}){
        const botchatmessage = await Botchatmessage.find(params.id)

        const polarity = await Polarity.where('chat_with_bot_msg_id').eq(botchatmessage._id).first()

        const botchat=await Botchat.where('id').eq(botchatmessage.bot_chat_id).first()

        const data ={
            _id:botchatmessage._id,
            patient_message:botchatmessage.patient_message,
            bot_message:botchatmessage.bot_message,
            time_to_reply:botchatmessage.time_to_reply,
            polarity:polarity,
            botchat:botchat
        }

        return response.json(data)
    }

    async polarity({response}){
        return response.json(await Polarity.all())
    }
}

module.exports = BotchatmessageController
