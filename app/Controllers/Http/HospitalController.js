'use strict'
const Hospital = use('App/Models/Hospital')
const District = use('App/Models/District')
const Doctor =use('App/Models/Doctor')
const Patient =use('App/Models/Patient')
const Appointment =use('App/Models/Appointment')


class HospitalController {
    async index({response}){

        return response.json(await Hospital.all())
    }
    async show({params, response}){
       
        const hospital =await Hospital.find(params.id)
        const district =await District.find(hospital.district_id)
        const doctors=await Doctor.where('hospital_id').eq(params.id).fetch()

        const patients=await Patient.where({hospital_id:params.id}).fetch()
        const appointments =await Appointment.where({hospital_id: params.id}).fetch()
        return response.json({
            _id:hospital._id,
            name:hospital.name, 
            address:hospital.address,
            district:district,
            doctors:doctors,
            patients:patients,
            appointments:appointments
        })
    }
    async store({request, response}){
        const hospitalInfo =request.only(
            ['name','district_id', 'address', ])
        
        const hospital =await Hospital.create({
            name:hospitalInfo.name,
            district_id:hospitalInfo.district_id,
            address:hospitalInfo.address,
            location:hospitalInfo.location
        })
        return response.status(201).json(hospital)
    }    
}
module.exports = HospitalController
