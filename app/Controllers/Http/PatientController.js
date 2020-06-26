'use strict'
const Patient = use('App/Models/Patient')
const Doctor = use('App/Models/Doctor')
const Appointment = use('App/Models/Appointment')
const Hospital = use('App/Models/Hospital')
const User = use('App/Models/User')


const Hash = use('Hash')

class PatientController {
    async index({ params, response }) {

        const patients = await Patient.where('hospital_id').eq(params.id).fetch()

        return response.json(patients)
    }

    async store({ response, request }) {
        const patientInfo = request.only([
            'first_name',
            'last_name',
            'email',
            'phone',
            'doctor_id',
            'hospital_id',
            'address',
            'gender',
            'password',
            'role_id'
        ])

        const user = new User()

        user.first_name = patientInfo.first_name
        user.last_name = patientInfo.last_name
        user.email = patientInfo.email
        user.password = patientInfo.password
        user.hospital_id = patientInfo.hospital_id
        user.role_id = patientInfo.role_id
        await user.save()

        const patient = await Patient.create({
            first_name: patientInfo.first_name,
            last_name: patientInfo.last_name,
            email: patientInfo.email,
            phone: patientInfo.phone,
            doctor_id: patientInfo.doctor_id,
            hospital_id: patientInfo.hospital_id,
            address: patientInfo.address,
            gender: patientInfo.gender,
            user_id: user._id
        })

        return response.json({ message: "Patient Saved" })
    }
    async show({ params, response }) {

        const patient = await Patient.find(params.id)
        const doctor = await Doctor.find(patient.doctor_id)
        const appointments = await Appointment.where('user_id').eq(patient._id).fetch()
        const hospital = await Hospital.find(patient.hospital_id)
        const user = await User.find(patient.user_id)
        const data = {
            id: patient._id,
            fname: patient.first_name,
            lname: patient.last_name,
            email: patient.email,
            address: patient.address,
            phone: patient.phone,
            gender: patient.gender,
            password: patient.password,
            appointments: appointments,
            doctor_id: patient.doctor_id,
            doctor: doctor,
            hospital: hospital,
            user:user
        }
        return response.json(data)
    }

    async update({ params, request, response }) {
        const patientInfo = request.only([
            'first_name',
            'last_name',
            'email',
            'phone',
            'address',
            'doctor_id',
            'user_id',
            'gender',
        ])
        const patient = await Patient.find(params.id)
        if (!patient) {
            return response.status(404).json({ data: "Data not found" })
        }
        patient.merge({
            first_name: patientInfo.first_name,
            last_name: patientInfo.last_name,
            email: patientInfo.email,
            gender: patientInfo.gender,
            phone: patientInfo.phone,
            address: patientInfo.address,
            doctor_id: patientInfo.doctor_id,
            user_id: patientInfo.user_id
        })
        await patient.save()
        return response.status(200).json({ message: "Patient Saved" })
    }
    async delete({ params, response }) {
        const patient = await Patient.find(params.id)

        if (!patient) {
            return response.status(404).json({ message: "No patient found" })
        }
        await patient.delete()
        return response.json({ message: "Patient deleted" })
    }
}
module.exports = PatientController
