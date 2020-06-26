'use strict'
const Appointment = use('App/Models/Appointment')
const Moment = use('moment')

class AppointmentController {

    async index({ params, response }) {
        const dbappointments = await Appointment.where('hospital_id').eq(params.id).fetch()

        return response.json(dbappointments)
    }
    async delete({ params, response }) {
        const appointment = await Appointment.find()

        if (!appointment) {
            return response.json({ data: "appointment not found" })
        }
        appointment.delete()
        return response.json({ message: 'apppointed deleted' })
    }
    async store({ params, request, response }) {
        const dbappointments = await Appointment.where('hospital_id').eq(params.id).fetch()
        const appointmentInfo = request.all()

        const appointment = {
            patient_id: appointmentInfo.patient_id,
            order_id: 0,
            title: appointmentInfo.title,
            description: appointmentInfo.description,
            hospital_id: appointmentInfo.hospital_id,
            priority: appointmentInfo.priority,
            doctor_id: appointmentInfo.doctor_id,
            start_time: '',
            end_time: '',
            duration: 1,
            status: 'pending'
        }
        const appointments = dbappointments.toJSON()


        if (appointments.length <= 0) {
            const time = new Moment
            time.hours(8).minutes(0).toString()

            const start_time = time.toString()
            const end_time = time.add(2, 'hours').toString()

            const appointment = await Appointment.create({
                patient_id: appointmentInfo.patient_id,
                order_id: 0,
                title: appointmentInfo.title,
                description: appointmentInfo.description,
                hospital_id: appointmentInfo.hospital_id,
                priority: appointmentInfo.priority,
                doctor_id: appointmentInfo.doctor_id,
                start_time: start_time,
                end_time: end_time,
                duration: 2,
                status: 'pending'
            })
            return response.json(appointment)
        }



        for (var i = 0; i < appointments.length; i++) {
            const deleteAppoint = await Appointment.find(appointments[i]._id)
            deleteAppoint.delete();
        }
        const pq = new PriorityQueue(appointments);

        const appointsToDatabase = pq.enqueue(appointment);

        for (var i = 0; i < appointsToDatabase.length; i++) {
            const saveAppoint = await Appointment.create({
                patient_id: appointsToDatabase[i].patient_id,
                order_id: appointsToDatabase[i].order_id,
                title: appointsToDatabase[i].title,
                description: appointsToDatabase[i].description,
                hospital_id: appointsToDatabase[i].hospital_id,
                priority: appointsToDatabase[i].priority,
                doctor_id: appointsToDatabase[i].doctor_id,
                start_time: appointsToDatabase[i].start_time,
                end_time: appointsToDatabase[i].end_time,
                duration: appointsToDatabase[i].duration,
                status: appointsToDatabase[i].status
            })
        }
        return response.json(appointsToDatabase)
    }

    async moment({ response }) {
        const time = new Moment("Mon Jun 22 2020 02:07:36 GMT+0200")

        //     m.hours(8).minutes(0)

        time.add(2, "hours")

        //     const time=new Moment
        //     time.hours(8).minutes(0)

        //    const start_time =time.format("hh:mm")
        //    const end_time=time.add(2, 'hours').format("hh:mm")
        // const end_time =time.add(2, "hours")
        return response.json(time.toString())
    }

    async show({ params, response }) {

        const ap = await Appointment.find(params._id)
        if (!ap) {
            return response.json({ message: 'Not found' })
        }

        return response.json(ap)
    }
    async switchApp({ response, request }) {
        const appointment1 = request.only(['appointment1_id', 'appointment2_id'])

        const appointment1Find =await Appointment.find(appointment1.appointment1_id)
        const appointment2Find =await Appointment.find(appointment1.appointment2_id)

        const order_id = appointment1Find.order_id
        const start_time = appointment1Find.start_time
        const end_time = appointment1Find.end_time

        appointment1Find.patient_id = appointment1Find.patient_id
        appointment1Find.order_id = appointment2Find.order_id
        appointment1Find.start_time = appointment2Find.start_time
        appointment1Find.end_time = appointment2Find.end_time
        appointment1Find.priority = appointment1Find.priority
        appointment1Find.doctor_id = appointment1Find.doctor_id
        appointment1Find.duration = appointment1Find.duration
        appointment1Find.status = appointment1Find.status
        appointment1Find.title = appointment1Find.title
        appointment1Find.description = appointment1Find.description
        appointment1Find.hospital_id = appointment1Find.hospital_id


        await appointment1Find.save()

        appointment2Find.patient_id = appointment2Find.patient_id
        appointment2Find.order_id = order_id
        appointment2Find.start_time = start_time
        appointment2Find.end_time = end_time
        appointment2Find.priority = appointment2Find.priority
        appointment2Find.doctor_id = appointment2Find.doctor_id
        appointment2Find.duration = appointment2Find.duration
        appointment2Find.status = appointment2Find.status
        appointment2Find.title = appointment2Find.title
        appointment2Find.description = appointment2Find.description
        appointment2Find.hospital_id = appointment2Find.hospital_id


        await appointment2Find.save()

        return response.json({ message: "Appointments switched" })
    }
}
function PriorityQueue(Appointments) {

    var appointments = Appointments;

    this.printappointments = function () {
        return appointments
    };
    this.enqueue = function (appointment) {
        if (this.isEmpty()) {
            appointments.push(appointment);
        } else {
            var added = false;
            for (var i = 0; i < appointments.length; i++) {
                if (appointment.priority > appointments[i].priority) {
                    // var time=new Moment(appointments[i].end_time)
                    // time.toString()
                    // appointment.start_time=appointments[i].start_time
                    // appointment.end_time=appointments[i].end_time

                    // appointments[i].start_time =time.toString()
                    // appointments[i].end_time=time.add(2, 'hours').toString()

                    appointments.splice(i, 0, appointment);
                    added = true;
                    break;
                }
            }
            if (!added) {
                // var length =appointments.length
                // var time2=new Moment(appointments[length-1].end_time)
                // time2.toString()
                // appointment.start_time=time2.toString()
                // appointment.end_time=time2.add(2, "hours").toString()
                appointments.push(appointment);
            }

            for (var i = 0; i < appointments.length; i++) {
                appointments[i].order_id = i
            }
            for (var i = 0; i < appointments.length; i++) {
                appointments[i].start_time = ''
                appointments[i].end_time = ''
            }
            const time = new Moment
            time.hours(8).minutes(0).toString()

            for (var i = 0; i < appointments.length; i++) {
                const time = new Moment
                time.hours(2 * i + 8).minutes(0).toString()
                appointments[i].start_time = time.toString()
                const time2 = new Moment(appointments[i].start_time)
                appointments[i].end_time = time2.add(2, 'hours').toString()
            }
        }

        return appointments;
    };
    this.dequeue = function () {
        var value = appointments.shift();
        return value[0];
    };
    this.front = function () {
        return appointments[0];
    };
    this.size = function () {
        return appointments.length;
    };
    this.isEmpty = function () {
        return (appointments.length === 0);
    };
}
module.exports = AppointmentController
