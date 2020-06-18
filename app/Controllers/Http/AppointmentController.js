'use strict'
 const Appointment = use('App/Models/Appointment')
 const Moment = use('moment')

class AppointmentController {

    async index({response}){
        const appointments = await Appointment.all()

        return response.json(appointments)
    }
    async delete({params, response}){
        const appointment =await Appointment.find()

        if(!appointment){
            return response.json({data:"appointment not found"})
        }
        appointment.delete()
        return response.json({message:'apppointed deleted'})
    }
  async store({request, response}){
     const dbappointments= await Appointment.find("5ee992a77c515db4a1cceabc")
     const appointmentInfo = request.all()

     const m= new Moment()

     const appointment={
        patient_id:appointmentInfo.patient_id,
        order_id:0,
        title:appointmentInfo.title,
        description:appointmentInfo.description,
        hospital_id:appointmentInfo.hospital_id,
        priority:appointmentInfo.priority,
        doctor_id:appointmentInfo.doctor_id,
        start_time:m.toString(),
        end_time:m.add(1, 'h').toString(),
        duration:1,
        status:'pending'
    }
      const appointments = dbappointments.Appointments

    const pq = new PriorityQueue(appointments); 
    
    const appointsToDatabase= pq.enqueue(appointment); 
    dbappointments.Appointments=appointsToDatabase

    dbappointments.save();
    return  response.json(dbappointments) 
  } 
}
 function PriorityQueue (Appointments) {
    
    var appointments=Appointments;
    
    this.printappointments = function() {
      return appointments
    };
    this.enqueue = function(appointment){
        if (this.isEmpty()){ 
            appointments.push(appointment);
        } else {
            var added = false;
            for (var i=0; i<appointments.length; i++){
                 if (appointment.priority < appointments[i].priority){
                    appointments.splice(i,0,appointment);
                    added = true;
                    break;
                }
            }
            if (!added){
                appointments.push(appointment);
            }
        }

        for(var i=0; i<appointments.length; i++){
            appointments[i].order_id=i
        }
        return appointments;
    };
    this.dequeue = function() {
        var value = appointments.shift();
        return value[0];
    };
    this.front = function() {
        return appointments[0];
    };
    this.size = function() {
        return appointments.length; 
    };
    this.isEmpty = function() {
        return (appointments.length === 0); 
    };
 }
module.exports = AppointmentController
