'use strict'
const Doctor =use('App/Models/Doctor')
const Patient =use('App/Models/Patient')
const Appointment =use('App/Models/Appointment')
const Hospital =use('App/Models/Hospital')
const User =use('App/Models/User')

const Hash = use('Hash')

class DoctorController {

    async index({params, response}){
        const doctors = await Doctor.where('hospital_id').eq(params.id).fetch()

        return response.json(doctors)
    }
    async store({response, request}){
        const doctorInfo =request.only([
            'first_name', 
            'last_name', 
            'email',
            'phone', 
            'hospital_id',
            'address',
            'gender',
            'password',
            'role_id'
            ])

            const user = new User()

            user.first_name = doctorInfo.first_name
            user.last_name =doctorInfo.last_name
            user.email =doctorInfo.email
            user.password = doctorInfo.password
            user.hospital_id = doctorInfo.hospital_id
            user.role_id = doctorInfo.role_id
            await user.save()

        const doctor = await Doctor.create({
            first_name:doctorInfo.first_name,
            last_name:doctorInfo.last_name,
            email:doctorInfo.email,
            phone:doctorInfo.phone,
            hospital_id:doctorInfo.hospital_id,
            address:doctorInfo.address,
            gender:doctorInfo.gender,
            user_id:user._id
        })
        return response.status(201).json({message:"Doctor saved"})
    }
    async show({params, response }){
        const doctor = await Doctor.find(params.id)

        if(!doctor){
            return response.json({message:"Doctor not found"})
        }
        //const patients = 
        const patients = await Patient.where({doctor_id:doctor._id.toString()}).fetch()

        const appointments =await Appointment.where({doctor_id:doctor._id.toString()}).fetch()

        const user =await User.find(doctor.user_id)

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
    async getByUser({params, response}){
        const doctor = await Doctor.where({user_id:'5ef2a0d87634441bbcacebee'}).first()

        if(!doctor){
            return response.json({message:"Doctor not found"})
        }

        

        const patients = await Patient.where({doctor_id:doctor._id}).fetch()

        const appointments =await Appointment.where({doctor_id:doctor._id}).fetch()

        const user =await User.find(doctor.user_id)

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
    async update({params, request, response}){
        const doctorInfo =request.only([
            'first_name', 
            'last_name', 
            'email',
            'phone', 
            'address',
            'gender',
            'hospital_id',
            'user_id'
            ])

        const doctor = await Doctor.find(params.id)
        if(!doctor){
            return response.status(404).json({message:"Doctor not found"})
        }
        doctor.merge({
            first_name: doctorInfo.first_name,
            last_name:doctorInfo.last_name,
            email:doctorInfo.email,
            phone:doctorInfo.phone,
            address:doctorInfo.address,
            gender:doctorInfo.gender,
            hospital_id:doctorInfo.hospital_id,
            user_id:doctorInfo.user_id
        })
        await doctor.save()
        return response.status(200).json({ message:"Doctor updated" })
    }
    async delete({params, response}){
        const doctor = await Doctor.find(params.id)
        if(!doctor){
            return response.status(404).json({data:"No doctor found"})
        }
        await doctor.delete()
        return response.status(204).json({data:"Doctor deleted"})
    }

    async login({request, response, auth}){
        const{email, password} = request.only(['email', ['password']])

        const token = await auth.attempt(email, password)
        return response.json(token)
    }
}


module.exports = DoctorController
