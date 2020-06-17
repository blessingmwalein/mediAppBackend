'use strict'
const Doctor =use('App/Models/Doctor')
const Patient =use('App/Models/Patient')
const Appointment =use('App/Models/Appointment')
const Hospital =use('App/Models/Hospital')


const Hash = use('Hash')

class DoctorController {

    async index({response}){
        const doctors = await Doctor.all()

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
            'password'
            ])
        const doctor = await Doctor.create({
            first_name:doctorInfo.first_name,
            last_name:doctorInfo.last_name,
            email:doctorInfo.email,
            phone:doctorInfo.phone,
            hospital_id:doctorInfo.hospital_id,
            address:doctorInfo.address,
            gender:doctorInfo.gender,
            password:await Hash.make(doctorInfo.password)
        })

        return response.json(doctor)
    }

    async show({params, response }){
        const doctor = await Doctor.find(params.id)
        //const patients = 
        const patients = await Patient.where('doctor_id').eq(doctor.id).fetch()

        const appointments =await Appointment.where('doctor_id').eq(doctor.id).fetch()

        const hospital =await Hospital.find(doctor.hospital_id)
        const data={
            fname : doctor.first_name,
            lname:doctor.last_name,
            email:doctor.email,
            address:doctor.address,
            phone:doctor.phone,
            gender:doctor.gender,
            appointments:appointments,
            patients:patients,
            hospital:hospital
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
            ])

        const doctor = await Doctor.find(params.id)
        if(!doctor){
            return response.status(404).json({data:"Data not found"})
        }
        doctor.merge({
            first_name: doctorInfo.first_name,
            last_name:doctorInfo.last_name,
            email:doctorInfo.email,
            phone:doctorInfo.phone,
            address:doctorInfo.address
        })
       
        await doctor.save()

        return response.status(200).json(doctor)
    }
    async delete({params, response}){
        const doctor = await Doctor.find(params.id)

        if(!doctor){
            return response.status(404).json({data:"No doctor found"})
        }

        await doctor.delete()

        return response.status(204).json({data:"doctor deleted"})
    }
}


module.exports = DoctorController