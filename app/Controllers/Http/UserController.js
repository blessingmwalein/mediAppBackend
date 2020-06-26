'use strict'
const User = use('App/Models/User')
const Hospital =use('App/Models/Hospital')
const Role = use('App/Models/Role')
const Doctor = use('App/Models/Doctor')
const Patient = use('App/Models/Patient')
const Appointment = use('App/Models/Appointment')
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
            const userInfo = request.all()
            const user = new User()

            user.first_name = userInfo.first_name
            user.last_name =userInfo.last_name
            user.email =userInfo.email
            user.password = userInfo.password
            user.hospital_id = userInfo.hospital_id
            user.role_id=userInfo.role_id

            await user.save()
            return response.status(201).json(user);
    }
    async show({params, response,request}){
        const user =await User.find(params.id)
        // const  hospital =await Hospital.find(user.hospital_id)
        const role=await Role.find(user.role_id)


        const data={
            id:user._id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            hospital_id:user.hospital_id,
            role_id:user.role_id,
            role:role
        }
        return response.json(data)
    }

    async getByUser({params, response}){
        const user = await User.find(params.id)

        const doctor = await Doctor.where({user_id:user._id}).first()

        if(!doctor){
            return response.json({message:"Doctor not found"})
        }

        const patients = await Patient.where({doctor_id:doctor._id.toString()}).fetch()

        const appointments =await Appointment.where({doctor_id:doctor._id.toString()}).fetch()


        const hospital =await Hospital.find(doctor.hospital_id)

        const data={
            id:doctor._id,
            fname : doctor.first_name,
            lname:doctor.last_name,
            email:doctor.email,
            address:doctor.address,
            phone:doctor.phone,
            gender:doctor.gender,
            password:doctor.password,
            appointments:appointments,
            patients:patients,
            hospital:hospital,
            user:user
        }
        return response.json(data)
       
    }
}
module.exports = UserController
