'use strict'
const User = use('App/Models/User')
const Hospital =use('App/Models/Hospital')


class UserController {

    async index({response}){
        const users =await User.all()

        return response.json(users)
    }
    async login({request, response, auth}){
        const{email, password} = request.only(['email', ['password']])

        const token = await auth.attempt(email, password)
        return response.json(token)
    }
    async register({request, response}){
            const userInfo = request.only(['first_name', 'last_name', 'email', 'password', 'hospital_id'])

            const user = new User()

            user.first_name = userInfo.first_name
            user.last_name =userInfo.last_name
            user.email =userInfo.email
            user.password = userInfo.password
            user.hospital_id = userInfo.hospital_id

            await user.save()
            return response.status(201).json(user);
    }
    async show({params, response,request}){
        const user =await User.find(params.id)
        // const  hospital =await Hospital.find(user.hospital_id)
        const data={
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
           
        }
        return response.json(data)
    }
}
module.exports = UserController
