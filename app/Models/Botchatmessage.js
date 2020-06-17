'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Polarity = use('App/Models/Polarity')

class Botchatmessage extends Model {

   savePolarity(reqpolarity, id){
       

       if(reqpolarity > 0){
         Polarity.create({
               polarity:reqpolarity,
               chat_with_bot_msg_id:id,
               state:'positve'
           })
       }else if(reqpolarity<0){
         Polarity.create({
            polarity:reqpolarity*-1,
            chat_with_bot_msg_id:id,
            state:'negative'
        })
       }else if(reqpolarity==0){
     Polarity.create({
            polarity:reqpolarity*-1,
            chat_with_bot_msg_id:id,
            state:'negative'
        })
       }

       return 
   }
}

module.exports = Botchatmessage
