'use strict'
const Patient = use('App/Models/Patient')
const Doctor = use('App/Models/Doctor')
const Appointment = use('App/Models/Appointment')
const Hospital = use('App/Models/Hospital')

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
            'password'
        ])
        const patient = await Patient.create({
            first_name: patientInfo.first_name,
            last_name: patientInfo.last_name,
            email: patientInfo.email,
            phone: patientInfo.phone,
            doctor_id: patientInfo.doctor_id,
            hospital_id: patientInfo.hospital_id,
            address: patientInfo.address,
            gender: patientInfo.gender,
            password: await Hash.make(patientInfo.password)
        })
        return response.json(patient)
    }

    async show({ params, response }) {

        const patient = await Patient.find(params.id)
        const doctor = await Doctor.find(patient.doctor_id)
        const appointments = await Appointment.where('user_id').eq(patient.id).fetch()
        const hospital = await Hospital.find(patient.hospital_id)

        const data = {
            fname: patient.first_name,
            lname: patient.last_name,
            email: patient.email,
            address: patient.address,
            phone: patient.phone,
            gender: patient.gender,
            password: patient.password,
            appointments: appointments,
            doctor: doctor,
            hospital: hospital
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
            'password',
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
            password: patientInfo.password
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
