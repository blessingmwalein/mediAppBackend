'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Polarity extends Model {

    savePolarity(request, id){
         const polarity = new Polarity()

        if(request.polarity > 0){
            polarity.polarity=request.polarity
            polarity.chat_with_bot_msg_id=id
            polarity.state='positive'
            polarity.save()
        }else if(request.polarity<0){
            polarity.polarity =request.polarity*-1
            polarity.chat_with_bot_msg_id=id
            polarity.state='negative'
            polarity.save()
        }else if(request.polarity==0){
            polarity.polarity =request.polarity
            polarity.chat_with_bot_msg_id=id
            polarity.state='neutral'
            polarity.save();
        }
    }
}

module.exports = Polarity
